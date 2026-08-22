import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { CollectionResourceMembership } from './collection';
import type { CollectionStore } from './collection-store';

export const COLLECTION_RESOURCE_LIST_DEFAULT_LIMIT = 100;
export const COLLECTION_RESOURCE_LIST_MAX_LIMIT = 200;

export interface AddCollectionResourceInput {
  readonly userId: string;
  readonly collectionId: string;
  readonly resourceId: string;
}

export interface ListCollectionResourcesInput {
  readonly userId: string;
  readonly collectionId: string;
  readonly limit?: number;
}

export interface RemoveCollectionResourceInput {
  readonly userId: string;
  readonly collectionId: string;
  readonly resourceId: string;
}

export interface RemoveCollectionResourceResult {
  readonly removed: boolean;
}

function unavailableCollection(): TypeError {
  return new TypeError('Collection is unavailable to the acting User.');
}

function parseCollectionResourceListLimit(value: number | undefined): number {
  const limit = value ?? COLLECTION_RESOURCE_LIST_DEFAULT_LIMIT;

  if (!Number.isInteger(limit) || limit < 1 || limit > COLLECTION_RESOURCE_LIST_MAX_LIMIT) {
    throw new TypeError(
      `Collection Resource list limit must be an integer between 1 and ${COLLECTION_RESOURCE_LIST_MAX_LIMIT}.`,
    );
  }

  return limit;
}

export class AddCollectionResource {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(input: AddCollectionResourceInput): Promise<CollectionResourceMembership> {
    const membership = await this.collections.addResource({
      userId: parseResourceId(input.userId),
      collectionId: parseResourceId(input.collectionId),
      resourceId: parseResourceId(input.resourceId),
    });

    if (!membership) {
      throw unavailableCollection();
    }

    return membership;
  }
}

export class ListCollectionResources {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(
    input: ListCollectionResourcesInput,
  ): Promise<readonly CollectionResourceMembership[]> {
    const memberships = await this.collections.listResources({
      userId: parseResourceId(input.userId),
      collectionId: parseResourceId(input.collectionId),
      limit: parseCollectionResourceListLimit(input.limit),
    });

    if (!memberships) {
      throw unavailableCollection();
    }

    return memberships;
  }
}

export class RemoveCollectionResource {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(
    input: RemoveCollectionResourceInput,
  ): Promise<RemoveCollectionResourceResult> {
    const removed = await this.collections.removeResource({
      userId: parseResourceId(input.userId),
      collectionId: parseResourceId(input.collectionId),
      resourceId: parseResourceId(input.resourceId),
    });

    if (removed === undefined) {
      throw unavailableCollection();
    }

    return { removed };
  }
}
