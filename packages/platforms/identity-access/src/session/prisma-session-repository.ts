import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  CreatedSessionRecord,
  CreateSessionRecordInput,
  SessionRepository,
} from './session-repository';
import type {
  RevokeSessionByActorInput,
  RevokeSessionByTokenDigestInput,
  SessionRevocationWriter,
} from './session-revocation-writer';
import type { SessionValidationReader, SessionValidationRecord } from './session-validation-reader';

export class PrismaSessionRepository
  implements SessionRepository, SessionValidationReader, SessionRevocationWriter
{
  constructor(private readonly database: DatabaseClient) {}

  async create(input: CreateSessionRecordInput): Promise<CreatedSessionRecord> {
    return this.database.session.create({
      data: {
        actorId: input.actorId,
        tokenDigest: input.tokenDigest,
        expiresAt: input.expiresAt,
      },
      select: {
        id: true,
        actorId: true,
        expiresAt: true,
      },
    });
  }

  async findByTokenDigest(tokenDigest: string): Promise<SessionValidationRecord | null> {
    const session = await this.database.session.findUnique({
      where: {
        tokenDigest,
      },
      select: {
        id: true,
        actorId: true,
        expiresAt: true,
        revokedAt: true,
      },
    });

    if (!session) {
      return null;
    }

    return {
      sessionId: session.id,
      actorId: session.actorId,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    };
  }

  async revokeByActor(input: RevokeSessionByActorInput): Promise<void> {
    await this.database.session.updateMany({
      where: {
        id: input.sessionId,
        actorId: input.actorId,
        revokedAt: null,
      },
      data: {
        revokedAt: input.revokedAt,
      },
    });
  }

  async revokeByTokenDigest(input: RevokeSessionByTokenDigestInput): Promise<void> {
    await this.database.session.updateMany({
      where: {
        tokenDigest: input.tokenDigest,
        revokedAt: null,
      },
      data: {
        revokedAt: input.revokedAt,
      },
    });
  }
}
