import { randomUUID } from 'node:crypto';

import type { ResourceId } from '@ai-world/kernel-identifiers';
import { GetUserProfile, type User, type UserProfileReader } from '@ai-world/platform-user';
import { describe, expect, it } from 'vitest';

import {
  AddCollectionResource,
  AddCollectionResourceAsActor,
  COLLECTION_LIST_DEFAULT_LIMIT,
  CreateCollection,
  CreateCollectionAsActor,
  ListCollectionResources,
  ListCollections,
  ListCollectionsAsActor,
  RemoveCollectionResource,
  type Collection,
  type CollectionResourceMembership,
  type CollectionResourceRecordInput,
  type CollectionStore,
  type CreateCollectionRecordInput,
  type ListCollectionRecordsInput,
  type ListCollectionResourceRecordsInput,
} from '../src';

class MemoryCollectionStore implements CollectionStore {
  readonly collections: Collection[] = [];
  readonly memberships: CollectionResourceMembership[] = [];
  listInput: ListCollectionRecordsInput | undefined;

  async create(input: CreateCollectionRecordInput): Promise<Collection> {
    const now = new Date('2026-08-22T12:00:00.000Z');
    const collection: Collection = {
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.collections.push(collection);
    return collection;
  }

  async listByUser(input: ListCollectionRecordsInput): Promise<readonly Collection[]> {
    this.listInput = input;
    return this.collections
      .filter((collection) => collection.userId === input.userId)
      .slice(0, input.limit);
  }

  async addResource(
    input: CollectionResourceRecordInput,
  ): Promise<CollectionResourceMembership | undefined> {
    if (
      !this.collections.some(
        (collection) => collection.id === input.collectionId && collection.userId === input.userId,
      )
    ) {
      return undefined;
    }

    const existing = this.memberships.find(
      (membership) =>
        membership.collectionId === input.collectionId &&
        membership.resourceId === input.resourceId,
    );
    if (existing) {
      return existing;
    }

    const membership: CollectionResourceMembership = {
      collectionId: input.collectionId,
      resourceId: input.resourceId,
      addedAt: new Date('2026-08-22T12:00:00.000Z'),
    };
    this.memberships.push(membership);
    return membership;
  }

  async listResources(
    input: ListCollectionResourceRecordsInput,
  ): Promise<readonly CollectionResourceMembership[] | undefined> {
    if (
      !this.collections.some(
        (collection) => collection.id === input.collectionId && collection.userId === input.userId,
      )
    ) {
      return undefined;
    }

    return this.memberships
      .filter((membership) => membership.collectionId === input.collectionId)
      .slice(0, input.limit);
  }

  async removeResource(input: CollectionResourceRecordInput): Promise<boolean | undefined> {
    if (
      !this.collections.some(
        (collection) => collection.id === input.collectionId && collection.userId === input.userId,
      )
    ) {
      return undefined;
    }

    const index = this.memberships.findIndex(
      (membership) =>
        membership.collectionId === input.collectionId &&
        membership.resourceId === input.resourceId,
    );

    if (index === -1) {
      return false;
    }

    this.memberships.splice(index, 1);
    return true;
  }
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

function userProfileReader(user: User): UserProfileReader {
  return {
    async findByActorId(input) {
      return input.actorId === user.actorId ? user : null;
    },
  };
}

describe('P9-M02 Collection', () => {
  it('creates a User-owned Collection with normalized bounded name', async () => {
    const store = new MemoryCollectionStore();
    const userId = randomUUID();

    const collection = await new CreateCollection(store).execute({
      userId,
      name: '  Study List  ',
    });

    expect(collection).toMatchObject({
      userId,
      name: 'Study List',
    });
    expect(collection.id).toMatch(/^[0-9a-f-]{36}$/);

    await expect(
      new CreateCollection(store).execute({ userId, name: '   ' }),
    ).rejects.toBeInstanceOf(TypeError);
  });

  it('derives Collection ownership from the acting Actor', async () => {
    const store = new MemoryCollectionStore();
    const user = createUser();
    const getUserProfile = new GetUserProfile(userProfileReader(user));

    const collection = await new CreateCollectionAsActor(
      getUserProfile,
      new CreateCollection(store),
    ).execute({
      actingActorId: user.actorId,
      name: 'Actor List',
    });

    expect(collection.userId).toBe(user.id);

    const list = await new ListCollectionsAsActor(
      getUserProfile,
      new ListCollections(store),
    ).execute({
      actingActorId: user.actorId,
    });

    expect(list.map(({ id }) => id)).toEqual([collection.id]);
    expect(store.listInput).toEqual({
      userId: user.id,
      limit: COLLECTION_LIST_DEFAULT_LIMIT,
    });
  });

  it('reuses generic Resource references and enforces Collection ownership', async () => {
    const store = new MemoryCollectionStore();
    const owner = createUser();
    const other = createUser();
    const collection = await new CreateCollection(store).execute({
      userId: owner.id,
      name: 'Cross Universe',
    });
    const resourceId = randomUUID();

    const membership = await new AddCollectionResource(store).execute({
      userId: owner.id,
      collectionId: collection.id,
      resourceId,
    });

    expect(membership.resourceId).toBe(resourceId);
    expect(membership).not.toHaveProperty('resource');
    expect(membership).not.toHaveProperty('universeKey');

    await expect(
      new AddCollectionResource(store).execute({
        userId: other.id,
        collectionId: collection.id,
        resourceId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(TypeError);
  });

  it('bounds reads and makes membership add/remove idempotent', async () => {
    const store = new MemoryCollectionStore();
    const user = createUser();
    const collection = await new CreateCollection(store).execute({
      userId: user.id,
      name: 'Bounded',
    });
    const resourceId = randomUUID();

    const add = new AddCollectionResource(store);
    const listResources = new ListCollectionResources(store);
    const remove = new RemoveCollectionResource(store);

    const first = await add.execute({
      userId: user.id,
      collectionId: collection.id,
      resourceId,
    });
    const second = await add.execute({
      userId: user.id,
      collectionId: collection.id,
      resourceId,
    });

    expect(second).toEqual(first);
    expect(store.memberships).toHaveLength(1);

    await expect(
      new ListCollections(store).execute({ userId: user.id, limit: 101 }),
    ).rejects.toBeInstanceOf(TypeError);
    await expect(
      listResources.execute({
        userId: user.id,
        collectionId: collection.id,
        limit: 201,
      }),
    ).rejects.toBeInstanceOf(TypeError);

    await expect(
      remove.execute({
        userId: user.id,
        collectionId: collection.id,
        resourceId,
      }),
    ).resolves.toEqual({ removed: true });
    await expect(
      remove.execute({
        userId: user.id,
        collectionId: collection.id,
        resourceId,
      }),
    ).resolves.toEqual({ removed: false });
  });

  it('actor membership operations cannot cross User ownership', async () => {
    const store = new MemoryCollectionStore();
    const owner = createUser();
    const other = createUser();
    const collection = await new CreateCollection(store).execute({
      userId: owner.id,
      name: 'Private',
    });

    await expect(
      new AddCollectionResourceAsActor(
        new GetUserProfile(userProfileReader(other)),
        new AddCollectionResource(store),
      ).execute({
        actingActorId: other.actorId,
        collectionId: collection.id,
        resourceId: randomUUID(),
      }),
    ).rejects.toBeInstanceOf(TypeError);
  });
});
