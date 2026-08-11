import { randomBytes } from 'node:crypto';

import type { PasswordRecoveryTokenGenerator } from './password-recovery-token-generator';

export const PASSWORD_RECOVERY_TOKEN_RANDOM_BYTES = 32;

export class NodePasswordRecoveryTokenGenerator implements PasswordRecoveryTokenGenerator {
  public generate(): string {
    return randomBytes(PASSWORD_RECOVERY_TOKEN_RANDOM_BYTES).toString('base64url');
  }
}
