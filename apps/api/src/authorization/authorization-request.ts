import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const authorizationRoleAssignmentRequestSchema = z
  .object({
    targetActorId: z.string().uuid(),
    roleKey: z.string().min(1).max(64),
  })
  .strict();

export interface AuthorizationRoleAssignmentRequest {
  readonly targetActorId: string;
  readonly roleKey: string;
}

export function parseAuthorizationRoleAssignmentRequest(
  input: unknown,
): AuthorizationRoleAssignmentRequest {
  const result = authorizationRoleAssignmentRequestSchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'identity.authorization.invalid_request',
      kind: 'validation',
      message: 'Authorization Role assignment request payload failed transport validation.',
      publicMessage: 'The authorization request is invalid.',
    });
  }

  return result.data;
}
