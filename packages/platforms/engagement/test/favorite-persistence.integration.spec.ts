import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { AddFavorite, ListFavorites, RemoveFavorite } from '../src';
import { PrismaFavoriteRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Favorite persistence integration tests.');
  }

  return databaseUrl;
}

describe('Favorite persistence', () => {
  let database: DatabaseClient;
  let repository: PrismaFavoriteRepository;
  let firstActorId: string;
  let firstUserId: string;
  let secondActorId: string;
  let secondUserId: string;

  async function cleanup(): Promise<void> {
    const userIds = [firstUserId, secondUserId].filter(Boolean);
    const actorIds = [firstActorId, secondActorId].filter(Boolean);

    if (userIds.length > 0) {
      await database.favorite.deleteMany({ where: { userId: { in: userIds } } });
      await database.user.deleteMany({ where: { id: { in: userIds } } });
    }

    if (actorIds.length > 0) {
      await database.actor.deleteMany({ where: { id: { in: actorIds } } });
    }
  }

  beforeAll(() => {
    database = createDatabaseClient({ connectionString: requireDatabaseUrl() });
    repository = new PrismaFavoriteRepository(database);
  });

  beforeEach(async () => {
    await cleanup();

    firstActorId = randomUUID();
    firstUserId = randomUUID();
    secondActorId = randomUUID();
    secondUserId = randomUUID();

    await database.actor.createMany({
      data: [{ id: firstActorId }, { id: secondActorId }],
    });
    await database.user.createMany({
      data: [
        { id: firstUserId, actorId: firstActorId },
        { id: secondUserId, actorId: secondActorId },
      ],
    });
  });

  afterAll(async () => {
    await cleanup();
    await database.$disconnect();
  });

  it('idempotently persists, isolates, lists, and removes generic Resource Favorites', async () => {
    const addFavorite = new AddFavorite(repository);
    const listFavorites = new ListFavorites(repository);
    const removeFavorite = new RemoveFavorite(repository);
    const devotionalResourceId = randomUUID();
    const animeResourceId = randomUUID();

    const first = await addFavorite.execute({
      userId: firstUserId,
      resourceId: devotionalResourceId,
    });
    const duplicate = await addFavorite.execute({
      userId: firstUserId,
      resourceId: devotionalResourceId,
    });
    const anime = await addFavorite.execute({
      userId: firstUserId,
      resourceId: animeResourceId,
    });
    await addFavorite.execute({
      userId: secondUserId,
      resourceId: devotionalResourceId,
    });

    expect(duplicate).toEqual(first);
    expect(anime.resourceId).toBe(animeResourceId);
    expect(
      await database.favorite.count({
        where: { userId: firstUserId },
      }),
    ).toBe(2);

    const firstUserFavorites = await listFavorites.execute({
      userId: firstUserId,
      limit: 100,
    });
    const secondUserFavorites = await listFavorites.execute({
      userId: secondUserId,
      limit: 100,
    });

    expect(firstUserFavorites.map((favorite) => favorite.resourceId).sort()).toEqual(
      [devotionalResourceId, animeResourceId].sort(),
    );
    expect(secondUserFavorites.map((favorite) => favorite.resourceId)).toEqual([
      devotionalResourceId,
    ]);

    await expect(
      removeFavorite.execute({
        userId: firstUserId,
        resourceId: devotionalResourceId,
      }),
    ).resolves.toEqual({ removed: true });
    await expect(
      removeFavorite.execute({
        userId: firstUserId,
        resourceId: devotionalResourceId,
      }),
    ).resolves.toEqual({ removed: false });

    expect(
      await database.favorite.count({
        where: { userId: secondUserId, resourceId: devotionalResourceId },
      }),
    ).toBe(1);
  });
});
