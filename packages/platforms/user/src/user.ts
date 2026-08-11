export interface User {
  readonly id: string;
  readonly actorId: string;
  readonly displayName: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
