import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const userProfileUpdateRequestSchema = z
  .object({
    displayName: z.string().nullable(),
  })
  .strict();

export interface UserProfileUpdateRequest {
  readonly displayName: string | null;
}

function invalidUserProfileRequest(): ApplicationError {
  return new ApplicationError({
    code: 'user.profile.invalid_request',
    kind: 'validation',
    message: 'User profile request payload failed transport validation.',
    publicMessage: 'The user profile request is invalid.',
  });
}

export function parseUserProfileUpdateRequest(input: unknown): UserProfileUpdateRequest {
  const result = userProfileUpdateRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidUserProfileRequest();
  }

  return result.data;
}
