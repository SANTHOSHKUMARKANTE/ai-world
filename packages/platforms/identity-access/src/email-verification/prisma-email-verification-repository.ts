import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  EmailVerificationChallengeWriter,
  UpsertEmailVerificationChallengeInput,
} from './email-verification-challenge-writer';
import type {
  EmailVerificationActorEmail,
  EmailVerificationReader,
} from './email-verification-reader';

export class PrismaEmailVerificationRepository
  implements EmailVerificationReader, EmailVerificationChallengeWriter
{
  public constructor(private readonly database: DatabaseClient) {}

  public async findActorEmailByActorId(
    actorId: string,
  ): Promise<EmailVerificationActorEmail | null> {
    const actorEmail = await this.database.actorEmail.findUnique({
      where: {
        actorId,
      },
      select: {
        id: true,
        email: true,
        verifiedAt: true,
      },
    });

    if (!actorEmail) {
      return null;
    }

    return {
      actorEmailId: actorEmail.id,
      email: actorEmail.email,
      verifiedAt: actorEmail.verifiedAt,
    };
  }

  public async upsertCurrentChallenge(input: UpsertEmailVerificationChallengeInput): Promise<void> {
    await this.database.emailVerificationChallenge.upsert({
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
