import process from 'node:process';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
} from '@ai-world/platform-knowledge';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { PrismaKnowledgeSearch } from '../src/prisma-knowledge-search';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Discovery Knowledge Search integration tests.');
  }

  return databaseUrl;
}

describe('PrismaKnowledgeSearch', () => {
  let database: DatabaseClient;
  const resourceIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...resourceIds],
          },
        },
      });
    }

    resourceIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  async function createKnowledgeResource(input: {
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: string;
    readonly createdAt?: Date;
  }): Promise<string> {
    const id = generateResourceId();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: input.universeKey,
        resourceType: input.resourceType,
        lifecycle: input.lifecycle,
        ...(input.createdAt === undefined
          ? {}
          : {
              createdAt: input.createdAt,
            }),
      },
    });

    resourceIds.add(id);
    return id;
  }

  it('searches only published canonical Knowledge in the requested Universe', async () => {
    const universeKey = parseNamespacedKey('search.test-alpha');
    const otherUniverseKey = parseNamespacedKey('search.test-beta');
    const templeType = parseNamespacedKey('search.temple');
    const deityType = parseNamespacedKey('search.deity');

    const publishedTempleId = await createKnowledgeResource({
      universeKey,
      resourceType: templeType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    await createKnowledgeResource({
      universeKey,
      resourceType: templeType,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });

    await createKnowledgeResource({
      universeKey,
      resourceType: templeType,
      lifecycle: KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
    });

    await createKnowledgeResource({
      universeKey: otherUniverseKey,
      resourceType: templeType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    await createKnowledgeResource({
      universeKey,
      resourceType: deityType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search({
        query: 'TEMPLE',
        scope: {
          kind: 'universe',
          universeKey,
        },
        filter: {
          resourceTypes: [],
        },
        pagination: {
          offset: 0,
          limit: 20,
        },
      }),
    ).resolves.toEqual({
      items: [
        {
          resourceId: publishedTempleId,
          resourceType: templeType,
          universeKey,
        },
      ],
      pagination: {
        offset: 0,
        limit: 20,
      },
    });
  });

  it('applies deterministic offset/limit pagination without introducing ranking', async () => {
    const universeKey = parseNamespacedKey('search.test-pagination');
    const resourceType = parseNamespacedKey('search.temple');

    const oldestId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const middleId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    const newestId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-01-03T00:00:00.000Z'),
    });

    expect(oldestId).not.toBe(middleId);
    expect(newestId).not.toBe(middleId);

    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search({
        query: 'temple',
        scope: {
          kind: 'universe',
          universeKey,
        },
        filter: {
          resourceTypes: [],
        },
        pagination: {
          offset: 1,
          limit: 1,
        },
      }),
    ).resolves.toEqual({
      items: [
        {
          resourceId: middleId,
          resourceType,
          universeKey,
        },
      ],
      pagination: {
        offset: 1,
        limit: 1,
      },
    });
  });
});
