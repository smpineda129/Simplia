import { getContext } from '../utils/context.js';
import crypto from 'crypto';
import { auditCache } from '../utils/auditCache.js';

export const createPrismaAudit = (prisma) => {
  return async (params, next) => {
    const { model, action, args } = params;

    // 0. Prevent infinite loops and ignore audit tables
    if (model === 'action_events' || model === 'Audit' || model === 'Session') {
      return next(params);
    }

    const store = getContext();

    // 1. Determine if we should audit
    const writeActions = ['create', 'createMany', 'update', 'updateMany', 'delete', 'deleteMany', 'upsert'];
    const viewActions = ['findUnique', 'findFirst'];

    // Only audit "View" actions for these key business models
    const viewModels = ['Proceeding', 'Document', 'Correspondence', 'Company', 'User', 'Area', 'Retention'];

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
    logAudit(prisma, params, result).catch((err) => {
      console.error('⚠️ Audit Log Failed:', err);
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
  console.log(`[Audit Middleware] Processing audit for: ${model}.${action} - User found: ${!!user}`);

  if (!user || !user.id) {
    return;
  }

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

  // Deduplication for View Events
  // If it's a View event, check cache
  if (eventName === 'View') {
    if (!auditCache.shouldLog(user.id.toString(), eventName, legacyModelName, targetId.toString())) {
      return; // Skip duplicate log
    }
  }

  // Handle BigInt serialization for JSON fields
  const safeStringify = (obj) => {
    return JSON.stringify(obj, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    );
  };

  // Prepare Changes/Original
  let changes = null;
  let original = null;

  if (eventName === 'Create') {
    changes = result ? safeStringify(result) : safeStringify(args.data);
  } else if (eventName === 'Update') {
    changes = args.data ? safeStringify(args.data) : null;
  } else if (eventName === 'Delete') {
    original = result ? safeStringify(result) : null;
  }

  // Fields should be strictly empty for standard CRUD as per user request
  // (metadata is now in ipAddress/userAgent columns)
  const fields = '';

  await prisma.action_events.create({
    data: {
      batch_id: crypto.randomUUID(),
      user_id: userId,
      name: eventName,
      actionable_type: legacyModelName,
      actionable_id: targetId,
      target_type: legacyModelName,
      target_id: targetId,
      model_type: legacyModelName,
      model_id: targetId,
      fields: fields,
      status: 'finished',
      exception: '',
      created_at: new Date(),
      updated_at: new Date(),
      original: original,
      changes: changes,
      companyId: companyId,
      ipAddress: ip,
      userAgent: userAgent
    }
  });
}
