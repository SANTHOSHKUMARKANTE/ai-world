import { describe, expect, it } from 'vitest';

import { isNamespacedKey, NAMESPACED_KEY_MAX_LENGTH, parseNamespacedKey } from '../src';

describe('NamespacedKey', () => {
  it('accepts the existing canonical Identity authorization Permission key', () => {
    expect(isNamespacedKey('identity.authorization.manage')).toBe(true);
  });

  it('accepts an upcoming Knowledge-style Permission key', () => {
    expect(isNamespacedKey('knowledge.resource.create')).toBe(true);
  });

  it('accepts two segments', () => {
    expect(isNamespacedKey('identity.session')).toBe(true);
  });

  it('accepts more than three segments', () => {
    expect(isNamespacedKey('knowledge.resource.lifecycle.publish')).toBe(true);
  });

  it('accepts digits after the beginning of a segment', () => {
    expect(isNamespacedKey('knowledge.resource2.create')).toBe(true);
  });

  it('accepts hyphens inside segments', () => {
    expect(isNamespacedKey('knowledge.resource-type.create')).toBe(true);
  });

  it('rejects an unnamespaced local key', () => {
    expect(isNamespacedKey('administrator')).toBe(false);
  });

  it('rejects uppercase text', () => {
    expect(isNamespacedKey('Identity.authorization.manage')).toBe(false);
  });

  it('rejects leading or trailing whitespace', () => {
    expect(isNamespacedKey(' identity.authorization.manage')).toBe(false);
    expect(isNamespacedKey('identity.authorization.manage ')).toBe(false);
  });

  it('rejects empty segments', () => {
    expect(isNamespacedKey('identity..manage')).toBe(false);
  });

  it('rejects leading and trailing separators', () => {
    expect(isNamespacedKey('.identity.authorization.manage')).toBe(false);
    expect(isNamespacedKey('identity.authorization.manage.')).toBe(false);
  });

  it('rejects underscores', () => {
    expect(isNamespacedKey('identity.authorization.invalid_request')).toBe(false);
  });

  it('rejects segments that begin or end with a hyphen', () => {
    expect(isNamespacedKey('identity.-authorization.manage')).toBe(false);
    expect(isNamespacedKey('identity.authorization-.manage')).toBe(false);
  });

  it('rejects repeated hyphens inside a segment', () => {
    expect(isNamespacedKey('identity.authorization--policy.manage')).toBe(false);
  });

  it('rejects keys longer than the canonical maximum', () => {
    const value = `identity.${'a'.repeat(NAMESPACED_KEY_MAX_LENGTH)}`;

    expect(isNamespacedKey(value)).toBe(false);
  });

  it('accepts a key exactly at the canonical maximum length', () => {
    const prefix = 'identity.';
    const remainingLength = NAMESPACED_KEY_MAX_LENGTH - prefix.length;
    const value = `${prefix}${'a'.repeat(remainingLength)}`;

    expect(value).toHaveLength(NAMESPACED_KEY_MAX_LENGTH);
    expect(isNamespacedKey(value)).toBe(true);
  });

  it('rejects non-string values', () => {
    expect(isNamespacedKey(undefined)).toBe(false);
    expect(isNamespacedKey(null)).toBe(false);
    expect(isNamespacedKey(123)).toBe(false);
    expect(isNamespacedKey({})).toBe(false);
  });

  it('parses a canonical NamespacedKey without modifying it', () => {
    const value = 'identity.authorization.manage';

    expect(parseNamespacedKey(value)).toBe(value);
  });

  it('fails parsing instead of normalizing invalid input', () => {
    expect(() => parseNamespacedKey('Identity.authorization.manage')).toThrow(
      'Namespaced key must be a canonical lowercase dot-separated key no longer than 128 characters.',
    );
  });
});
