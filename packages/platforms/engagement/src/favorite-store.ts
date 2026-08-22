import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Favorite } from './favorite';

export interface AddFavoriteRecordInput {
  readonly id: ResourceId;
  readonly userId: ResourceId;
  readonly resourceId: ResourceId;
}

export interface RemoveFavoriteRecordInput {
  readonly userId: ResourceId;
  readonly resourceId: ResourceId;
}

export interface ListFavoriteRecordsInput {
  readonly userId: ResourceId;
  readonly limit: number;
}

/**
 * Engagement-owned persistence semantics for idempotent add, remove, and list.
 */
export interface FavoriteStore {
  add(input: AddFavoriteRecordInput): Promise<Favorite>;

  remove(input: RemoveFavoriteRecordInput): Promise<boolean>;

  listByUser(input: ListFavoriteRecordsInput): Promise<readonly Favorite[]>;
}
