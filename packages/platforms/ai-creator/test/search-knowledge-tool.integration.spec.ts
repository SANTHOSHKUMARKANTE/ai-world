import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import {
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
} from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { PrismaUserProfileRepository } from '@ai-world/platform-user/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  AI_SEARCH_KNOWLEDGE_TOOL_EFFECT,
  AI_SEARCH_KNOWLEDGE_TOOL_NAME,
  SearchKnowledgeTool,
} from '../src';
import { PlatformAuthorizedAiContext } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Search Knowledge Tool integration tests.');
  }

  return databaseUrl;
}

describe('P7-M10 Search Knowledge Tool vertical slice', () => {
  let database: DatabaseClient;
  const actorIds = new Set<string>();
  const knowledgeResourceIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (actorIds.size > 0) {
      await database.user.deleteMany({
        where: {
          actorId: {
            in: [...actorIds],
          },
        },
      });

      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    if (knowledgeResourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...knowledgeResourceIds],
          },
        },
      });
    }

    actorIds.clear();
    knowledgeResourceIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  async function createCreator(displayName: string): Promise<string> {
    const actorId = generateResourceId();
    const userId = generateResourceId();

    await database.actor.create({
      data: {
        id: actorId,
        user: {
          create: {
            id: userId,
            displayName,
          },
        },
      },
    });

    actorIds.add(actorId);
    return actorId;
  }

  async function createKnowledgeResource(input: {
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: string;
  }): Promise<string> {
    const id = generateResourceId();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: input.universeKey,
        resourceType: input.resourceType,
        lifecycle: input.lifecycle,
      },
    });

    knowledgeResourceIds.add(id);
    return id;
  }

  function buildTool(): SearchKnowledgeTool {
    return new SearchKnowledgeTool(
      new PlatformAuthorizedAiContext(
        new PrismaUserProfileRepository(database),
        new PrismaKnowledgeSearch(database),
        new PrismaKnowledgeResourceRepository(database),
      ),
    );
  }

  it('executes a bounded actor-bound read-only Search Knowledge Tool over published same-Universe Discovery results', async () => {
    const actorId = await createCreator('Creator');
    const universeKey = parseNamespacedKey('tool.search-alpha');
    const otherUniverseKey = parseNamespacedKey('tool.search-beta');
    const resourceType = parseNamespacedKey('tool.temple');

    const publishedId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const secondPublishedId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const draftId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });

    const otherUniverseId = await createKnowledgeResource({
      universeKey: otherUniverseKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const beforeGenerations = await database.generation.count({
      where: {
        actorId,
      },
    });

    const result = await buildTool().execute({
      actorId: parseResourceId(actorId),
      universeKey,
      query: 'temple',
      resourceTypes: [resourceType],
      limit: 1,
    });

    expect(result.toolName).toBe(AI_SEARCH_KNOWLEDGE_TOOL_NAME);
    expect(result.effect).toBe(AI_SEARCH_KNOWLEDGE_TOOL_EFFECT);
    expect(result.items).toHaveLength(1);
    expect([publishedId, secondPublishedId]).toContain(result.items[0]?.resourceId);
    expect(result.items[0]).toMatchObject({
      resourceType,
      universeKey,
    });

    expect(result.items.map((item) => item.resourceId)).not.toContain(draftId);
    expect(result.items.map((item) => item.resourceId)).not.toContain(otherUniverseId);

    await expect(
      database.generation.count({
        where: {
          actorId,
        },
      }),
    ).resolves.toBe(beforeGenerations);
  });

  it('fails closed for an Actor without a resolvable self User before exposing Knowledge results', async () => {
    const universeKey = parseNamespacedKey('tool.search-missing-actor');
    const resourceType = parseNamespacedKey('tool.temple');

    await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const unresolvedActorId = generateResourceId();
    const beforeGenerations = await database.generation.count({
      where: {
        actorId: unresolvedActorId,
      },
    });

    await expect(
      buildTool().execute({
        actorId: unresolvedActorId,
        universeKey,
        query: 'temple',
        limit: 5,
      }),
    ).rejects.toThrow('Authorized AI context could not resolve the requesting User.');

    await expect(
      database.generation.count({
        where: {
          actorId: unresolvedActorId,
        },
      }),
    ).resolves.toBe(beforeGenerations);
  });
});
