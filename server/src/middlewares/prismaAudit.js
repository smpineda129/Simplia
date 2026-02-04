import { getContext } from '../utils/context.js';
import crypto from 'crypto';

export const createPrismaAudit = (prisma) => {
  return async (params, next) => {
    const { model, action, args } = params;

    // 0. Prevent infinite loops and ignore audit tables
    if (model === 'action_events' || model === 'Audit' || model === 'Session') {
      return next(params);
    }

    // 1. Determine if we should audit
    const writeActions = ['create', 'createMany', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
    const viewActions = ['findUnique', 'findFirst'];
    const viewModels = ['Proceeding', 'Document', 'Correspondence', 'Company', 'User'];

    const isWrite = writeActions.includes(action);
    const isView = viewActions.includes(action) && viewModels.includes(model);

    if (!isWrite && !isView) {
      return next(params);
    }

    // 2. Execute the action
    let result;
    try {
      result = await next(params);
    } catch (error) {
      throw error;
    }

    // 3. Log (fire-and-forget)
    // Avoid blocking the response
    logAudit(prisma, params, result).catch((err) => {
      // Silent fail to avoid noise, or log to system logger
      // console.error('⚠️ Audit Log Failed:', err.message);
    });

    return result;
  };
};

// Helper to match legacy Laravel model names
function mapToLegacyModel(prismaModel) {
  // Legacy format seems to be App\Models\ModelName
  return `App\\Models\\${prismaModel}`;
}

// Helper to format event names like "Create", "Update"
function formatEventName(action) {
  if (['create', 'createMany'].includes(action)) return 'Create';
  if (['update', 'updateMany', 'upsert'].includes(action)) return 'Update';
  if (['delete', 'deleteMany'].includes(action)) return 'Delete';
  if (['findUnique', 'findFirst'].includes(action)) return 'View';
  return 'Unknown';
}

async function logAudit(prisma, params, result) {
  const { model, action, args } = params;
  const store = getContext();

  const user = store?.get('user');

  // If no user context, we skip (or you could log as 'System')
  if (!user || !user.id) return;

  const userId = BigInt(user.id);
  const companyId = user.companyId ? BigInt(user.companyId) : null;
  const ip = store?.get('ip') || '';
  const userAgent = store?.get('userAgent') || '';

  const eventName = formatEventName(action);
  const legacyModelName = mapToLegacyModel(model);

  // Determine Target ID
  let targetId = BigInt(0);
  if (result && result.id) {
    targetId = BigInt(result.id);
  } else if (args?.where?.id) {
    targetId = BigInt(args.where.id);
  }

  // Handle BigInt serialization for JSON fields
  const safeStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  };

  // Prepare Changes/Original
  // In Laravel example:
  // - Create: "Changes" has the object, "Original" is empty/null.
  // - Update: "Changes" usually has what changed, "Original" has old values.
  // - Delete: "Original" has the deleted object.

  let changes = null;
  let original = null;

  if (eventName === 'Create') {
    // For Create, result is the new object
    changes = result ? safeStringify(result) : safeStringify(args.data);
  } else if (eventName === 'Update') {
    // For Update, args.data has the changes.
    // Ideally we'd want 'before' state in original, but Prisma middleware happens *around* the query.
    // Standard Prisma Middleware doesn't give 'before' value easily without an extra query.
    // For now, we log the 'data' passed to update in changes.
    changes = args.data ? safeStringify(args.data) : null;
    // Note: To get 'original', we would need to query before update.
    // To keep it 'fire-and-forget' and fast, we might skip 'original' or accept that limitation.
  } else if (eventName === 'Delete') {
    // For Delete, result is the deleted object
    original = result ? safeStringify(result) : null;
  }

  // Metadata: IP, User Agent.
  // User asked to keep "Fields" empty if possible or maintain legacy.
  // However, earlier requirements asked for IP/UA.
  // Legacy example shows "Fields": "vacío".
  // I will put metadata in 'fields' but keep it minimal JSON, or empty if strictly requested.
  // Given the dual requirement (Robust Audit vs Match Legacy), I will put the connection info in 'fields' JSON.
  // If the user wants it EXACTLY "vacío", I'd pass an empty string, but then we lose IP/UA.
  // I will store the context in a simple JSON.
  const fields = safeStringify({
    ip,
    userAgent,
    // filteredArgs: args?.where // Optional: keep context of the query
  });

  await prisma.action_events.create({
    data: {
      batch_id: crypto.randomUUID(),
      user_id: userId,
      name: eventName, // "Create", "Update", etc.
      actionable_type: legacyModelName, // "App\Models\Correspondence"
      actionable_id: targetId,
      target_type: legacyModelName,
      target_id: targetId,
      model_type: legacyModelName,
      model_id: targetId,
      fields: fields, // JSON with IP/UA
      status: 'finished',
      exception: '',
      created_at: new Date(),
      updated_at: new Date(),
      original: original,
      changes: changes,
      companyId: companyId
    }
  });
}
