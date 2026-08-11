export interface EmailVerificationActorEmail {
  readonly actorEmailId: string;
  readonly email: string;
  readonly verifiedAt: Date | null;
}

export interface EmailVerificationReader {
  findActorEmailByActorId(actorId: string): Promise<EmailVerificationActorEmail | null>;
}
