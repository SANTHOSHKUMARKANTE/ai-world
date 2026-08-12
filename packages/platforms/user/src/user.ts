import type { ResourceId } from '@ai-world/kernel-identifiers';

export interface User {
  readonly id: ResourceId;
  readonly actorId: ResourceId;
  readonly displayName: string | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
