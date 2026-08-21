import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import { EvaluatePermission as EvaluateIdentityPermission } from '@ai-world/platform-identity-access';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import {
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
} from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { PrismaUserProfileRepository } from '@ai-world/platform-user/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
  GenerateText,
  GenerateTextWithAuthorizedContext,
  ReviewAndAcceptGenerationAsKnowledgeResource,
  SuggestKnowledgeResourceCandidate,
  type AiProviderPort,
} from '../src';
import {
  PlatformAuthorizedAiContext,
  PlatformKnowledgeCanonicalAcceptance,
  PrismaGenerationRepository,
} from '../src/infrastructure';

const DEVOTIONAL_UNIVERSE_KEY = parseNamespacedKey('universe.devotional');
const DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE = parseNamespacedKey('devotional.scripture');
const DEVOTIONAL_TEMPLE_RESOURCE_TYPE = parseNamespacedKey('devotional.temple');

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for the Phase 7 Devotional AI Proof.');
  }

  return databaseUrl;
}

describe('Phase 7 Devotional AI Proof', () => {
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
            displayName: 'Devotional Creator',
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

  async function createDevotionalScripture(lifecycle: 'DRAFT' | 'PUBLISHED'): Promise<string> {
    const id = generateResourceId();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: DEVOTIONAL_UNIVERSE_KEY,
        resourceType: DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
        lifecycle,
      },
    });

    knowledgeResourceIds.add(id);
    return id;
  }

  function buildAssistance(provider: AiProviderPort) {
    const authorization = new PrismaAuthorizationRepository(database);
    const repository = new PrismaGenerationRepository(database);

    const authorizedContext = new PlatformAuthorizedAiContext(
      new PrismaUserProfileRepository(database),
      new PrismaKnowledgeSearch(database),
      new PrismaKnowledgeResourceRepository(database),
    );

    const generateText = new GenerateText(provider, repository, {
      provider: 'provider.devotional-proof',
      permissions: authorization,
    });

    return {
      repository,
      assistance: new SuggestKnowledgeResourceCandidate(
        new GenerateTextWithAuthorizedContext(authorizedContext, generateText),
      ),
    };
  }

  function buildAcceptance(repository: PrismaGenerationRepository) {
    const authorization = new PrismaAuthorizationRepository(database);

    const owner = new PlatformKnowledgeCanonicalAcceptance(
      new CreateKnowledgeResourceAsActor(
        new EvaluateIdentityPermission(authorization),
        new CreateKnowledgeResource(new PrismaKnowledgeResourceRepository(database)),
      ),
    );

    return new ReviewAndAcceptGenerationAsKnowledgeResource(repository, owner);
  }

  it('uses published Devotional Scripture as provenance and requires explicit Knowledge-owner acceptance', async () => {
    const actorId = await createAdministratorCreator();
    const publishedScriptureId = await createDevotionalScripture(
      KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    );
    const draftScriptureId = await createDevotionalScripture(KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE);

    const targetCountBefore = await database.knowledgeResource.count({
      where: {
        universeKey: DEVOTIONAL_UNIVERSE_KEY,
        resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      },
    });

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(request.instructions).toContain(
          'Create structured candidate data for a Knowledge Resource.',
        );
        expect(request.instructions).toContain('Authorized AI context:');
        expect(request.instructions).toContain('User display name: Devotional Creator');
        expect(request.instructions).toContain(`Universe: ${DEVOTIONAL_UNIVERSE_KEY}`);
        expect(request.instructions).toContain(
          `- ${DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE} | ${publishedScriptureId}`,
        );
        expect(request.instructions).not.toContain(draftScriptureId);

        return {
          text: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
          model: 'model.devotional-proof',
          usage: {
            inputTokens: 24,
            outputTokens: 3,
            totalTokens: 27,
          },
        };
      },
    };

    const { repository, assistance } = buildAssistance(provider);

    const result = await assistance.execute({
      actorId: parseResourceId(actorId),
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      request:
        'Create a structured Devotional temple Resource candidate grounded in published Scripture.',
      contextQuery: 'scripture',
      contextResourceTypes: [DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE],
      contextLimit: 10,
    });

    expect(result.candidate).toEqual({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
    });

    expect(result.generation).toMatchObject({
      actorId,
      provider: 'provider.devotional-proof',
      model: 'model.devotional-proof',
      status: 'SUCCEEDED',
      result: {
        text: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      },
      provenance: {
        task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
        sourceContext: {
          universeKey: DEVOTIONAL_UNIVERSE_KEY,
        },
      },
      usage: {
        inputTokens: 24,
        outputTokens: 3,
        totalTokens: 27,
        failureKind: null,
      },
    });

    const sourceResources = result.generation.provenance?.sourceContext?.knowledgeResources ?? [];

    expect(sourceResources).toContainEqual({
      id: publishedScriptureId,
      resourceType: DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
    });
    expect(sourceResources.map((resource) => resource.id)).not.toContain(draftScriptureId);

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: DEVOTIONAL_UNIVERSE_KEY,
          resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
        },
      }),
    ).resolves.toBe(targetCountBefore);

    const accepted = await buildAcceptance(repository).execute({
      generationId: result.generation.id,
      reviewedByActorId: parseResourceId(actorId),
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
    });

    knowledgeResourceIds.add(accepted.canonicalResource.id);

    expect(accepted).toMatchObject({
      generationId: result.generation.id,
      reviewedByActorId: actorId,
      canonicalOwner: 'knowledge',
      canonicalResource: {
        universeKey: DEVOTIONAL_UNIVERSE_KEY,
        resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
        lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
      },
    });

    await expect(
      database.knowledgeResource.findUnique({
        where: {
          id: accepted.canonicalResource.id,
        },
      }),
    ).resolves.toMatchObject({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });
  });
});
