import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import type { Collection, CollectionResourceMembership } from './collection';
import type {
  CollectionResourceRecordInput,
  CollectionStore,
  CreateCollectionRecordInput,
  ListCollectionRecordsInput,
  ListCollectionResourceRecordsInput,
} from './collection-store';

type CollectionDatabaseClient = Pick<DatabaseClient, 'collection' | 'collectionResource'>;

interface PersistedCollection {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

interface PersistedCollectionResource {
  readonly collectionId: string;
  readonly resourceId: string;
  readonly addedAt: Date;
}

function mapCollection(collection: PersistedCollection): Collection {
  return {
    id: parseResourceId(collection.id),
    userId: parseResourceId(collection.userId),
    name: collection.name,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  };
}

function mapMembership(membership: PersistedCollectionResource): CollectionResourceMembership {
  return {
    collectionId: parseResourceId(membership.collectionId),
    resourceId: parseResourceId(membership.resourceId),
    addedAt: membership.addedAt,
  };
}

export class PrismaCollectionRepository implements CollectionStore {
  public constructor(private readonly database: CollectionDatabaseClient) {}

  private async ownsCollection(userId: string, collectionId: string): Promise<boolean> {
    const collection = await this.database.collection.findFirst({
      where: {
        id: collectionId,
        userId,
      },
      select: { id: true },
    });

    return collection !== null;
  }

  public async create(input: CreateCollectionRecordInput): Promise<Collection> {
    const collection = await this.database.collection.create({
      data: {
        id: input.id,
        userId: input.userId,
        name: input.name,
      },
    });

    return mapCollection(collection);
  }

  public async listByUser(input: ListCollectionRecordsInput): Promise<readonly Collection[]> {
    const collections = await this.database.collection.findMany({
      where: { userId: input.userId },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      take: input.limit,
    });

    return collections.map(mapCollection);
  }

  public async addResource(
    input: CollectionResourceRecordInput,
  ): Promise<CollectionResourceMembership | undefined> {
    if (!(await this.ownsCollection(input.userId, input.collectionId))) {
      return undefined;
    }

    const membership = await this.database.collectionResource.upsert({
      where: {
        collectionId_resourceId: {
          collectionId: input.collectionId,
          resourceId: input.resourceId,
        },
      },
      create: {
        collectionId: input.collectionId,
        resourceId: input.resourceId,
      },
      update: {},
    });

    return mapMembership(membership);
  }

  public async listResources(
    input: ListCollectionResourceRecordsInput,
  ): Promise<readonly CollectionResourceMembership[] | undefined> {
    if (!(await this.ownsCollection(input.userId, input.collectionId))) {
      return undefined;
    }

    const memberships = await this.database.collectionResource.findMany({
      where: { collectionId: input.collectionId },
      orderBy: [{ addedAt: 'desc' }, { resourceId: 'asc' }],
      take: input.limit,
    });

    return memberships.map(mapMembership);
  }

  public async removeResource(input: CollectionResourceRecordInput): Promise<boolean | undefined> {
    if (!(await this.ownsCollection(input.userId, input.collectionId))) {
      return undefined;
    }

    const result = await this.database.collectionResource.deleteMany({
      where: {
        collectionId: input.collectionId,
        resourceId: input.resourceId,
      },
    });

    return result.count === 1;
  }
}
