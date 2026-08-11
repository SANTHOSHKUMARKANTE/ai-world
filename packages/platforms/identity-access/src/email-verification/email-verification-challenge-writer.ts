export interface UpsertEmailVerificationChallengeInput {
  readonly actorEmailId: string;
  readonly tokenDigest: string;
  readonly expiresAt: Date;
}

export interface EmailVerificationChallengeWriter {
  upsertCurrentChallenge(input: UpsertEmailVerificationChallengeInput): Promise<void>;
}
