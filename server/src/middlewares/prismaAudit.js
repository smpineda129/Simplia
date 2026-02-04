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
      // Silent fail or minimal logging to avoid noise
      // console.error('⚠️ Audit Log Failed:', err.message);
    });

    return result;
  };
};

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

  let eventType = 'UNKNOWN';
  if (['create', 'createMany'].includes(action)) eventType = 'CREATE';
  else if (['update', 'updateMany', 'upsert'].includes(action)) eventType = 'UPDATE';
  else if (['delete', 'deleteMany'].includes(action)) eventType = 'DELETE';
  else if (['findUnique', 'findFirst'].includes(action)) eventType = 'VIEW';

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

  const changes = args?.data ? safeStringify(args.data) : null;
  const original = (action === 'delete' && result) ? safeStringify(result) : null;

  // Additional Metadata
  const metadata = {
    ip,
    userAgent,
    action,
    args: args ? { where: args.where } : {} // Log the query filter for context
  };

  await prisma.action_events.create({
    data: {
      batch_id: crypto.randomUUID(),
      user_id: userId,
      name: `${eventType} ${model}`,
      actionable_type: model,
      actionable_id: targetId,
      target_type: model,
      target_id: targetId,
      model_type: model,
      model_id: targetId,
      fields: safeStringify(metadata),
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
