import type { ResourceId } from '@ai-world/kernel-identifiers';

export interface Collection {
  readonly id: ResourceId;
  readonly userId: ResourceId;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

/**
 * Engagement-owned membership edge.
 *
 * resourceId remains a generic reference. Engagement owns membership semantics,
 * not the referenced Resource's canonical state or lifecycle.
 */
export interface CollectionResourceMembership {
  readonly collectionId: ResourceId;
  readonly resourceId: ResourceId;
  readonly addedAt: Date;
}
