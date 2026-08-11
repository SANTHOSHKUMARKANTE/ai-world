import { ApplicationError } from '@ai-world/foundation-errors';

export const USER_DISPLAY_NAME_MIN_LENGTH = 1;
export const USER_DISPLAY_NAME_MAX_LENGTH = 80;

function countUnicodeCodePoints(value: string): number {
  return [...value].length;
}

export function normalizeUserDisplayName(displayName: string | null): string | null {
  if (displayName === null) {
    return null;
  }

  const normalizedDisplayName = displayName.trim().normalize('NFC');
  const length = countUnicodeCodePoints(normalizedDisplayName);

  if (length < USER_DISPLAY_NAME_MIN_LENGTH || length > USER_DISPLAY_NAME_MAX_LENGTH) {
    throw new ApplicationError({
      code: 'user.profile.invalid_display_name',
      kind: 'validation',
      message: `Display name must contain between ${USER_DISPLAY_NAME_MIN_LENGTH} and ${USER_DISPLAY_NAME_MAX_LENGTH} Unicode characters after normalization.`,
      publicMessage: 'Display name must contain between 1 and 80 characters.',
    });
  }

  return normalizedDisplayName;
}
