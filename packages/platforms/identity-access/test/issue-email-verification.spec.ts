import type { EmailDelivery, EmailMessage } from '@ai-world/foundation-email';
import { describe, expect, it } from 'vitest';

import {
  EMAIL_VERIFICATION_ABSOLUTE_TTL_MILLISECONDS,
  IssueEmailVerification,
  type EmailVerificationActorEmail,
  type EmailVerificationChallengeWriter,
  type EmailVerificationClock,
  type EmailVerificationReader,
  type EmailVerificationTokenDigester,
  type EmailVerificationTokenGenerator,
  type IdentityLifecycleLinkBuilder,
  type UpsertEmailVerificationChallengeInput,
} from '../src';

class StubEmailVerificationReader implements EmailVerificationReader {
  public constructor(private readonly actorEmail: EmailVerificationActorEmail | null) {}

  public async findActorEmailByActorId(
    actorId: string,
  ): Promise<EmailVerificationActorEmail | null> {
    void actorId;

    return this.actorEmail;
  }
}

class RecordingChallengeWriter implements EmailVerificationChallengeWriter {
  public readonly inputs: UpsertEmailVerificationChallengeInput[] = [];

  public async upsertCurrentChallenge(input: UpsertEmailVerificationChallengeInput): Promise<void> {
    this.inputs.push(input);
  }
}

class StubTokenGenerator implements EmailVerificationTokenGenerator {
  public calls = 0;

  public constructor(private readonly tokens: readonly string[]) {}

  public generate(): string {
    const token = this.tokens[this.calls];

    if (token === undefined) {
      throw new Error('No stub verification token available.');
    }

    this.calls += 1;

    return token;
  }
}

class StubTokenDigester implements EmailVerificationTokenDigester {
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

class RecordingEmailDelivery implements EmailDelivery {
  public readonly messages: EmailMessage[] = [];

  public async send(message: EmailMessage): Promise<void> {
    this.messages.push(message);
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

describe('IssueEmailVerification', () => {
  it('issues a verification challenge and delivers a deep link carrying only the raw token', async () => {
    const now = new Date('2026-08-11T06:30:00.000Z');

    const reader = new StubEmailVerificationReader({
      actorEmailId: 'actor-email-1',
      email: 'person@example.com',
      verifiedAt: null,
    });

    const writer = new RecordingChallengeWriter();
    const tokenGenerator = new StubTokenGenerator(['raw-verification-token']);
    const tokenDigester = new StubTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssueEmailVerification(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedEmailVerificationClock(now),
      emailDelivery,
      lifecycleLinks,
    );

    const result = await useCase.execute({
      actorId: 'actor-1',
    });

    const expectedExpiresAt = new Date(
      now.getTime() + EMAIL_VERIFICATION_ABSOLUTE_TTL_MILLISECONDS,
    );

    expect(result).toEqual({
      status: 'issued',
      expiresAt: expectedExpiresAt,
    });

    expect(tokenDigester.tokens).toEqual(['raw-verification-token']);

    expect(writer.inputs).toEqual([
      {
        actorEmailId: 'actor-email-1',
        tokenDigest: 'digest:raw-verification-token',
        expiresAt: expectedExpiresAt,
      },
    ]);

    expect(writer.inputs[0]?.tokenDigest).not.toBe('raw-verification-token');

    expect(emailDelivery.messages).toHaveLength(1);
    expect(emailDelivery.messages[0]?.to).toBe('person@example.com');
    expect(emailDelivery.messages[0]?.subject).toBe('Verify your AI World email');
    expect(emailDelivery.messages[0]?.text).toContain(
      'https://example.test/verify-email#token=raw-verification-token',
    );
    expect(emailDelivery.messages[0]?.text).not.toContain('digest:raw-verification-token');
  });

  it('resends using a new token and a new challenge expiry', async () => {
    const now = new Date('2026-08-11T06:30:00.000Z');

    const reader = new StubEmailVerificationReader({
      actorEmailId: 'actor-email-1',
      email: 'person@example.com',
      verifiedAt: null,
    });

    const writer = new RecordingChallengeWriter();
    const tokenGenerator = new StubTokenGenerator(['first-token', 'second-token']);
    const tokenDigester = new StubTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssueEmailVerification(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedEmailVerificationClock(now),
      emailDelivery,
      lifecycleLinks,
    );

    await useCase.execute({
      actorId: 'actor-1',
    });

    await useCase.execute({
      actorId: 'actor-1',
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

  it('is a successful no-op when the email is already verified', async () => {
    const reader = new StubEmailVerificationReader({
      actorEmailId: 'actor-email-1',
      email: 'person@example.com',
      verifiedAt: new Date('2026-08-10T10:00:00.000Z'),
    });

    const writer = new RecordingChallengeWriter();
    const tokenGenerator = new StubTokenGenerator([]);
    const tokenDigester = new StubTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssueEmailVerification(
      reader,
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedEmailVerificationClock(new Date('2026-08-11T06:30:00.000Z')),
      emailDelivery,
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        actorId: 'actor-1',
      }),
    ).resolves.toEqual({
      status: 'already_verified',
    });

    expect(tokenGenerator.calls).toBe(0);
    expect(tokenDigester.tokens).toEqual([]);
    expect(writer.inputs).toEqual([]);
    expect(emailDelivery.messages).toEqual([]);
  });

  it('reports when the Actor has no email identifier', async () => {
    const writer = new RecordingChallengeWriter();
    const tokenGenerator = new StubTokenGenerator([]);
    const tokenDigester = new StubTokenDigester();
    const emailDelivery = new RecordingEmailDelivery();

    const useCase = new IssueEmailVerification(
      new StubEmailVerificationReader(null),
      writer,
      tokenGenerator,
      tokenDigester,
      new FixedEmailVerificationClock(new Date('2026-08-11T06:30:00.000Z')),
      emailDelivery,
      lifecycleLinks,
    );

    await expect(
      useCase.execute({
        actorId: 'actor-without-email',
      }),
    ).resolves.toEqual({
      status: 'email_not_available',
    });

    expect(tokenGenerator.calls).toBe(0);
    expect(tokenDigester.tokens).toEqual([]);
    expect(writer.inputs).toEqual([]);
    expect(emailDelivery.messages).toEqual([]);
  });
});
