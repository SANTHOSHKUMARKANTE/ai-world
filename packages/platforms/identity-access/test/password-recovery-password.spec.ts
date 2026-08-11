import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import {
  normalizeAndValidatePasswordRecoveryPassword,
  PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH,
  PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH,
} from '../src';

describe('password recovery password policy', () => {
  it('accepts a password at the minimum length', () => {
    const password = 'a'.repeat(PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH);

    expect(normalizeAndValidatePasswordRecoveryPassword(password)).toBe(password);
  });

  it('rejects a password below the minimum length with Recovery semantics', () => {
    const password = 'a'.repeat(PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH - 1);

    let thrown: unknown;

    try {
      normalizeAndValidatePasswordRecoveryPassword(password);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(ApplicationError);
    expect(thrown).toMatchObject({
      code: 'identity.password_recovery.invalid_password',
      kind: 'validation',
    });

    expect((thrown as Error).message).not.toContain(password);
  });

  it('accepts a password at the maximum length', () => {
    const password = 'a'.repeat(PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH);

    expect(normalizeAndValidatePasswordRecoveryPassword(password)).toBe(password);
  });

  it('rejects a password above the maximum length', () => {
    const password = 'a'.repeat(PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH + 1);

    expect(() => normalizeAndValidatePasswordRecoveryPassword(password)).toThrow(ApplicationError);
  });

  it('normalizes Unicode passwords to NFC', () => {
    const decomposed = `Cafe\u0301-${'x'.repeat(10)}`;

    const normalized = normalizeAndValidatePasswordRecoveryPassword(decomposed);

    expect(normalized).toBe(decomposed.normalize('NFC'));
  });

  it('does not trim password whitespace', () => {
    const password = ` ${'a'.repeat(13)} `;

    expect(normalizeAndValidatePasswordRecoveryPassword(password)).toBe(password);
  });
});
