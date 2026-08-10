import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import {
  normalizeAndValidateRegistrationPassword,
  REGISTRATION_PASSWORD_MAX_LENGTH,
  REGISTRATION_PASSWORD_MIN_LENGTH,
} from '../src';

describe('registration password policy', () => {
  it('accepts a password at the minimum length', () => {
    const password = 'a'.repeat(REGISTRATION_PASSWORD_MIN_LENGTH);

    expect(normalizeAndValidateRegistrationPassword(password)).toBe(password);
  });

  it('rejects a password below the minimum length', () => {
    const password = 'a'.repeat(REGISTRATION_PASSWORD_MIN_LENGTH - 1);

    expect(() => normalizeAndValidateRegistrationPassword(password)).toThrow(ApplicationError);

    try {
      normalizeAndValidateRegistrationPassword(password);
    } catch (error) {
      expect(error).toMatchObject({
        code: 'identity.registration.invalid_password',
        kind: 'validation',
      });

      expect((error as Error).message).not.toContain(password);
    }
  });

  it('accepts a password at the maximum length', () => {
    const password = 'a'.repeat(REGISTRATION_PASSWORD_MAX_LENGTH);

    expect(normalizeAndValidateRegistrationPassword(password)).toBe(password);
  });

  it('rejects a password above the maximum length', () => {
    const password = 'a'.repeat(REGISTRATION_PASSWORD_MAX_LENGTH + 1);

    expect(() => normalizeAndValidateRegistrationPassword(password)).toThrow(ApplicationError);
  });

  it('normalizes Unicode passwords to NFC', () => {
    const decomposed = `Cafe\u0301-${'x'.repeat(10)}`;

    const normalized = normalizeAndValidateRegistrationPassword(decomposed);

    expect(normalized).toBe(decomposed.normalize('NFC'));
  });

  it('does not trim password whitespace', () => {
    const password = ` ${'a'.repeat(13)} `;

    expect(normalizeAndValidateRegistrationPassword(password)).toBe(password);
  });
});
