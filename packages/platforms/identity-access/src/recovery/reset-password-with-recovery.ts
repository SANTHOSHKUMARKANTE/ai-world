import { ApplicationError } from '@ai-world/foundation-errors';

import type { PasswordHasher } from '../password/password-hasher';
import type { PasswordRecoveryClock } from './password-recovery-clock';
import { normalizeAndValidatePasswordRecoveryPassword } from './password-recovery-password';
import type { PasswordRecoveryResetTransaction } from './password-recovery-reset-transaction';
import type { PasswordRecoveryTokenDigester } from './password-recovery-token-digester';

export interface ResetPasswordWithRecoveryInput {
  readonly token: string;
  readonly password: string;
}

export class ResetPasswordWithRecovery {
  public constructor(
    private readonly transaction: PasswordRecoveryResetTransaction,
    private readonly tokenDigester: PasswordRecoveryTokenDigester,
    private readonly passwordHasher: PasswordHasher,
    private readonly clock: PasswordRecoveryClock,
  ) {}

  public async execute(input: ResetPasswordWithRecoveryInput): Promise<void> {
    const normalizedPassword = normalizeAndValidatePasswordRecoveryPassword(input.password);

    const tokenDigest = this.tokenDigester.digest(input.token);

    // Intentionally outside the database transaction.
    const passwordHash = await this.passwordHasher.hash(normalizedPassword);

    const resetAt = this.clock.now();

    const reset = await this.transaction.reset({
      tokenDigest,
      passwordHash,
      resetAt,
    });

    if (!reset) {
      throw new ApplicationError({
        code: 'identity.password_recovery.invalid_token',
        kind: 'validation',
        message: 'Password recovery token is unknown, expired, consumed, or no longer applicable.',
        publicMessage: 'The password recovery token is invalid or expired.',
      });
    }
  }
}
