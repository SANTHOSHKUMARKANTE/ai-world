import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';
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

describe('P6-M03 Universe-scoped Discovery Search', () => {
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

  async function createPublishedResource(input: {
    readonly universeKey: string;
    readonly resourceType: string;
  }): Promise<string> {
    const id = randomUUID();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: input.universeKey,
        resourceType: input.resourceType,
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
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
    const devotionalResourceId = await createPublishedResource({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
    });

    const animeResourceId = await createPublishedResource({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
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
});
