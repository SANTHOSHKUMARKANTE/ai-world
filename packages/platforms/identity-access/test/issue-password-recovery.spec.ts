import type { EmailDelivery, EmailMessage } from '@ai-world/foundation-email';
import { describe, expect, it } from 'vitest';

import {
  IssuePasswordRecovery,
  PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS,
  type PasswordRecoveryActorEmail,
  type PasswordRecoveryChallengeWriter,
  type PasswordRecoveryClock,
  type PasswordRecoveryReader,
  type PasswordRecoveryTokenDigester,
  type IdentityLifecycleLinkBuilder,
  type PasswordRecoveryTokenGenerator,
  type UpsertPasswordRecoveryChallengeInput,
} from '../src';

class RecordingPasswordRecoveryReader implements PasswordRecoveryReader {
  public readonly normalizedEmails: string[] = [];

  public constructor(private readonly actorEmail: PasswordRecoveryActorEmail | null) {}

  public async findRecoverableActorEmailByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<PasswordRecoveryActorEmail | null> {
    this.normalizedEmails.push(normalizedEmail);

    return this.actorEmail;
  }
}

class RecordingPasswordRecoveryChallengeWriter implements PasswordRecoveryChallengeWriter {
  public readonly inputs: UpsertPasswordRecoveryChallengeInput[] = [];

  public async upsertCurrentChallenge(input: UpsertPasswordRecoveryChallengeInput): Promise<void> {
    this.inputs.push(input);
  }
}

class StubPasswordRecoveryTokenGenerator implements PasswordRecoveryTokenGenerator {
  public calls = 0;

  public constructor(private readonly tokens: readonly string[]) {}

  public generate(): string {
    const token = this.tokens[this.calls];

    if (token === undefined) {
      throw new Error('No stub password recovery token available.');
    }

    this.calls += 1;

    return token;
  }
}

class StubPasswordRecoveryTokenDigester implements PasswordRecoveryTokenDigester {
  public readonly tokens: string[] = [];

  public digest(token: string): string {
    this.tokens.push(token);

    return `digest:${token}`;
  }
}

class FixedPasswordRecoveryClock implements PasswordRecoveryClock {
  public constructor(private readonly current: Date) {}

  public now(): Date {
    return this.current;
  }
}

class RecordingEmailDelivery implements EmailDelivery {
  public readonly messages: EmailMessage[] = [];

  public async send(message: EmailMessage): Promise<void> {
    this.messages.push(message);
  }
}

class FailingEmailDelivery implements EmailDelivery {
  public async send(message: EmailMessage): Promise<void> {
    void message;

    throw new Error('SMTP unavailable');
  }
}

const lifecycleLinks: IdentityLifecycleLinkBuilder = {
  buildEmailVerificationLink(token: string): string {
    return `https://example.test/verify-email#token=${encodeURIComponent(token)}`;
  },
  buildPasswordRecoveryLink(token: string): string {
    return `https://example.test/reset-password#token=${encodeURIComponent(token)}`;
  },
};

describe('IssuePasswordRecovery', () => {
  it('issues a one-hour recovery challenge and emails a deep link carrying only the raw token', async () => {
    const now = new Date('2026-08-11T08:30:00.000Z');

    const reader = new RecordingPasswordRecoveryReader({
      actorEmailId: 'actor-email-1',
      email: 'Person@Example.com',
    });

    const writer = new RecordingPasswordRecoveryChallengeWriter();
    const tokenGenerator = new StubPasswordRecoveryTokenGenerator(['raw-recovery-token']);
    const tokenDigester = new StubPasswordRecoveryTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssuePasswordRecovery(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedPasswordRecoveryClock(now),
      emailDelivery,
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        email: '  PERSON@example.COM  ',
      }),
    ).resolves.toBeUndefined();

    const expectedExpiresAt = new Date(now.getTime() + PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS);

    expect(reader.normalizedEmails).toEqual(['person@example.com']);
    expect(tokenDigester.tokens).toEqual(['raw-recovery-token']);

    expect(writer.inputs).toEqual([
      {
        actorEmailId: 'actor-email-1',
        tokenDigest: 'digest:raw-recovery-token',
        expiresAt: expectedExpiresAt,
      },
    ]);

    expect(writer.inputs[0]?.tokenDigest).not.toBe('raw-recovery-token');

    expect(emailDelivery.messages).toHaveLength(1);
    expect(emailDelivery.messages[0]?.to).toBe('Person@Example.com');
    expect(emailDelivery.messages[0]?.subject).toBe('Reset your AI World password');
    expect(emailDelivery.messages[0]?.text).toContain(
      'https://example.test/reset-password#token=raw-recovery-token',
    );
    expect(emailDelivery.messages[0]?.text).not.toContain('digest:raw-recovery-token');
    expect(emailDelivery.messages[0]?.text).toContain('expires in 1 hour');
  });

  it('reissues recovery using a replacement raw token', async () => {
    const reader = new RecordingPasswordRecoveryReader({
      actorEmailId: 'actor-email-1',
      email: 'person@example.com',
    });

    const writer = new RecordingPasswordRecoveryChallengeWriter();
    const tokenGenerator = new StubPasswordRecoveryTokenGenerator(['first-token', 'second-token']);
    const tokenDigester = new StubPasswordRecoveryTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssuePasswordRecovery(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedPasswordRecoveryClock(new Date('2026-08-11T08:30:00.000Z')),
      emailDelivery,
      lifecycleLinks,
    );

    await useCase.execute({
      email: 'person@example.com',
    });

    await useCase.execute({
      email: 'person@example.com',
    });

    expect(writer.inputs).toHaveLength(2);
    expect(writer.inputs[0]?.actorEmailId).toBe('actor-email-1');
    expect(writer.inputs[1]?.actorEmailId).toBe('actor-email-1');

    expect(writer.inputs[0]?.tokenDigest).toBe('digest:first-token');
    expect(writer.inputs[1]?.tokenDigest).toBe('digest:second-token');

    expect(emailDelivery.messages).toHaveLength(2);
    expect(emailDelivery.messages[0]?.text).toContain('first-token');
    expect(emailDelivery.messages[1]?.text).toContain('second-token');
  });

  it('is an enumeration-safe no-op when no recoverable account exists', async () => {
    const reader = new RecordingPasswordRecoveryReader(null);
    const writer = new RecordingPasswordRecoveryChallengeWriter();
    const tokenGenerator = new StubPasswordRecoveryTokenGenerator([]);
    const tokenDigester = new StubPasswordRecoveryTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssuePasswordRecovery(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedPasswordRecoveryClock(new Date('2026-08-11T08:30:00.000Z')),
      emailDelivery,
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        email: 'unknown@example.com',
      }),
    ).resolves.toBeUndefined();

    expect(reader.normalizedEmails).toEqual(['unknown@example.com']);
    expect(tokenGenerator.calls).toBe(0);
    expect(tokenDigester.tokens).toEqual([]);
    expect(writer.inputs).toEqual([]);
    expect(emailDelivery.messages).toEqual([]);
  });

  it('is an enumeration-safe no-op for an invalid email value', async () => {
    const reader = new RecordingPasswordRecoveryReader(null);
    const writer = new RecordingPasswordRecoveryChallengeWriter();
    const tokenGenerator = new StubPasswordRecoveryTokenGenerator([]);
    const tokenDigester = new StubPasswordRecoveryTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssuePasswordRecovery(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedPasswordRecoveryClock(new Date('2026-08-11T08:30:00.000Z')),
      emailDelivery,
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        email: 'not-an-email',
      }),
    ).resolves.toBeUndefined();

    expect(reader.normalizedEmails).toEqual([]);
    expect(tokenGenerator.calls).toBe(0);
    expect(tokenDigester.tokens).toEqual([]);
    expect(writer.inputs).toEqual([]);
    expect(emailDelivery.messages).toEqual([]);
  });

  it('persists the replacement challenge before propagating email-delivery failure', async () => {
    const now = new Date('2026-08-11T08:30:00.000Z');

    const reader = new RecordingPasswordRecoveryReader({
      actorEmailId: 'actor-email-1',
      email: 'person@example.com',
    });

    const writer = new RecordingPasswordRecoveryChallengeWriter();

    const useCase = new IssuePasswordRecovery(
      reader,
      writer,
      new StubPasswordRecoveryTokenGenerator(['raw-recovery-token']),
      new StubPasswordRecoveryTokenDigester(),
      new FixedPasswordRecoveryClock(now),
      new FailingEmailDelivery(),
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        email: 'person@example.com',
      }),
    ).rejects.toThrow('SMTP unavailable');

    expect(writer.inputs).toEqual([
      {
        actorEmailId: 'actor-email-1',
        tokenDigest: 'digest:raw-recovery-token',
        expiresAt: new Date(now.getTime() + PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS),
      },
    ]);
  });
});
