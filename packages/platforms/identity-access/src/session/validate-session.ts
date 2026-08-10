import { ApplicationError } from '@ai-world/foundation-errors';

import type { SessionClock } from './session-clock';
import type { SessionTokenDigester } from './session-token-digester';
import type { SessionValidationReader } from './session-validation-reader';

export interface ValidateSessionInput {
  readonly token: string;
}

export interface ValidateSessionResult {
  readonly sessionId: string;
  readonly actorId: string;
  readonly expiresAt: Date;
}

export class ValidateSession {
  constructor(
    private readonly reader: SessionValidationReader,
    private readonly tokenDigester: SessionTokenDigester,
    private readonly clock: SessionClock,
  ) {}

  async execute(input: ValidateSessionInput): Promise<ValidateSessionResult> {
    const tokenDigest = this.tokenDigester.digest(input.token);

    const session = await this.reader.findByTokenDigest(tokenDigest);

    const now = this.clock.now();

    if (!session || session.revokedAt !== null || session.expiresAt.getTime() <= now.getTime()) {
      throw new ApplicationError({
        code: 'identity.session.invalid',
        kind: 'unauthenticated',
        message: 'Session validation failed.',
        publicMessage: 'Authentication is required.',
      });
    }

    return {
      sessionId: session.sessionId,
      actorId: session.actorId,
      expiresAt: session.expiresAt,
    };
  }
}
