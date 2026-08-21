import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import {
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
} from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { PrismaUserProfileRepository } from '@ai-world/platform-user/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { GenerateText, GenerateTextWithAuthorizedContext, type AiProviderPort } from '../src';
import { PlatformAuthorizedAiContext, PrismaGenerationRepository } from '../src/infrastructure';

const ANIME_UNIVERSE_KEY = parseNamespacedKey('universe.anime');
const ANIME_SERIES_RESOURCE_TYPE = parseNamespacedKey('anime.series');
const ANIME_CHARACTER_RESOURCE_TYPE = parseNamespacedKey('anime.character');
const ANIME_CHARACTER_SUMMARY_TASK = 'ai.anime.character-summary-draft';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for the Phase 7 Anime AI Proof.');
  }

  return databaseUrl;
}

describe('Phase 7 Anime AI Proof', () => {
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
      await database.generation.deleteMany({
        where: {
          actorId: {
            in: [...actorIds],
          },
        },
      });

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

  async function createAdministratorCreator(): Promise<string> {
    const actorId = generateResourceId();
    const userId = generateResourceId();

    const administrator = await database.role.findUnique({
      where: {
        key: 'administrator',
      },
    });

    if (!administrator) {
      throw new Error('Administrator role seed is required.');
    }

    await database.actor.create({
      data: {
        id: actorId,
        user: {
          create: {
            id: userId,
            displayName: 'Anime Creator',
          },
        },
      },
    });

    await database.actorRole.create({
      data: {
        actorId,
        roleId: administrator.id,
      },
    });

    actorIds.add(actorId);
    return actorId;
  }

  async function createAnimeSeries(lifecycle: 'DRAFT' | 'PUBLISHED'): Promise<string> {
    const id = generateResourceId();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: ANIME_UNIVERSE_KEY,
        resourceType: ANIME_SERIES_RESOURCE_TYPE,
        lifecycle,
      },
    });

    knowledgeResourceIds.add(id);
    return id;
  }

  function buildGenerator(provider: AiProviderPort) {
    const repository = new PrismaGenerationRepository(database);
    const authorization = new PrismaAuthorizationRepository(database);

    const authorizedContext = new PlatformAuthorizedAiContext(
      new PrismaUserProfileRepository(database),
      new PrismaKnowledgeSearch(database),
      new PrismaKnowledgeResourceRepository(database),
    );

    const generateText = new GenerateText(provider, repository, {
      provider: 'provider.anime-proof',
      permissions: authorization,
    });

    return {
      repository,
      generateWithContext: new GenerateTextWithAuthorizedContext(authorizedContext, generateText),
    };
  }

  it('drafts a non-canonical Anime character summary from published series context without Provider-specific code', async () => {
    const actorId = await createAdministratorCreator();
    const publishedSeriesId = await createAnimeSeries(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);
    const draftSeriesId = await createAnimeSeries(KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE);

    const characterCountBefore = await database.knowledgeResource.count({
      where: {
        universeKey: ANIME_UNIVERSE_KEY,
        resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
      },
    });

    const draftText =
      'A non-canonical Anime character summary draft grounded in the published series.';

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(request.instructions).toContain('Create a concise Anime character summary draft.');
        expect(request.instructions).toContain(
          'The output is a creator draft and must not mutate canonical Knowledge.',
        );
        expect(request.instructions).toContain('Authorized AI context:');
        expect(request.instructions).toContain('User display name: Anime Creator');
        expect(request.instructions).toContain(`Universe: ${ANIME_UNIVERSE_KEY}`);
        expect(request.instructions).toContain(
          `- ${ANIME_SERIES_RESOURCE_TYPE} | ${publishedSeriesId}`,
        );
        expect(request.instructions).not.toContain(draftSeriesId);

        return {
          text: draftText,
          model: 'model.anime-proof',
          usage: {
            inputTokens: 30,
            outputTokens: 9,
            totalTokens: 39,
          },
        };
      },
    };

    const { repository, generateWithContext } = buildGenerator(provider);

    const generation = await generateWithContext.execute({
      actorId: parseResourceId(actorId),
      universeKey: ANIME_UNIVERSE_KEY,
      input: 'Draft a concise character summary for creator review.',
      instructions: [
        'Create a concise Anime character summary draft.',
        'The output is a creator draft and must not mutate canonical Knowledge.',
      ].join(' '),
      task: ANIME_CHARACTER_SUMMARY_TASK,
      contextQuery: 'series',
      contextResourceTypes: [ANIME_SERIES_RESOURCE_TYPE],
      contextLimit: 10,
    });

    expect(generation).toMatchObject({
      actorId,
      provider: 'provider.anime-proof',
      model: 'model.anime-proof',
      status: 'SUCCEEDED',
      result: {
        text: draftText,
      },
      provenance: {
        task: ANIME_CHARACTER_SUMMARY_TASK,
        sourceContext: {
          universeKey: ANIME_UNIVERSE_KEY,
        },
      },
      usage: {
        inputTokens: 30,
        outputTokens: 9,
        totalTokens: 39,
        failureKind: null,
      },
    });

    const sourceResources = generation.provenance?.sourceContext?.knowledgeResources ?? [];

    expect(sourceResources).toContainEqual({
      id: publishedSeriesId,
      resourceType: ANIME_SERIES_RESOURCE_TYPE,
      universeKey: ANIME_UNIVERSE_KEY,
    });
    expect(sourceResources.map((resource) => resource.id)).not.toContain(draftSeriesId);

    const persisted = await repository.findById({
      id: generation.id,
    });

    expect(persisted).toMatchObject({
      status: 'SUCCEEDED',
      result: {
        text: draftText,
      },
      provenance: {
        task: ANIME_CHARACTER_SUMMARY_TASK,
      },
      usage: {
        inputTokens: 30,
        outputTokens: 9,
        totalTokens: 39,
        failureKind: null,
      },
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: ANIME_UNIVERSE_KEY,
          resourceType: ANIME_CHARACTER_RESOURCE_TYPE,
        },
      }),
    ).resolves.toBe(characterCountBefore);
  });
});
