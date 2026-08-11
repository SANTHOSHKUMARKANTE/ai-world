import { ApplicationError } from '@ai-world/foundation-errors';
import { describe, expect, it } from 'vitest';

import {
  ConfirmEmailVerification,
  type ConfirmEmailVerificationTransactionInput,
  type EmailVerificationClock,
  type EmailVerificationConfirmationTransaction,
  type EmailVerificationTokenDigester,
} from '../src';

class RecordingConfirmationTransaction implements EmailVerificationConfirmationTransaction {
  public readonly inputs: ConfirmEmailVerificationTransactionInput[] = [];

  public constructor(private readonly result: boolean) {}

  public async confirm(input: ConfirmEmailVerificationTransactionInput): Promise<boolean> {
    this.inputs.push(input);

    return this.result;
  }
}

class RecordingTokenDigester implements EmailVerificationTokenDigester {
  public readonly tokens: string[] = [];

  public digest(token: string): string {
    this.tokens.push(token);

    return `digest:${token}`;
  }
}

class FixedEmailVerificationClock implements EmailVerificationClock {
  public constructor(private readonly current: Date) {}

  public now(): Date {
    return this.current;
  }
}

describe('ConfirmEmailVerification', () => {
  it('confirms an email using only the verification token digest', async () => {
    const now = new Date('2026-08-11T07:15:00.000Z');

    const transaction = new RecordingConfirmationTransaction(true);
    const digester = new RecordingTokenDigester();

    const useCase = new ConfirmEmailVerification(
      transaction,
      digester,
      new FixedEmailVerificationClock(now),
    );

    await expect(
      useCase.execute({
        token: 'raw-verification-token',
      }),
    ).resolves.toBeUndefined();

    expect(digester.tokens).toEqual(['raw-verification-token']);

    expect(transaction.inputs).toEqual([
      {
        tokenDigest: 'digest:raw-verification-token',
        confirmedAt: now,
      },
    ]);

    expect(transaction.inputs[0]?.tokenDigest).not.toBe('raw-verification-token');
  });

  it('returns one canonical failure for an invalid verification token', async () => {
    const transaction = new RecordingConfirmationTransaction(false);

    const useCase = new ConfirmEmailVerification(
      transaction,
      new RecordingTokenDigester(),
      new FixedEmailVerificationClock(new Date('2026-08-11T07:15:00.000Z')),
    );

    let thrown: unknown;

    try {
      await useCase.execute({
        token: 'invalid-raw-token',
      });
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(ApplicationError);

    const applicationError = thrown as ApplicationError;

    expect(applicationError.code).toBe('identity.email_verification.invalid_token');
    expect(applicationError.kind).toBe('validation');
    expect(applicationError.publicMessage).toBe(
      'The email verification token is invalid or expired.',
    );

    expect(applicationError.message).not.toContain('invalid-raw-token');
    expect(applicationError.publicMessage).not.toContain('invalid-raw-token');
  });

  it('does not distinguish invalid-token persistence states publicly', async () => {
    const transaction = new RecordingConfirmationTransaction(false);

    const useCase = new ConfirmEmailVerification(
      transaction,
      new RecordingTokenDigester(),
      new FixedEmailVerificationClock(new Date('2026-08-11T07:15:00.000Z')),
    );

    await expect(
      useCase.execute({
        token: 'unknown-expired-or-consumed-token',
      }),
    ).rejects.toMatchObject({
      code: 'identity.email_verification.invalid_token',
      kind: 'validation',
      publicMessage: 'The email verification token is invalid or expired.',
    });
  });
});
