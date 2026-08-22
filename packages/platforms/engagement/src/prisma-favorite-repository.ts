import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { Favorite } from './favorite';
import type {
  AddFavoriteRecordInput,
  FavoriteStore,
  ListFavoriteRecordsInput,
  RemoveFavoriteRecordInput,
} from './favorite-store';

type FavoriteDatabaseClient = Pick<DatabaseClient, 'favorite'>;

interface PersistedFavorite {
  readonly id: string;
  readonly userId: string;
  readonly resourceId: string;
  readonly createdAt: Date;
}

function mapPersistedFavorite(favorite: PersistedFavorite): Favorite {
  return {
    id: parseResourceId(favorite.id),
    userId: parseResourceId(favorite.userId),
    resourceId: parseResourceId(favorite.resourceId),
    createdAt: favorite.createdAt,
  };
}

export class PrismaFavoriteRepository implements FavoriteStore {
  public constructor(private readonly database: FavoriteDatabaseClient) {}

  public async add(input: AddFavoriteRecordInput): Promise<Favorite> {
    const favorite = await this.database.favorite.upsert({
      where: {
        userId_resourceId: {
          userId: input.userId,
          resourceId: input.resourceId,
        },
      },
      create: {
        id: input.id,
        userId: input.userId,
        resourceId: input.resourceId,
      },
      update: {},
    });

    return mapPersistedFavorite(favorite);
  }

  public async remove(input: RemoveFavoriteRecordInput): Promise<boolean> {
    const result = await this.database.favorite.deleteMany({
      where: {
        userId: input.userId,
        resourceId: input.resourceId,
      },
    });

    return result.count === 1;
  }

  public async listByUser(input: ListFavoriteRecordsInput): Promise<readonly Favorite[]> {
    const favorites = await this.database.favorite.findMany({
      where: {
        userId: input.userId,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: input.limit,
    });

    return favorites.map(mapPersistedFavorite);
  }
}
