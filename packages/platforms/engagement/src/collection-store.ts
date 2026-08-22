import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Collection, CollectionResourceMembership } from './collection';

export interface CreateCollectionRecordInput {
  readonly id: ResourceId;
  readonly userId: ResourceId;
  readonly name: string;
}

export interface ListCollectionRecordsInput {
  readonly userId: ResourceId;
  readonly limit: number;
}

export interface CollectionResourceRecordInput {
  readonly userId: ResourceId;
  readonly collectionId: ResourceId;
  readonly resourceId: ResourceId;
}

export interface ListCollectionResourceRecordsInput {
  readonly userId: ResourceId;
  readonly collectionId: ResourceId;
  readonly limit: number;
}

/**
 * Engagement-owned Collection persistence semantics.
 *
 * undefined means the Collection is not available to the supplied User scope.
 */
export interface CollectionStore {
  create(input: CreateCollectionRecordInput): Promise<Collection>;

  listByUser(input: ListCollectionRecordsInput): Promise<readonly Collection[]>;

  addResource(
    input: CollectionResourceRecordInput,
  ): Promise<CollectionResourceMembership | undefined>;

  listResources(
    input: ListCollectionResourceRecordsInput,
  ): Promise<readonly CollectionResourceMembership[] | undefined>;

  removeResource(input: CollectionResourceRecordInput): Promise<boolean | undefined>;
}
