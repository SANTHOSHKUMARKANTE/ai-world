import { createHash } from 'node:crypto';

import type { PasswordRecoveryTokenDigester } from './password-recovery-token-digester';

export const PASSWORD_RECOVERY_TOKEN_DIGEST_LENGTH = 64;

export class Sha256PasswordRecoveryTokenDigester implements PasswordRecoveryTokenDigester {
  public digest(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
  }
}
