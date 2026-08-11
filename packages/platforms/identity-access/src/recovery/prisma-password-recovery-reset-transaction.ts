import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  PasswordRecoveryResetTransaction,
  ResetPasswordWithRecoveryTransactionInput,
} from './password-recovery-reset-transaction';

export class PrismaPasswordRecoveryResetTransaction implements PasswordRecoveryResetTransaction {
  public constructor(private readonly database: DatabaseClient) {}

  public async reset(input: ResetPasswordWithRecoveryTransactionInput): Promise<boolean> {
    return this.database.$transaction(async (transaction) => {
      const challenge = await transaction.passwordRecoveryChallenge.findUnique({
        where: {
          tokenDigest: input.tokenDigest,
        },
        select: {
          id: true,
          expiresAt: true,
          consumedAt: true,
          actorEmail: {
            select: {
              actorId: true,
              actor: {
                select: {
                  passwordCredential: {
                    select: {
                      id: true,
                    },
                  },
                },
              },
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

      if (challenge.expiresAt.getTime() <= input.resetAt.getTime()) {
        return false;
      }

      if (!challenge.actorEmail.actor.passwordCredential) {
        return false;
      }

      const consumption = await transaction.passwordRecoveryChallenge.updateMany({
        where: {
          id: challenge.id,
          consumedAt: null,
          expiresAt: {
            gt: input.resetAt,
          },
        },
        data: {
          consumedAt: input.resetAt,
        },
      });

      if (consumption.count !== 1) {
        return false;
      }

      const actorId = challenge.actorEmail.actorId;

      await transaction.passwordCredential.update({
        where: {
          actorId,
        },
        data: {
          passwordHash: input.passwordHash,
        },
      });

      await transaction.session.updateMany({
        where: {
          actorId,
          revokedAt: null,
        },
        data: {
          revokedAt: input.resetAt,
        },
      });

      return true;
    });
  }
}
