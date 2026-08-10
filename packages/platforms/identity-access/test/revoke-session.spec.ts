import { describe, expect, it, vi } from 'vitest';

import { RevokeSession, type SessionClock, type SessionRevocationWriter } from '../src';

describe('RevokeSession', () => {
  it('revokes only the requested Actor Session', async () => {
    const revokedAt = new Date('2026-08-10T14:00:00.000Z');

    const writer: SessionRevocationWriter = {
      revokeByActor: vi.fn().mockResolvedValue(undefined),
      revokeByTokenDigest: vi.fn(),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(revokedAt),
    };

    const revokeSession = new RevokeSession(writer, clock);

    await expect(
      revokeSession.execute({
        actorId: 'actor-001',
        sessionId: 'session-001',
      }),
    ).resolves.toBeUndefined();

    expect(writer.revokeByActor).toHaveBeenCalledWith({
      actorId: 'actor-001',
      sessionId: 'session-001',
      revokedAt,
    });
  });

  it('does not expose whether the Actor Session existed', async () => {
    const writer: SessionRevocationWriter = {
      revokeByActor: vi.fn().mockResolvedValue(undefined),
      revokeByTokenDigest: vi.fn(),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(new Date('2026-08-10T14:00:00.000Z')),
    };

    const revokeSession = new RevokeSession(writer, clock);

    await expect(
      revokeSession.execute({
        actorId: 'unknown-actor',
        sessionId: 'unknown-session',
      }),
    ).resolves.toBeUndefined();
  });
});
