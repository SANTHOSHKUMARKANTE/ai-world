import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it, vi } from 'vitest';

import {
  AuthenticatePassword,
  type PasswordAuthenticationReader,
  type PasswordVerifier,
} from '../src';

describe('AuthenticatePassword', () => {
  it('authenticates an Actor using canonical email and password input', async () => {
    const reader: PasswordAuthenticationReader = {
      findByNormalizedEmail: vi.fn().mockResolvedValue({
        actorId: 'actor-001',
        passwordHash: 'stored-password-hash',
      }),
    };

    const verifier: PasswordVerifier = {
      verify: vi.fn().mockResolvedValue(true),
    };

    const authenticate = new AuthenticatePassword(reader, verifier, 'dummy-password-hash');

    await expect(
      authenticate.execute({
        email: '  PERSON@Example.COM  ',
        password: 'Cafe\u0301 password',
      }),
    ).resolves.toEqual({
      actorId: 'actor-001',
    });

    expect(reader.findByNormalizedEmail).toHaveBeenCalledWith('person@example.com');

    expect(verifier.verify).toHaveBeenCalledWith('Caf\u00e9 password', 'stored-password-hash');
  });

  it('uses the dummy hash and returns the canonical failure for an unknown email', async () => {
    const reader: PasswordAuthenticationReader = {
      findByNormalizedEmail: vi.fn().mockResolvedValue(null),
    };

    const verifier: PasswordVerifier = {
      verify: vi.fn().mockResolvedValue(false),
    };

    const authenticate = new AuthenticatePassword(reader, verifier, 'dummy-password-hash');

    const error = await authenticate
      .execute({
        email: 'missing@example.com',
        password: 'some password',
      })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApplicationError);

    expect(error).toMatchObject({
      code: 'identity.authentication.invalid_credentials',
      kind: 'unauthenticated',
      publicMessage: 'The email or password is incorrect.',
    });

    expect(verifier.verify).toHaveBeenCalledWith('some password', 'dummy-password-hash');
  });

  it('returns the same canonical failure for a wrong password', async () => {
    const reader: PasswordAuthenticationReader = {
      findByNormalizedEmail: vi.fn().mockResolvedValue({
        actorId: 'actor-001',
        passwordHash: 'stored-password-hash',
      }),
    };

    const verifier: PasswordVerifier = {
      verify: vi.fn().mockResolvedValue(false),
    };

    const authenticate = new AuthenticatePassword(reader, verifier, 'dummy-password-hash');

    const error = await authenticate
      .execute({
        email: 'person@example.com',
        password: 'wrong password',
      })
      .catch((caught: unknown) => caught);

    expect(error).toBeInstanceOf(ApplicationError);

    expect(error).toMatchObject({
      code: 'identity.authentication.invalid_credentials',
      kind: 'unauthenticated',
      publicMessage: 'The email or password is incorrect.',
    });

    expect(verifier.verify).toHaveBeenCalledWith('wrong password', 'stored-password-hash');
  });
});
