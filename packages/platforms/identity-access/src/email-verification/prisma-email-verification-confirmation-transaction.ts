import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  ConfirmEmailVerificationTransactionInput,
  EmailVerificationConfirmationTransaction,
} from './email-verification-confirmation-transaction';

export class PrismaEmailVerificationConfirmationTransaction implements EmailVerificationConfirmationTransaction {
  public constructor(private readonly database: DatabaseClient) {}

  public async confirm(input: ConfirmEmailVerificationTransactionInput): Promise<boolean> {
    return this.database.$transaction(async (transaction) => {
      const challenge = await transaction.emailVerificationChallenge.findUnique({
        where: {
          tokenDigest: input.tokenDigest,
        },
        select: {
          id: true,
          actorEmailId: true,
          expiresAt: true,
          consumedAt: true,
          actorEmail: {
            select: {
              verifiedAt: true,
            },
          },
        },
      });

      if (!challenge) {
        return false;
      }

      if (challenge.consumedAt !== null) {
        return false;
      }

      if (challenge.actorEmail.verifiedAt !== null) {
        return false;
      }

      if (challenge.expiresAt.getTime() <= input.confirmedAt.getTime()) {
        return false;
      }

      const consumption = await transaction.emailVerificationChallenge.updateMany({
        where: {
          id: challenge.id,
          consumedAt: null,
          expiresAt: {
            gt: input.confirmedAt,
          },
        },
        data: {
          consumedAt: input.confirmedAt,
        },
      });

      if (consumption.count !== 1) {
        return false;
      }

      await transaction.actorEmail.update({
        where: {
          id: challenge.actorEmailId,
        },
        data: {
          verifiedAt: input.confirmedAt,
        },
      });

      return true;
    });
  }
}
