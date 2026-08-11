import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  PasswordRecoveryChallengeWriter,
  UpsertPasswordRecoveryChallengeInput,
} from './password-recovery-challenge-writer';
import type {
  PasswordRecoveryActorEmail,
  PasswordRecoveryReader,
} from './password-recovery-reader';

export class PrismaPasswordRecoveryRepository
  implements PasswordRecoveryReader, PasswordRecoveryChallengeWriter
{
  public constructor(private readonly database: DatabaseClient) {}

  public async findRecoverableActorEmailByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<PasswordRecoveryActorEmail | null> {
    const actorEmail = await this.database.actorEmail.findUnique({
      where: {
        normalizedEmail,
      },
      select: {
        id: true,
        email: true,
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
    });

    if (!actorEmail?.actor.passwordCredential) {
      return null;
    }

    return {
      actorEmailId: actorEmail.id,
      email: actorEmail.email,
    };
  }

  public async upsertCurrentChallenge(input: UpsertPasswordRecoveryChallengeInput): Promise<void> {
    await this.database.passwordRecoveryChallenge.upsert({
      where: {
        actorEmailId: input.actorEmailId,
      },
      create: {
        actorEmailId: input.actorEmailId,
        tokenDigest: input.tokenDigest,
        expiresAt: input.expiresAt,
      },
      update: {
        tokenDigest: input.tokenDigest,
        expiresAt: input.expiresAt,
        consumedAt: null,
      },
    });
  }
}
