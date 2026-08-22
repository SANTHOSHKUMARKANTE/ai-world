import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';

import type { Favorite } from './favorite';
import type { FavoriteStore } from './favorite-store';

export interface AddFavoriteInput {
  readonly userId: string;
  readonly resourceId: string;
}

export class AddFavorite {
  public constructor(private readonly favorites: FavoriteStore) {}

  public async execute(input: AddFavoriteInput): Promise<Favorite> {
    return this.favorites.add({
      id: generateResourceId(),
      userId: parseResourceId(input.userId),
      resourceId: parseResourceId(input.resourceId),
    });
  }
}
