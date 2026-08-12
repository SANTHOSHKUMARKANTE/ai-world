import type { ResourceId } from '@ai-world/kernel-identifiers';

export interface Actor {
  readonly id: ResourceId;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
