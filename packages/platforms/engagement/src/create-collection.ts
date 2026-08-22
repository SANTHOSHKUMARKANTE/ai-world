import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';

import type { Collection } from './collection';
import type { CollectionStore } from './collection-store';

export const COLLECTION_NAME_MAX_LENGTH = 120;

export interface CreateCollectionInput {
  readonly userId: string;
  readonly name: string;
}

function parseCollectionName(value: string): string {
  const name = value.trim();

  if (name.length < 1 || name.length > COLLECTION_NAME_MAX_LENGTH) {
    throw new TypeError(
      `Collection name must contain between 1 and ${COLLECTION_NAME_MAX_LENGTH} characters.`,
    );
  }

  return name;
}

export class CreateCollection {
  public constructor(private readonly collections: CollectionStore) {}

  public async execute(input: CreateCollectionInput): Promise<Collection> {
    return this.collections.create({
      id: generateResourceId(),
      userId: parseResourceId(input.userId),
      name: parseCollectionName(input.name),
    });
  }
}
