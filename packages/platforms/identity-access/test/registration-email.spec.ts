import { describe, expect, it } from 'vitest';

import { normalizeAndValidateRegistrationEmail, REGISTRATION_EMAIL_MAX_LENGTH } from '../src';

describe('registration email policy', () => {
  it('trims presentation whitespace and creates a lowercase lookup value', () => {
    expect(normalizeAndValidateRegistrationEmail('  Person.Name@Example.COM  ')).toEqual({
      email: 'Person.Name@Example.COM',
      normalizedEmail: 'person.name@example.com',
    });
  });

  it('rejects an invalid email address', () => {
    expect(() => normalizeAndValidateRegistrationEmail('not-an-email')).toThrowError(
      expect.objectContaining({
        code: 'identity.registration.invalid_email',
        kind: 'validation',
      }),
    );
  });

  it('rejects an empty email address', () => {
    expect(() => normalizeAndValidateRegistrationEmail('   ')).toThrowError(
      expect.objectContaining({
        code: 'identity.registration.invalid_email',
        kind: 'validation',
      }),
    );
  });

  it('rejects an email above the maximum accepted length', () => {
    const email = `${'a'.repeat(REGISTRATION_EMAIL_MAX_LENGTH)}@example.com`;

    expect(() => normalizeAndValidateRegistrationEmail(email)).toThrowError(
      expect.objectContaining({
        code: 'identity.registration.invalid_email',
        kind: 'validation',
      }),
    );
  });
});
