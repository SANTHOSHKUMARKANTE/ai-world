import type { SessionClock } from './session-clock';
import type { SessionRepository } from './session-repository';
import type { SessionTokenDigester } from './session-token-digester';
import type { SessionTokenGenerator } from './session-token-generator';

export const SESSION_ABSOLUTE_TTL_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;

export interface CreateSessionInput {
  readonly actorId: string;
}

export interface CreateSessionResult {
  readonly sessionId: string;
  readonly actorId: string;
  readonly token: string;
  readonly expiresAt: Date;
}

export class CreateSession {
  constructor(
    private readonly repository: SessionRepository,
    private readonly tokenGenerator: SessionTokenGenerator,
    private readonly tokenDigester: SessionTokenDigester,
    private readonly clock: SessionClock,
  ) {}

  async execute(input: CreateSessionInput): Promise<CreateSessionResult> {
    const token = this.tokenGenerator.generate();
    const tokenDigest = this.tokenDigester.digest(token);

    const now = this.clock.now();

    const expiresAt = new Date(now.getTime() + SESSION_ABSOLUTE_TTL_MILLISECONDS);

    const session = await this.repository.create({
      actorId: input.actorId,
      tokenDigest,
      expiresAt,
    });

    return {
      sessionId: session.id,
      actorId: session.actorId,
      token,
      expiresAt: session.expiresAt,
    };
  }
}
