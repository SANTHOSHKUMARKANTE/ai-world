import { describe, expect, it, vi } from 'vitest';

import {
  type SessionClock,
  type SessionTokenDigester,
  type SessionValidationReader,
  ValidateSession,
} from '../src';

describe('ValidateSession', () => {
  const now = new Date('2026-08-10T12:00:00.000Z');

  it('returns the authenticated Session when it is active and unexpired', async () => {
    const reader: SessionValidationReader = {
      findByTokenDigest: vi.fn().mockResolvedValue({
        sessionId: 'session-001',
        actorId: 'actor-001',
        expiresAt: new Date('2026-08-17T12:00:00.000Z'),
        revokedAt: null,
      }),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('session-token-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(now),
    };

    const validateSession = new ValidateSession(reader, tokenDigester, clock);

    await expect(
      validateSession.execute({
        token: 'raw-session-token',
      }),
    ).resolves.toEqual({
      sessionId: 'session-001',
      actorId: 'actor-001',
      expiresAt: new Date('2026-08-17T12:00:00.000Z'),
    });

    expect(tokenDigester.digest).toHaveBeenCalledWith('raw-session-token');

    expect(reader.findByTokenDigest).toHaveBeenCalledWith('session-token-digest');
  });

  it('rejects an unknown Session', async () => {
    const reader: SessionValidationReader = {
      findByTokenDigest: vi.fn().mockResolvedValue(null),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('unknown-session-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(now),
    };

    const validateSession = new ValidateSession(reader, tokenDigester, clock);

    await expect(
      validateSession.execute({
        token: 'unknown-session-token',
      }),
    ).rejects.toMatchObject({
      name: 'ApplicationError',
      code: 'identity.session.invalid',
      kind: 'unauthenticated',
      publicMessage: 'Authentication is required.',
    });
  });

  it('rejects a revoked Session using the same public failure', async () => {
    const reader: SessionValidationReader = {
      findByTokenDigest: vi.fn().mockResolvedValue({
        sessionId: 'session-002',
        actorId: 'actor-002',
        expiresAt: new Date('2026-08-17T12:00:00.000Z'),
        revokedAt: new Date('2026-08-10T11:00:00.000Z'),
      }),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('revoked-session-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(now),
    };

    const validateSession = new ValidateSession(reader, tokenDigester, clock);

    await expect(
      validateSession.execute({
        token: 'revoked-session-token',
      }),
    ).rejects.toMatchObject({
      name: 'ApplicationError',
      code: 'identity.session.invalid',
      kind: 'unauthenticated',
      publicMessage: 'Authentication is required.',
    });
  });

  it('rejects a Session whose expiration time is equal to the current time', async () => {
    const reader: SessionValidationReader = {
      findByTokenDigest: vi.fn().mockResolvedValue({
        sessionId: 'session-003',
        actorId: 'actor-003',
        expiresAt: now,
        revokedAt: null,
      }),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue('expired-session-digest'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(now),
    };

    const validateSession = new ValidateSession(reader, tokenDigester, clock);

    await expect(
      validateSession.execute({
        token: 'expired-session-token',
      }),
    ).rejects.toMatchObject({
      name: 'ApplicationError',
      code: 'identity.session.invalid',
      kind: 'unauthenticated',
      publicMessage: 'Authentication is required.',
    });
  });
});
