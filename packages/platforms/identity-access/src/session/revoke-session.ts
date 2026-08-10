import type { SessionClock } from './session-clock';
import type { SessionRevocationWriter } from './session-revocation-writer';

export interface RevokeSessionInput {
  readonly actorId: string;
  readonly sessionId: string;
}

export class RevokeSession {
  constructor(
    private readonly writer: SessionRevocationWriter,
    private readonly clock: SessionClock,
  ) {}

  async execute(input: RevokeSessionInput): Promise<void> {
    await this.writer.revokeByActor({
      actorId: input.actorId,
      sessionId: input.sessionId,
      revokedAt: this.clock.now(),
    });
  }
}
