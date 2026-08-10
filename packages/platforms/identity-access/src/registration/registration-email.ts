import { ApplicationError } from '@ai-world/foundation-errors';

export const REGISTRATION_EMAIL_MAX_LENGTH = 254;

export interface RegistrationEmail {
  readonly email: string;
  readonly normalizedEmail: string;
}

const registrationEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function normalizeAndValidateRegistrationEmail(input: string): RegistrationEmail {
  const email = input.trim();
  const length = [...email].length;

  if (
    email.length === 0 ||
    length > REGISTRATION_EMAIL_MAX_LENGTH ||
    !registrationEmailPattern.test(email)
  ) {
    throw new ApplicationError({
      code: 'identity.registration.invalid_email',
      kind: 'validation',
      message: 'Registration email is not valid.',
      publicMessage: 'A valid email address is required.',
    });
  }

  return {
    email,
    normalizedEmail: email.toLowerCase(),
  };
}
