import { randomUUID } from 'node:crypto';

/**
 * Canonical identifier for an AI World Resource.
 *
 * ResourceId intentionally remains a string at runtime so existing
 * persisted UUID identifiers do not require migration or wrapping.
 *
 * Canonical ResourceId values are lowercase UUID v4 strings.
 */
export type ResourceId = string;

const RESOURCE_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * Generates a new canonical AI World Resource identifier.
 */
export function generateResourceId(): ResourceId {
  return randomUUID();
}

/**
 * Returns whether an unknown value is already in canonical ResourceId form.
 *
 * Validation is intentionally strict:
 *
 * - string only
 * - lowercase hexadecimal
 * - UUID v4
 * - canonical hyphen placement
 * - no surrounding whitespace
 */
export function isResourceId(value: unknown): value is ResourceId {
  return typeof value === 'string' && RESOURCE_ID_PATTERN.test(value);
}

/**
 * Validates an existing Resource identifier.
 *
 * This function does not trim, lowercase, or otherwise normalize input.
 * Invalid identifiers fail instead of silently changing identity values.
 */
export function parseResourceId(value: string): ResourceId {
  if (!isResourceId(value)) {
    throw new TypeError('Resource ID must be a canonical lowercase UUID v4 string.');
  }

  return value;
}
