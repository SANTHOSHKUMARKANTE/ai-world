/**
 * Canonical collision-safe semantic key used by shared AI World capabilities.
 *
 * NamespacedKey intentionally remains a string at runtime so existing
 * persisted permission keys do not require migration or wrapping.
 *
 * Canonical examples:
 *
 * identity.authorization.manage
 * knowledge.resource.create
 * media.asset.upload
 */
export type NamespacedKey = string;

export const NAMESPACED_KEY_MAX_LENGTH = 128;

const NAMESPACED_KEY_PATTERN =
  /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)+$/;

/**
 * Returns whether an unknown value is already in canonical NamespacedKey form.
 *
 * Canonical rules:
 *
 * - string only
 * - maximum 128 characters
 * - at least two dot-separated segments
 * - lowercase ASCII letters
 * - digits permitted after a segment begins
 * - hyphens permitted inside segments
 * - segments cannot begin or end with a hyphen
 * - repeated hyphens are not permitted
 * - empty segments are not permitted
 * - whitespace is not permitted
 * - input is not implicitly normalized
 */
export function isNamespacedKey(value: unknown): value is NamespacedKey {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= NAMESPACED_KEY_MAX_LENGTH &&
    NAMESPACED_KEY_PATTERN.test(value)
  );
}

/**
 * Validates an existing namespaced key without modifying it.
 *
 * Invalid keys fail instead of being silently trimmed, lowercased,
 * or otherwise normalized.
 */
export function parseNamespacedKey(value: string): NamespacedKey {
  if (!isNamespacedKey(value)) {
    throw new TypeError(
      'Namespaced key must be a canonical lowercase dot-separated key no longer than 128 characters.',
    );
  }

  return value;
}
