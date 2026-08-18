import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import {
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
} from '@ai-world/platform-knowledge';
import { ANIME_CHARACTER_RESOURCE_TYPE, ANIME_UNIVERSE_KEY } from '@ai-world/universe-anime';
import {
  DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
  DEVOTIONAL_UNIVERSE_KEY,
} from '@ai-world/universe-devotional';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Discovery Universe-scope integration tests.');
}

describe('Discovery Search across Devotional and Anime Universes', () => {
  let database: DatabaseClient;
  const resourceIds = new Set<string>();

  async function cleanupFixtures(): Promise<void> {
    if (resourceIds.size === 0) {
      return;
    }

    await database.knowledgeResource.deleteMany({
      where: {
        id: {
          in: [...resourceIds],
        },
      },
    });

    resourceIds.clear();
  }

  async function createKnowledgeResource(input: {
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: string;
    readonly createdAt?: Date;
  }): Promise<string> {
    const id = randomUUID();

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

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });
  });

  afterEach(cleanupFixtures);

  afterAll(async () => {
    await cleanupFixtures();
    await database.$disconnect();
  });

  it('reuses the same generic Search implementation for Devotional-only and Anime-only results', async () => {
    const devotionalResourceId = await createKnowledgeResource({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const animeResourceId = await createKnowledgeResource({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const search = new PrismaKnowledgeSearch(database);

    const devotionalResults = await search.search({
      query: '.',
      scope: {
        kind: 'universe',
        universeKey: DEVOTIONAL_UNIVERSE_KEY,
      },
      filter: {
        resourceTypes: [],
      },
      pagination: {
        offset: 0,
        limit: 20,
      },
    });

    const animeResults = await search.search({
      query: '.',
      scope: {
        kind: 'universe',
        universeKey: ANIME_UNIVERSE_KEY,
      },
      filter: {
        resourceTypes: [],
      },
      pagination: {
        offset: 0,
        limit: 20,
      },
    });

    expect(devotionalResults).toEqual({
      items: [
        {
          resourceId: devotionalResourceId,
          resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
          universeKey: DEVOTIONAL_UNIVERSE_KEY,
        },
      ],
      pagination: {
        offset: 0,
        limit: 20,
      },
    });

    expect(animeResults).toEqual({
      items: [
        {
          resourceId: animeResourceId,
          resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
          universeKey: ANIME_UNIVERSE_KEY,
        },
      ],
      pagination: {
        offset: 0,
        limit: 20,
      },
    });

    expect(devotionalResults.items).not.toContainEqual({
      resourceId: animeResourceId,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      universeKey: ANIME_UNIVERSE_KEY,
    });

    expect(animeResults.items).not.toContainEqual({
      resourceId: devotionalResourceId,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
    });
  });

  it('globally ranks published Knowledge across both real Universes without broadening lifecycle visibility', async () => {
    const devotionalPublishedId = await createKnowledgeResource({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-01-02T00:00:00.000Z'),
    });

    const animePublishedId = await createKnowledgeResource({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-01-01T00:00:00.000Z'),
    });

    const devotionalDraftId = await createKnowledgeResource({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });

    const animeArchivedId = await createKnowledgeResource({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
    });

    const search = new PrismaKnowledgeSearch(database);

    const globalResults = await search.search({
      query: 'A',
      scope: {
        kind: 'global',
      },
      filter: {
        resourceTypes: [],
      },
      pagination: {
        offset: 0,
        limit: 100,
      },
    });

    expect(globalResults.items).toEqual(
      expect.arrayContaining([
        {
          resourceId: devotionalPublishedId,
          resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
          universeKey: DEVOTIONAL_UNIVERSE_KEY,
        },
        {
          resourceId: animePublishedId,
          resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
          universeKey: ANIME_UNIVERSE_KEY,
        },
      ]),
    );

    expect(globalResults.items).not.toContainEqual({
      resourceId: devotionalDraftId,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
    });

    expect(globalResults.items).not.toContainEqual({
      resourceId: animeArchivedId,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      universeKey: ANIME_UNIVERSE_KEY,
    });

    const devotionalIndex = globalResults.items.findIndex(
      (item) => item.resourceId === devotionalPublishedId,
    );
    const animeIndex = globalResults.items.findIndex(
      (item) => item.resourceId === animePublishedId,
    );

    expect(devotionalIndex).toBeGreaterThanOrEqual(0);
    expect(animeIndex).toBeGreaterThanOrEqual(0);
    expect(animeIndex).toBeLessThan(devotionalIndex);

    expect(globalResults.pagination).toEqual({
      offset: 0,
      limit: 100,
    });
  });
  it('filters global Search by a real Resource Type without adding named-Universe Discovery logic', async () => {
    const devotionalResourceId = await createKnowledgeResource({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-02-02T00:00:00.000Z'),
    });

    await createKnowledgeResource({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt: new Date('2026-02-01T00:00:00.000Z'),
    });

    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search({
        query: '.',
        scope: {
          kind: 'global',
        },
        filter: {
          resourceTypes: [DEVOTIONAL_TEMPLE_RESOURCE_TYPE],
        },
        pagination: {
          offset: 0,
          limit: 20,
        },
      }),
    ).resolves.toEqual({
      items: [
        {
          resourceId: devotionalResourceId,
          resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
          universeKey: DEVOTIONAL_UNIVERSE_KEY,
        },
      ],
      pagination: {
        offset: 0,
        limit: 20,
      },
    });
  });
});
