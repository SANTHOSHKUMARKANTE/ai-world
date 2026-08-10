import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const passwordAuthenticationRequestSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .strict();

export interface PasswordAuthenticationRequest {
  readonly email: string;
  readonly password: string;
}

export function parsePasswordAuthenticationRequest(input: unknown): PasswordAuthenticationRequest {
  const result = passwordAuthenticationRequestSchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'identity.authentication.invalid_request',
      kind: 'validation',
      message: 'Password authentication request payload failed transport validation.',
      publicMessage: 'The authentication request is invalid.',
    });
  }

  return result.data;
}
