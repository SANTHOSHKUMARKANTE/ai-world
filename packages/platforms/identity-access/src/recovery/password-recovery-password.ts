import { ApplicationError } from '@ai-world/foundation-errors';

import {
  REGISTRATION_PASSWORD_MAX_LENGTH,
  REGISTRATION_PASSWORD_MIN_LENGTH,
} from '../password/password-policy';

export const PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH = REGISTRATION_PASSWORD_MIN_LENGTH;
export const PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH = REGISTRATION_PASSWORD_MAX_LENGTH;

export function normalizeAndValidatePasswordRecoveryPassword(password: string): string {
  const normalizedPassword = password.normalize('NFC');
  const length = [...normalizedPassword].length;

  if (
    length < PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH ||
    length > PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH
  ) {
    throw new ApplicationError({
      code: 'identity.password_recovery.invalid_password',
      kind: 'validation',
      message: 'Recovery password does not satisfy the accepted password length policy.',
      publicMessage: `Password must contain between ${PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH} and ${PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH} characters.`,
    });
  }

  return normalizedPassword;
}
