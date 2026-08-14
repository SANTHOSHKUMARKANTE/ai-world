import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';

import type {
  AuditContext,
  AuditContextValue,
  AuditRecord,
  RecordAuditInput,
} from './audit-record';

function isAuditContextValue(value: unknown): value is AuditContextValue {
  if (value === null) {
    return true;
  }

  switch (typeof value) {
    case 'string':
    case 'boolean':
      return true;

    case 'number':
      return Number.isFinite(value);

    default:
      return false;
  }
}

function validateAuditContext(context: unknown): AuditContext | undefined {
  if (context === undefined) {
    return undefined;
  }

  if (typeof context !== 'object' || context === null || Array.isArray(context)) {
    throw new TypeError('Audit context must be a flat object when provided.');
  }

  const validated: Record<string, AuditContextValue> = {};

  for (const [key, value] of Object.entries(context)) {
    if (key.length === 0) {
      throw new TypeError('Audit context keys must not be empty.');
    }

    if (!isAuditContextValue(value)) {
      throw new TypeError(
        'Audit context values must be strings, finite numbers, booleans, or null.',
      );
    }

    validated[key] = value;
  }

  return validated;
}

export function createAuditRecord(
  input: RecordAuditInput,
  id: ResourceId,
  recordedAt: Date,
): AuditRecord {
  const canonicalId = parseResourceId(id);
  const actorId = parseResourceId(input.actorId);
  const action = parseNamespacedKey(input.action);
  const resourceType = parseNamespacedKey(input.resource.type);
  const resourceId = parseResourceId(input.resource.id);
  const result = parseNamespacedKey(input.result);

  if (!(recordedAt instanceof Date) || Number.isNaN(recordedAt.getTime())) {
    throw new TypeError('Audit recordedAt must be a valid Date.');
  }

  const context = validateAuditContext(input.context);

  return {
    id: canonicalId,
    actorId,
    action,
    resource: {
      type: resourceType,
      id: resourceId,
    },
    result,
    ...(context === undefined ? {} : { context }),
    recordedAt: new Date(recordedAt.getTime()),
  };
}
