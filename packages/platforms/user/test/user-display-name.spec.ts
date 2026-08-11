import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import { normalizeUserDisplayName, USER_DISPLAY_NAME_MAX_LENGTH } from '../src';

describe('User display name', () => {
  it('preserves null as the explicit cleared profile state', () => {
    expect(normalizeUserDisplayName(null)).toBeNull();
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalizeUserDisplayName('  Ada Lovelace  ')).toBe('Ada Lovelace');
  });

  it('preserves internal whitespace', () => {
    expect(normalizeUserDisplayName('Ada   Lovelace')).toBe('Ada   Lovelace');
  });

  it('normalizes display names to NFC', () => {
    const decomposed = 'Jose\u0301';

    expect(normalizeUserDisplayName(decomposed)).toBe('José');
  });

  it('accepts a display name containing exactly 80 Unicode code points', () => {
    const displayName = '𐐷'.repeat(USER_DISPLAY_NAME_MAX_LENGTH);

    expect(normalizeUserDisplayName(displayName)).toBe(displayName);
  });

  it('rejects an empty display name', () => {
    expect(() => normalizeUserDisplayName('')).toThrowError(
      expect.objectContaining({
        code: 'user.profile.invalid_display_name',
      }),
    );
  });

  it('rejects a display name containing only whitespace', () => {
    expect(() => normalizeUserDisplayName('     ')).toThrowError(
      expect.objectContaining({
        code: 'user.profile.invalid_display_name',
      }),
    );
  });

  it('rejects a display name longer than 80 Unicode code points', () => {
    const displayName = '𐐷'.repeat(USER_DISPLAY_NAME_MAX_LENGTH + 1);

    expect(() => normalizeUserDisplayName(displayName)).toThrowError(
      expect.objectContaining({
        code: 'user.profile.invalid_display_name',
      }),
    );
  });

  it('exposes the canonical validation error as an ApplicationError', () => {
    try {
      normalizeUserDisplayName(' ');
    } catch (error) {
      expect(error).toBeInstanceOf(ApplicationError);
      expect(error).toMatchObject({
        code: 'user.profile.invalid_display_name',
        kind: 'validation',
        publicMessage: 'Display name must contain between 1 and 80 characters.',
      });

      return;
    }

    throw new Error('Expected display-name validation to fail.');
  });
});
