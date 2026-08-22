import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { FavoriteStore } from './favorite-store';

export interface RemoveFavoriteInput {
  readonly userId: string;
  readonly resourceId: string;
}

export interface RemoveFavoriteResult {
  readonly removed: boolean;
}

export class RemoveFavorite {
  public constructor(private readonly favorites: FavoriteStore) {}

  public async execute(input: RemoveFavoriteInput): Promise<RemoveFavoriteResult> {
    const removed = await this.favorites.remove({
      userId: parseResourceId(input.userId),
      resourceId: parseResourceId(input.resourceId),
    });

    return { removed };
  }
}
