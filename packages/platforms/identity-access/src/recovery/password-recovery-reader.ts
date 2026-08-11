export interface PasswordRecoveryActorEmail {
  readonly actorEmailId: string;
  readonly email: string;
}

export interface PasswordRecoveryReader {
  findRecoverableActorEmailByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<PasswordRecoveryActorEmail | null>;
}
