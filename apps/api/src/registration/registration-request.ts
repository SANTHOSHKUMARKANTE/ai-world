import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const registrationRequestSchema = z
  .object({
    email: z.string(),
    password: z.string(),
  })
  .strict();

export interface RegistrationRequest {
  readonly email: string;
  readonly password: string;
}

export function parseRegistrationRequest(input: unknown): RegistrationRequest {
  const result = registrationRequestSchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'identity.registration.invalid_request',
      kind: 'validation',
      message: 'Registration request payload failed transport validation.',
      publicMessage: 'The registration request is invalid.',
    });
  }

  return result.data;
}
