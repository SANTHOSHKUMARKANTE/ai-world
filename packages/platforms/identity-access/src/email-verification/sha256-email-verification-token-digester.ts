import { createHash } from 'node:crypto';

import type { EmailVerificationTokenDigester } from './email-verification-token-digester';

export const EMAIL_VERIFICATION_TOKEN_DIGEST_LENGTH = 64;

export class Sha256EmailVerificationTokenDigester implements EmailVerificationTokenDigester {
  public digest(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }
}
