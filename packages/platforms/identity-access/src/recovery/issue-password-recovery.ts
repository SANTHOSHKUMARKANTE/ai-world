import type { EmailDelivery } from '@ai-world/foundation-email';
import type { IdentityLifecycleLinkBuilder } from '../identity-lifecycle-link-builder';

import type { PasswordRecoveryChallengeWriter } from './password-recovery-challenge-writer';
import type { PasswordRecoveryClock } from './password-recovery-clock';
import { normalizePasswordRecoveryEmail } from './password-recovery-email';
import type { PasswordRecoveryReader } from './password-recovery-reader';
import type { PasswordRecoveryTokenDigester } from './password-recovery-token-digester';
import type { PasswordRecoveryTokenGenerator } from './password-recovery-token-generator';

export const PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS = 60 * 60 * 1000;

export interface IssuePasswordRecoveryInput {
  readonly email: string;
}

export class IssuePasswordRecovery {
  public constructor(
    private readonly reader: PasswordRecoveryReader,
    private readonly writer: PasswordRecoveryChallengeWriter,
    private readonly tokenGenerator: PasswordRecoveryTokenGenerator,
    private readonly tokenDigester: PasswordRecoveryTokenDigester,
    private readonly clock: PasswordRecoveryClock,
    private readonly emailDelivery: EmailDelivery,
    private readonly lifecycleLinks: IdentityLifecycleLinkBuilder,
  ) {}

  public async execute(input: IssuePasswordRecoveryInput): Promise<void> {
    const normalizedEmail = normalizePasswordRecoveryEmail(input.email);

    if (normalizedEmail === null) {
      return;
    }

    const actorEmail =
      await this.reader.findRecoverableActorEmailByNormalizedEmail(normalizedEmail);

    if (!actorEmail) {
      return;
    }

    const token = this.tokenGenerator.generate();
    const tokenDigest = this.tokenDigester.digest(token);

    const now = this.clock.now();
    const expiresAt = new Date(now.getTime() + PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS);

    await this.writer.upsertCurrentChallenge({
      actorEmailId: actorEmail.actorEmailId,
      tokenDigest,
      expiresAt,
    });

    const recoveryLink = this.lifecycleLinks.buildPasswordRecoveryLink(token);

    await this.emailDelivery.send({
      to: actorEmail.email,
      subject: 'Reset your AI World password',
      text: [
        'Reset your AI World password:',
        '',
        recoveryLink,
        '',
        'This recovery link expires in 1 hour.',
        '',
        'If you did not request a password reset, you can ignore this email.',
      ].join('\n'),
    });
  }
}
