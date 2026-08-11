import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import {
  ResetPasswordWithRecovery,
  type PasswordHasher,
  type PasswordRecoveryClock,
  type PasswordRecoveryResetTransaction,
  type PasswordRecoveryTokenDigester,
  type ResetPasswordWithRecoveryTransactionInput,
} from '../src';

class RecordingPasswordRecoveryResetTransaction implements PasswordRecoveryResetTransaction {
  public readonly inputs: ResetPasswordWithRecoveryTransactionInput[] = [];

  public constructor(private readonly result: boolean) {}

  public async reset(input: ResetPasswordWithRecoveryTransactionInput): Promise<boolean> {
    this.inputs.push(input);

    return this.result;
  }
}

class RecordingPasswordRecoveryTokenDigester implements PasswordRecoveryTokenDigester {
  public readonly tokens: string[] = [];

  public digest(token: string): string {
    this.tokens.push(token);

    return `digest:${token}`;
  }
}

class RecordingPasswordHasher implements PasswordHasher {
  public readonly passwords: string[] = [];

  public async hash(password: string): Promise<string> {
    this.passwords.push(password);

    return `hash:${password}`;
  }
}

class FixedPasswordRecoveryClock implements PasswordRecoveryClock {
  public constructor(private readonly current: Date) {}

  public now(): Date {
    return this.current;
  }
}

describe('ResetPasswordWithRecovery', () => {
  it('resets using only the recovery digest and hashed normalized password', async () => {
    const resetAt = new Date('2026-08-11T09:30:00.000Z');
    const decomposedPassword = `Cafe\u0301-${'x'.repeat(10)}`;
    const normalizedPassword = decomposedPassword.normalize('NFC');

    const transaction = new RecordingPasswordRecoveryResetTransaction(true);
    const digester = new RecordingPasswordRecoveryTokenDigester();
    const passwordHasher = new RecordingPasswordHasher();

    const useCase = new ResetPasswordWithRecovery(
      transaction,
      digester,
      passwordHasher,
      new FixedPasswordRecoveryClock(resetAt),
    );

    await expect(
      useCase.execute({
        token: 'raw-recovery-token',
        password: decomposedPassword,
      }),
    ).resolves.toBeUndefined();

    expect(digester.tokens).toEqual(['raw-recovery-token']);
    expect(passwordHasher.passwords).toEqual([normalizedPassword]);

    expect(transaction.inputs).toEqual([
      {
        tokenDigest: 'digest:raw-recovery-token',
        passwordHash: `hash:${normalizedPassword}`,
        resetAt,
      },
    ]);

    expect(transaction.inputs[0]?.tokenDigest).not.toBe('raw-recovery-token');
    expect(transaction.inputs[0]?.passwordHash).not.toBe(decomposedPassword);
    expect(transaction.inputs[0]?.passwordHash).not.toBe(normalizedPassword);
  });

  it('rejects an invalid replacement password before digesting, hashing, or persistence', async () => {
    const transaction = new RecordingPasswordRecoveryResetTransaction(true);
    const digester = new RecordingPasswordRecoveryTokenDigester();
    const passwordHasher = new RecordingPasswordHasher();

    const useCase = new ResetPasswordWithRecovery(
      transaction,
      digester,
      passwordHasher,
      new FixedPasswordRecoveryClock(new Date('2026-08-11T09:30:00.000Z')),
    );

    await expect(
      useCase.execute({
        token: 'raw-recovery-token',
        password: 'too-short',
      }),
    ).rejects.toMatchObject({
      code: 'identity.password_recovery.invalid_password',
      kind: 'validation',
    });

    expect(digester.tokens).toEqual([]);
    expect(passwordHasher.passwords).toEqual([]);
    expect(transaction.inputs).toEqual([]);
  });

  it('returns one canonical failure for an invalid recovery token', async () => {
    const transaction = new RecordingPasswordRecoveryResetTransaction(false);
    const digester = new RecordingPasswordRecoveryTokenDigester();
    const passwordHasher = new RecordingPasswordHasher();

    const useCase = new ResetPasswordWithRecovery(
      transaction,
      digester,
      passwordHasher,
      new FixedPasswordRecoveryClock(new Date('2026-08-11T09:30:00.000Z')),
    );

    const rawToken = 'unknown-expired-consumed-or-superseded-token';
    const password = 'new-password-123';

    let thrown: unknown;

    try {
      await useCase.execute({
        token: rawToken,
        password,
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(ApplicationError);

    const applicationError = thrown as ApplicationError;

    expect(applicationError.code).toBe('identity.password_recovery.invalid_token');
    expect(applicationError.kind).toBe('validation');
    expect(applicationError.publicMessage).toBe(
      'The password recovery token is invalid or expired.',
    );

    expect(applicationError.message).not.toContain(rawToken);
    expect(applicationError.publicMessage).not.toContain(rawToken);
    expect(applicationError.message).not.toContain(password);
    expect(applicationError.publicMessage).not.toContain(password);
  });
});
