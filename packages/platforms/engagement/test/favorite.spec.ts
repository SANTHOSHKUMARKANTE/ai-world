import { randomUUID } from 'node:crypto';

import type { ResourceId } from '@ai-world/kernel-identifiers';
import { GetUserProfile, type User, type UserProfileReader } from '@ai-world/platform-user';
import { describe, expect, it } from 'vitest';

import {
  AddFavorite,
  AddFavoriteAsActor,
  FAVORITE_LIST_DEFAULT_LIMIT,
  ListFavorites,
  ListFavoritesAsActor,
  RemoveFavorite,
  RemoveFavoriteAsActor,
  type AddFavoriteRecordInput,
  type Favorite,
  type FavoriteStore,
  type ListFavoriteRecordsInput,
  type RemoveFavoriteRecordInput,
} from '../src';

class MemoryFavoriteStore implements FavoriteStore {
  readonly records: Favorite[] = [];
  listInput: ListFavoriteRecordsInput | undefined;

  async add(input: AddFavoriteRecordInput): Promise<Favorite> {
    const existing = this.records.find(
      (favorite) => favorite.userId === input.userId && favorite.resourceId === input.resourceId,
    );

    if (existing) {
      return existing;
    }

    const favorite: Favorite = {
      ...input,
      createdAt: new Date('2026-08-22T12:00:00.000Z'),
    };

    this.records.push(favorite);
    return favorite;
  }

  async remove(input: RemoveFavoriteRecordInput): Promise<boolean> {
    const index = this.records.findIndex(
      (favorite) => favorite.userId === input.userId && favorite.resourceId === input.resourceId,
    );

    if (index === -1) {
      return false;
    }

    this.records.splice(index, 1);
    return true;
  }

  async listByUser(input: ListFavoriteRecordsInput): Promise<readonly Favorite[]> {
    this.listInput = input;

    return this.records
      .filter((favorite) => favorite.userId === input.userId)
      .slice(0, input.limit);
  }
}

function userProfileReader(user: User): UserProfileReader {
  return {
    async findByActorId(input) {
      return input.actorId === user.actorId ? user : null;
    },
  };
}

function createUser(): User {
  const now = new Date('2026-08-22T12:00:00.000Z');

  return {
    id: randomUUID() as ResourceId,
    actorId: randomUUID() as ResourceId,
    displayName: null,
    createdAt: now,
    updatedAt: now,
  };
}

describe('Favorite', () => {
  it('adds a stable Resource reference without copying referenced Resource state', async () => {
    const store = new MemoryFavoriteStore();
    const userId = randomUUID();
    const resourceId = randomUUID();

    const favorite = await new AddFavorite(store).execute({ userId, resourceId });

    expect(favorite).toMatchObject({ userId, resourceId });
    expect(favorite.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(favorite).not.toHaveProperty('resource');
    expect(favorite).not.toHaveProperty('universeKey');
    expect(favorite).not.toHaveProperty('resourceType');
  });

  it('rejects non-canonical User and Resource identifiers before persistence', async () => {
    const store = new MemoryFavoriteStore();
    const addFavorite = new AddFavorite(store);

    await expect(
      addFavorite.execute({ userId: 'not-a-user-id', resourceId: randomUUID() }),
    ).rejects.toBeInstanceOf(TypeError);

    await expect(
      addFavorite.execute({ userId: randomUUID(), resourceId: 'not-a-resource-id' }),
    ).rejects.toBeInstanceOf(TypeError);

    expect(store.records).toHaveLength(0);
  });

  it('derives Favorite ownership from the acting Actor User profile', async () => {
    const store = new MemoryFavoriteStore();
    const user = createUser();
    const getUserProfile = new GetUserProfile(userProfileReader(user));
    const resourceId = randomUUID();

    const favorite = await new AddFavoriteAsActor(getUserProfile, new AddFavorite(store)).execute({
      actingActorId: user.actorId,
      resourceId,
    });

    expect(favorite.userId).toBe(user.id);
    expect(favorite.resourceId).toBe(resourceId);
  });

  it('lists and removes only Favorites belonging to the acting Actor User', async () => {
    const store = new MemoryFavoriteStore();
    const firstUser = createUser();
    const secondUser = createUser();
    const firstResourceId = randomUUID();
    const secondResourceId = randomUUID();

    await new AddFavorite(store).execute({
      userId: firstUser.id,
      resourceId: firstResourceId,
    });
    await new AddFavorite(store).execute({
      userId: secondUser.id,
      resourceId: secondResourceId,
    });

    const firstProfile = new GetUserProfile(userProfileReader(firstUser));
    const favorites = await new ListFavoritesAsActor(
      firstProfile,
      new ListFavorites(store),
    ).execute({
      actingActorId: firstUser.actorId,
    });

    expect(favorites.map((favorite) => favorite.resourceId)).toEqual([firstResourceId]);
    expect(store.listInput).toEqual({
      userId: firstUser.id,
      limit: FAVORITE_LIST_DEFAULT_LIMIT,
    });

    await new RemoveFavoriteAsActor(firstProfile, new RemoveFavorite(store)).execute({
      actingActorId: firstUser.actorId,
      resourceId: firstResourceId,
    });

    expect(store.records).toHaveLength(1);
    expect(store.records[0]?.userId).toBe(secondUser.id);
  });

  it('bounds Favorite listing and makes removal idempotent', async () => {
    const store = new MemoryFavoriteStore();
    const userId = randomUUID();
    const resourceId = randomUUID();
    const listFavorites = new ListFavorites(store);
    const removeFavorite = new RemoveFavorite(store);

    await new AddFavorite(store).execute({ userId, resourceId });

    await expect(listFavorites.execute({ userId, limit: 0 })).rejects.toBeInstanceOf(TypeError);
    await expect(listFavorites.execute({ userId, limit: 101 })).rejects.toBeInstanceOf(TypeError);

    await expect(removeFavorite.execute({ userId, resourceId })).resolves.toEqual({
      removed: true,
    });
    await expect(removeFavorite.execute({ userId, resourceId })).resolves.toEqual({
      removed: false,
    });
  });
});
