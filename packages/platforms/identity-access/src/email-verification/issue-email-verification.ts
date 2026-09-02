import type { EmailDelivery } from '@ai-world/foundation-email';

import type { IdentityLifecycleLinkBuilder } from '../identity-lifecycle-link-builder';
import type { EmailVerificationChallengeWriter } from './email-verification-challenge-writer';
import type { EmailVerificationClock } from './email-verification-clock';
import type { EmailVerificationReader } from './email-verification-reader';
import type { EmailVerificationTokenDigester } from './email-verification-token-digester';
import type { EmailVerificationTokenGenerator } from './email-verification-token-generator';

export const EMAIL_VERIFICATION_ABSOLUTE_TTL_MILLISECONDS = 24 * 60 * 60 * 1000;

export interface IssueEmailVerificationInput {
  readonly actorId: string;
}

export type IssueEmailVerificationResult =
  | {
      readonly status: 'issued';
      readonly expiresAt: Date;
    }
  | {
      readonly status: 'already_verified';
    }
  | {
      readonly status: 'email_not_available';
    };

export class IssueEmailVerification {
  public constructor(
    private readonly reader: EmailVerificationReader,
    private readonly writer: EmailVerificationChallengeWriter,
    private readonly tokenGenerator: EmailVerificationTokenGenerator,
    private readonly tokenDigester: EmailVerificationTokenDigester,
    private readonly clock: EmailVerificationClock,
    private readonly emailDelivery: EmailDelivery,
    private readonly lifecycleLinks: IdentityLifecycleLinkBuilder,
  ) {}

  public async execute(input: IssueEmailVerificationInput): Promise<IssueEmailVerificationResult> {
    const actorEmail = await this.reader.findActorEmailByActorId(input.actorId);

    if (!actorEmail) {
      return {
        status: 'email_not_available',
      };
    }

    if (actorEmail.verifiedAt !== null) {
      return {
        status: 'already_verified',
      };
    }

    const token = this.tokenGenerator.generate();
    const tokenDigest = this.tokenDigester.digest(token);

    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + EMAIL_VERIFICATION_ABSOLUTE_TTL_MILLISECONDS);

    await this.writer.upsertCurrentChallenge({
      actorEmailId: actorEmail.actorEmailId,
      tokenDigest,
      expiresAt,
    });

    const verificationLink = this.lifecycleLinks.buildEmailVerificationLink(token);

    await this.emailDelivery.send({
      to: actorEmail.email,
      subject: 'Verify your AI World email',
      text: [
        'Verify your AI World email address:',
        '',
        verificationLink,
        '',
        'This verification link expires in 24 hours.',
      ].join('\n'),
    });

    return {
      status: 'issued',
      expiresAt,
    };
  }
}
