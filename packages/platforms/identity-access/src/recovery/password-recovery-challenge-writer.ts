export interface UpsertPasswordRecoveryChallengeInput {
  readonly actorEmailId: string;
  readonly tokenDigest: string;
  readonly expiresAt: Date;
}

export interface PasswordRecoveryChallengeWriter {
  upsertCurrentChallenge(input: UpsertPasswordRecoveryChallengeInput): Promise<void>;
}
