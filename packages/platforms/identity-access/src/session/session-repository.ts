export interface CreateSessionRecordInput {
  readonly actorId: string;
  readonly tokenDigest: string;
  readonly expiresAt: Date;
}

export interface CreatedSessionRecord {
  readonly id: string;
  readonly actorId: string;
  readonly expiresAt: Date;
}

export interface SessionRepository {
  create(input: CreateSessionRecordInput): Promise<CreatedSessionRecord>;
}
