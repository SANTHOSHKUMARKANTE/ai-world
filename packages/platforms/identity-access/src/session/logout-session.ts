import type { SessionClock } from './session-clock';
import type { SessionRevocationWriter } from './session-revocation-writer';
import type { SessionTokenDigester } from './session-token-digester';

export interface LogoutSessionInput {
  readonly token: string;
}

export class LogoutSession {
  constructor(
    private readonly writer: SessionRevocationWriter,
    private readonly tokenDigester: SessionTokenDigester,
    private readonly clock: SessionClock,
  ) {}

  async execute(input: LogoutSessionInput): Promise<void> {
    const tokenDigest = this.tokenDigester.digest(input.token);

    await this.writer.revokeByTokenDigest({
      tokenDigest,
      revokedAt: this.clock.now(),
    });
  }
}
