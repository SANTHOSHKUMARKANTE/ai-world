import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { CollectionStore } from './collection-store';

export interface DeleteCollectionInput {
  readonly userId: string;
  readonly collectionId: string;
}

export interface DeleteCollectionResult {
  readonly deleted: boolean;
}

export class DeleteCollection {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(input: DeleteCollectionInput): Promise<DeleteCollectionResult> {
    const deleted = await this.collections.delete({
      userId: parseResourceId(input.userId),
      collectionId: parseResourceId(input.collectionId),
    });

    return { deleted };
  }
}
