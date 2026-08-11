import { randomBytes } from 'node:crypto';

import type { EmailVerificationTokenGenerator } from './email-verification-token-generator';

export const EMAIL_VERIFICATION_TOKEN_RANDOM_BYTES = 32;

export class NodeEmailVerificationTokenGenerator implements EmailVerificationTokenGenerator {
  public generate(): string {
    return randomBytes(EMAIL_VERIFICATION_TOKEN_RANDOM_BYTES).toString('base64url');
  }
}
