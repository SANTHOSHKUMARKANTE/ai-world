import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const passwordRecoveryIssueRequestSchema = z
  .object({
    email: z.string(),
  })
  .strict();

const passwordRecoveryResetRequestSchema = z
  .object({
    token: z.string().min(1).max(512),
    password: z.string(),
  })
  .strict();

export interface PasswordRecoveryIssueRequest {
  readonly email: string;
}

export interface PasswordRecoveryResetRequest {
  readonly token: string;
  readonly password: string;
}

function invalidPasswordRecoveryRequest(): ApplicationError {
  return new ApplicationError({
    code: 'identity.password_recovery.invalid_request',
    kind: 'validation',
    message: 'Password recovery request payload failed transport validation.',
    publicMessage: 'The password recovery request is invalid.',
  });
}

export function parsePasswordRecoveryIssueRequest(input: unknown): PasswordRecoveryIssueRequest {
  const result = passwordRecoveryIssueRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidPasswordRecoveryRequest();
  }

  return result.data;
}

export function parsePasswordRecoveryResetRequest(input: unknown): PasswordRecoveryResetRequest {
  const result = passwordRecoveryResetRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidPasswordRecoveryRequest();
  }

  return result.data;
}
