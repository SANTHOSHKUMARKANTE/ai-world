import { ApplicationError } from '@ai-world/foundation-errors';

export const REGISTRATION_PASSWORD_MIN_LENGTH = 15;
export const REGISTRATION_PASSWORD_MAX_LENGTH = 128;

export function normalizeAndValidateRegistrationPassword(password: string): string {
  const normalizedPassword = password.normalize('NFC');
  const length = [...normalizedPassword].length;

  if (length < REGISTRATION_PASSWORD_MIN_LENGTH || length > REGISTRATION_PASSWORD_MAX_LENGTH) {
    throw new ApplicationError({
      code: 'identity.registration.invalid_password',
      kind: 'validation',
      message: 'Registration password does not satisfy the accepted length policy.',
      publicMessage: `Password must contain between ${REGISTRATION_PASSWORD_MIN_LENGTH} and ${REGISTRATION_PASSWORD_MAX_LENGTH} characters.`,
    });
  }

  return normalizedPassword;
}
