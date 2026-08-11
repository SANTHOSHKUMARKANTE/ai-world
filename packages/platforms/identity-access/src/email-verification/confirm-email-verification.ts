import { ApplicationError } from '@ai-world/foundation-errors';

import type { EmailVerificationClock } from './email-verification-clock';
import type { EmailVerificationConfirmationTransaction } from './email-verification-confirmation-transaction';
import type { EmailVerificationTokenDigester } from './email-verification-token-digester';

export interface ConfirmEmailVerificationInput {
  readonly token: string;
}

export class ConfirmEmailVerification {
  public constructor(
    private readonly transaction: EmailVerificationConfirmationTransaction,
    private readonly tokenDigester: EmailVerificationTokenDigester,
    private readonly clock: EmailVerificationClock,
  ) {}

  public async execute(input: ConfirmEmailVerificationInput): Promise<void> {
    const tokenDigest = this.tokenDigester.digest(input.token);
    const confirmedAt = this.clock.now();

    const confirmed = await this.transaction.confirm({
      tokenDigest,
      confirmedAt,
    });

    if (!confirmed) {
      throw new ApplicationError({
        code: 'identity.email_verification.invalid_token',
        kind: 'validation',
        message: 'Email verification token is unknown, expired, consumed, or no longer applicable.',
        publicMessage: 'The email verification token is invalid or expired.',
      });
    }
  }
}
