import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const emailVerificationIssueRequestSchema = z.union([z.undefined(), z.object({}).strict()]);

const emailVerificationConfirmationRequestSchema = z
  .object({
    token: z.string().min(1).max(512),
  })
  .strict();

export interface EmailVerificationConfirmationRequest {
  readonly token: string;
}

function invalidEmailVerificationRequest(): ApplicationError {
  return new ApplicationError({
    code: 'identity.email_verification.invalid_request',
    kind: 'validation',
    message: 'Email verification request payload failed transport validation.',
    publicMessage: 'The email verification request is invalid.',
  });
}

export function parseEmailVerificationIssueRequest(input: unknown): void {
  const result = emailVerificationIssueRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidEmailVerificationRequest();
  }
}

export function parseEmailVerificationConfirmationRequest(
  input: unknown,
): EmailVerificationConfirmationRequest {
  const result = emailVerificationConfirmationRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidEmailVerificationRequest();
  }

  return result.data;
}
