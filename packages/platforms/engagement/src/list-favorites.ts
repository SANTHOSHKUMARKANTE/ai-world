import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { Favorite } from './favorite';
import type { FavoriteStore } from './favorite-store';

export const FAVORITE_LIST_DEFAULT_LIMIT = 50;
export const FAVORITE_LIST_MAX_LIMIT = 100;

export interface ListFavoritesInput {
  readonly userId: string;
  readonly limit?: number;
}

function parseFavoriteListLimit(value: number | undefined): number {
  const limit = value ?? FAVORITE_LIST_DEFAULT_LIMIT;

  if (!Number.isInteger(limit) || limit < 1 || limit > FAVORITE_LIST_MAX_LIMIT) {
    throw new TypeError(
      `Favorite list limit must be an integer between 1 and ${FAVORITE_LIST_MAX_LIMIT}.`,
    );
  }

  return limit;
}

export class ListFavorites {
  public constructor(private readonly favorites: FavoriteStore) {}

  public async execute(input: ListFavoritesInput): Promise<readonly Favorite[]> {
    return this.favorites.listByUser({
      userId: parseResourceId(input.userId),
      limit: parseFavoriteListLimit(input.limit),
    });
  }
}
