export const PASSWORD_RECOVERY_EMAIL_MAX_LENGTH = 254;

const passwordRecoveryEmailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;

export function normalizePasswordRecoveryEmail(input: string): string | null {
  const email = input.trim();
  const length = [...email].length;

  if (
    email.length === 0 ||
    length > PASSWORD_RECOVERY_EMAIL_MAX_LENGTH ||
    !passwordRecoveryEmailPattern.test(email)
  ) {
    return null;
  }

  return email.toLowerCase();
}
