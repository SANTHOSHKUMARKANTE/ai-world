export interface SessionValidationRecord {
  readonly sessionId: string;
  readonly actorId: string;
  readonly expiresAt: Date;
  readonly revokedAt: Date | null;
}

export interface SessionValidationReader {
  findByTokenDigest(tokenDigest: string): Promise<SessionValidationRecord | null>;
}
