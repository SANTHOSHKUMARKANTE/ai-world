import { describe, expect, it } from 'vitest';

import { generateResourceId, isResourceId, parseResourceId } from '../src';

describe('ResourceId', () => {
  it('generates a canonical lowercase UUID v4 ResourceId', () => {
    const resourceId = generateResourceId();

    expect(isResourceId(resourceId)).toBe(true);
    expect(resourceId).toBe(resourceId.toLowerCase());
  });

  it('generates distinct ResourceIds', () => {
    const firstResourceId = generateResourceId();
    const secondResourceId = generateResourceId();

    expect(firstResourceId).not.toBe(secondResourceId);
  });

  it('accepts a canonical lowercase UUID v4 ResourceId', () => {
    expect(isResourceId('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
  });

  it('rejects uppercase UUID text because it is not canonical', () => {
    expect(isResourceId('550E8400-E29B-41D4-A716-446655440000')).toBe(false);
  });

  it('rejects a UUID with surrounding whitespace', () => {
    expect(isResourceId(' 550e8400-e29b-41d4-a716-446655440000 ')).toBe(false);
  });

  it('rejects a non-v4 UUID', () => {
    expect(isResourceId('550e8400-e29b-11d4-a716-446655440000')).toBe(false);
  });

  it('rejects the nil UUID', () => {
    expect(isResourceId('00000000-0000-0000-0000-000000000000')).toBe(false);
  });

  it('rejects malformed identifier text', () => {
    expect(isResourceId('not-a-resource-id')).toBe(false);
    expect(isResourceId('550e8400e29b41d4a716446655440000')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(isResourceId(undefined)).toBe(false);
    expect(isResourceId(null)).toBe(false);
    expect(isResourceId(123)).toBe(false);
    expect(isResourceId({})).toBe(false);
  });

  it('parses an existing canonical ResourceId without modifying it', () => {
    const value = '550e8400-e29b-41d4-a716-446655440000';

    expect(parseResourceId(value)).toBe(value);
  });

  it('fails parsing instead of normalizing an invalid ResourceId', () => {
    expect(() => parseResourceId('550E8400-E29B-41D4-A716-446655440000')).toThrow(
      'Resource ID must be a canonical lowercase UUID v4 string.',
    );
  });
});
