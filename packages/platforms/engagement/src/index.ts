export { AddFavorite, type AddFavoriteInput } from './add-favorite';

export {
  AddFavoriteAsActor,
  ListFavoritesAsActor,
  RemoveFavoriteAsActor,
  type AddFavoriteAsActorInput,
  type ListFavoritesAsActorInput,
  type RemoveFavoriteAsActorInput,
} from './actor-favorites';

export type { Favorite } from './favorite';

export type {
  AddFavoriteRecordInput,
  FavoriteStore,
  ListFavoriteRecordsInput,
  RemoveFavoriteRecordInput,
} from './favorite-store';

export {
  FAVORITE_LIST_DEFAULT_LIMIT,
  FAVORITE_LIST_MAX_LIMIT,
  ListFavorites,
  type ListFavoritesInput,
} from './list-favorites';

export {
  RemoveFavorite,
  type RemoveFavoriteInput,
  type RemoveFavoriteResult,
} from './remove-favorite';
