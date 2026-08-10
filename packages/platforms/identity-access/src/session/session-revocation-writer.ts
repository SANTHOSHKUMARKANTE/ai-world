export interface RevokeSessionByActorInput {
  readonly actorId: string;
  readonly sessionId: string;
  readonly revokedAt: Date;
}

export interface RevokeSessionByTokenDigestInput {
  readonly tokenDigest: string;
  readonly revokedAt: Date;
}

export interface SessionRevocationWriter {
  revokeByActor(input: RevokeSessionByActorInput): Promise<void>;

  revokeByTokenDigest(input: RevokeSessionByTokenDigestInput): Promise<void>;
}
