import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { Collection } from './collection';
import type { CollectionStore } from './collection-store';

export const COLLECTION_LIST_DEFAULT_LIMIT = 50;
export const COLLECTION_LIST_MAX_LIMIT = 100;

export interface ListCollectionsInput {
  readonly userId: string;
  readonly limit?: number;
}

function parseCollectionListLimit(value: number | undefined): number {
  const limit = value ?? COLLECTION_LIST_DEFAULT_LIMIT;

  if (!Number.isInteger(limit) || limit < 1 || limit > COLLECTION_LIST_MAX_LIMIT) {
    throw new TypeError(
      `Collection list limit must be an integer between 1 and ${COLLECTION_LIST_MAX_LIMIT}.`,
    );
  }

  return limit;
}

export class ListCollections {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(input: ListCollectionsInput): Promise<readonly Collection[]> {
    return this.collections.listByUser({
      userId: parseResourceId(input.userId),
      limit: parseCollectionListLimit(input.limit),
    });
  }
}
