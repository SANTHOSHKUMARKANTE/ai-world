import { describe, expect, it, vi } from 'vitest';

import {
  CreateSession,
  SESSION_ABSOLUTE_TTL_MILLISECONDS,
  type SessionClock,
  type SessionRepository,
  type SessionTokenDigester,
  type SessionTokenGenerator,
} from '../src';

describe('CreateSession', () => {
  it('creates a seven-day Session while persisting only the token digest', async () => {
    const now = new Date('2026-08-10T12:00:00.000Z');
    const token = 'raw-opaque-session-token';
    const tokenDigest = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';

    const repository: SessionRepository = {
      create: vi.fn().mockImplementation(async (input) => ({
        id: 'session-001',
        actorId: input.actorId,
        expiresAt: input.expiresAt,
      })),
    };

    const tokenGenerator: SessionTokenGenerator = {
      generate: vi.fn().mockReturnValue(token),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi.fn().mockReturnValue(tokenDigest),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(now),
    };

    const createSession = new CreateSession(repository, tokenGenerator, tokenDigester, clock);

    const result = await createSession.execute({
      actorId: 'actor-001',
    });

    const expectedExpiresAt = new Date(now.getTime() + SESSION_ABSOLUTE_TTL_MILLISECONDS);

    expect(tokenGenerator.generate).toHaveBeenCalledOnce();

    expect(tokenDigester.digest).toHaveBeenCalledWith(token);

    expect(repository.create).toHaveBeenCalledWith({
      actorId: 'actor-001',
      tokenDigest,
      expiresAt: expectedExpiresAt,
    });

    expect(result).toEqual({
      sessionId: 'session-001',
      actorId: 'actor-001',
      token,
      expiresAt: expectedExpiresAt,
    });
  });

  it('never passes the raw Session token to the persistence contract', async () => {
    const rawToken = 'raw-session-secret';

    const repository: SessionRepository = {
      create: vi.fn().mockResolvedValue({
        id: 'session-002',
        actorId: 'actor-002',
        expiresAt: new Date('2026-08-17T12:00:00.000Z'),
      }),
    };

    const tokenGenerator: SessionTokenGenerator = {
      generate: vi.fn().mockReturnValue(rawToken),
    };

    const tokenDigester: SessionTokenDigester = {
      digest: vi
        .fn()
        .mockReturnValue('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'),
    };

    const clock: SessionClock = {
      now: vi.fn().mockReturnValue(new Date('2026-08-10T12:00:00.000Z')),
    };

    const createSession = new CreateSession(repository, tokenGenerator, tokenDigester, clock);

    await createSession.execute({
      actorId: 'actor-002',
    });

    const createCall = vi.mocked(repository.create).mock.calls[0]?.[0];

    expect(createCall).toBeDefined();
    expect(createCall).not.toHaveProperty('token');
    expect(JSON.stringify(createCall)).not.toContain(rawToken);
  });

  it('uses exactly a seven-day absolute Session lifetime', async () => {
    expect(SESSION_ABSOLUTE_TTL_MILLISECONDS).toBe(7 * 24 * 60 * 60 * 1000);
  });
});
