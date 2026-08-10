import { describe, expect, it, vi } from 'vitest';

import {
  SignInWithPassword,
  type AuthenticatePasswordInput,
  type AuthenticatePasswordResult,
  type CreateSessionInput,
  type CreateSessionResult,
} from '../src';

describe('SignInWithPassword', () => {
  it('creates a Session after successful password authentication', async () => {
    const authenticatePassword = {
      execute: vi
        .fn<(input: AuthenticatePasswordInput) => Promise<AuthenticatePasswordResult>>()
        .mockResolvedValue({
          actorId: 'actor-001',
        }),
    };

    const expiresAt = new Date('2026-08-17T12:00:00.000Z');

    const createSession = {
      execute: vi
        .fn<(input: CreateSessionInput) => Promise<CreateSessionResult>>()
        .mockResolvedValue({
          sessionId: 'session-001',
          actorId: 'actor-001',
          token: 'raw-session-token',
          expiresAt,
        }),
    };

    const signIn = new SignInWithPassword(authenticatePassword, createSession);

    await expect(
      signIn.execute({
        email: 'user@example.com',
        password: 'correct password',
      }),
    ).resolves.toEqual({
      actorId: 'actor-001',
      token: 'raw-session-token',
      expiresAt,
    });

    expect(authenticatePassword.execute).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'correct password',
    });

    expect(createSession.execute).toHaveBeenCalledWith({
      actorId: 'actor-001',
    });
  });

  it('does not create a Session when authentication fails', async () => {
    const authenticationFailure = new Error('authentication failed');

    const authenticatePassword = {
      execute: vi.fn().mockRejectedValue(authenticationFailure),
    };

    const createSession = {
      execute: vi.fn(),
    };

    const signIn = new SignInWithPassword(authenticatePassword, createSession);

    await expect(
      signIn.execute({
        email: 'user@example.com',
        password: 'wrong password',
      }),
    ).rejects.toBe(authenticationFailure);

    expect(createSession.execute).not.toHaveBeenCalled();
  });
});
