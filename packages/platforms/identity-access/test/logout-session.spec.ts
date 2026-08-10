import { describe, expect, it, vi } from 'vitest';

import {
  LogoutSession,
  type SessionClock,
  type SessionRevocationWriter,
  type SessionTokenDigester,
} from '../src';

describe('LogoutSession', () => {
  it('revokes a Session by the digest of its opaque token', async () => {
    const revokedAt = new Date('2026-08-10T13:00:00.000Z');

    const writer: SessionRevocationWriter = {
      revokeByActor: vi.fn(),
      revokeByTokenDigest: vi.fn().mockResolvedValue(undefined),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('session-token-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(revokedAt),
    };

    const logoutSession = new LogoutSession(writer, tokenDigester, clock);

    await expect(
      logoutSession.execute({
        token: 'raw-session-token',
      }),
    ).resolves.toBeUndefined();

    expect(tokenDigester.digest).toHaveBeenCalledWith('raw-session-token');

    expect(writer.revokeByTokenDigest).toHaveBeenCalledWith({
      tokenDigest: 'session-token-digest',
      revokedAt,
    });
  });

  it('never passes the raw Session token to persistence', async () => {
    const rawToken = 'raw-session-secret';

    const writer: SessionRevocationWriter = {
      revokeByActor: vi.fn(),
      revokeByTokenDigest: vi.fn().mockResolvedValue(undefined),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi
        .fn()
        .mockReturnValue('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(new Date('2026-08-10T13:00:00.000Z')),
    };

    const logoutSession = new LogoutSession(writer, tokenDigester, clock);

    await logoutSession.execute({
      token: rawToken,
    });

    const revokeCall = vi.mocked(writer.revokeByTokenDigest).mock.calls[0]?.[0];

    expect(revokeCall).toBeDefined();
    expect(JSON.stringify(revokeCall)).not.toContain(rawToken);
  });

  it('does not expose whether the Session existed', async () => {
    const writer: SessionRevocationWriter = {
      revokeByActor: vi.fn(),
      revokeByTokenDigest: vi.fn().mockResolvedValue(undefined),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('unknown-session-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(new Date('2026-08-10T13:00:00.000Z')),
    };

    const logoutSession = new LogoutSession(writer, tokenDigester, clock);

    await expect(
      logoutSession.execute({
        token: 'unknown-session-token',
      }),
    ).resolves.toBeUndefined();
  });
});
