import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  AddCollectionResource,
  CreateCollection,
  DeleteCollection,
  ListCollectionResources,
  ListCollections,
  RemoveCollectionResource,
} from '../src';
import { PrismaCollectionRepository } from '../src/infrastructure';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Collection persistence integration tests.');
}

describe('P9-M02 Collection PostgreSQL persistence', () => {
  let database: DatabaseClient;
  const actorId = randomUUID();
  const userId = randomUUID();

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await database.actor.create({ data: { id: actorId } });
    await database.user.create({
      data: {
        id: userId,
        actorId,
      },
    });
  });

  afterAll(async () => {
    await database.collectionResource.deleteMany({
      where: {
        collection: { userId },
      },
    });
    await database.collection.deleteMany({ where: { userId } });
    await database.user.deleteMany({ where: { id: userId } });
    await database.actor.deleteMany({ where: { id: actorId } });
    await database.$disconnect();
  });

  it('persists User-owned Collections and idempotent generic Resource membership', async () => {
    const repository = new PrismaCollectionRepository(database);
    const create = new CreateCollection(repository);
    const list = new ListCollections(repository);
    const add = new AddCollectionResource(repository);
    const listResources = new ListCollectionResources(repository);
    const remove = new RemoveCollectionResource(repository);
    const deleteCollection = new DeleteCollection(repository);

    const collection = await create.execute({
      userId,
      name: 'Persistence Proof',
    });

    const devotionalResourceId = randomUUID();
    const animeResourceId = randomUUID();

    const first = await add.execute({
      userId,
      collectionId: collection.id,
      resourceId: devotionalResourceId,
    });
    const duplicate = await add.execute({
      userId,
      collectionId: collection.id,
      resourceId: devotionalResourceId,
    });
    await add.execute({
      userId,
      collectionId: collection.id,
      resourceId: animeResourceId,
    });

    expect(duplicate).toEqual(first);
    expect(await list.execute({ userId })).toHaveLength(1);

    const resources = await listResources.execute({
      userId,
      collectionId: collection.id,
    });

    expect(resources.map(({ resourceId }) => resourceId).sort()).toEqual(
      [devotionalResourceId, animeResourceId].sort(),
    );

    await expect(
      remove.execute({
        userId,
        collectionId: collection.id,
        resourceId: devotionalResourceId,
      }),
    ).resolves.toEqual({ removed: true });

    await expect(
      remove.execute({
        userId,
        collectionId: collection.id,
        resourceId: devotionalResourceId,
      }),
    ).resolves.toEqual({ removed: false });

    expect(
      await database.collectionResource.count({
        where: { collectionId: collection.id },
      }),
    ).toBe(1);

    await expect(
      deleteCollection.execute({ userId: randomUUID(), collectionId: collection.id }),
    ).resolves.toEqual({ deleted: false });
    await expect(
      deleteCollection.execute({ userId, collectionId: collection.id }),
    ).resolves.toEqual({ deleted: true });
    expect(
      await database.collectionResource.count({ where: { collectionId: collection.id } }),
    ).toBe(0);
  });
});
