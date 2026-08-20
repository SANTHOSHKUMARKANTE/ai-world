import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import { EvaluatePermission as EvaluateIdentityPermission } from '@ai-world/platform-identity-access';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import {
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
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

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for AI Creator assistance integration tests.');
  }

  return databaseUrl;
}

describe('P7-M09 AI Creator Assistance vertical slice', () => {
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

  async function createAdministratorCreator(displayName: string): Promise<string> {
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
            displayName,
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

  async function createPublishedContextResource(
    universeKey: string,
    resourceType: string,
  ): Promise<string> {
    const id = generateResourceId();

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey,
        resourceType,
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
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
      provider: 'provider.test',
      permissions: authorization,
    });

    const generateWithContext = new GenerateTextWithAuthorizedContext(
      authorizedContext,
      generateText,
    );

    return {
      repository,
      assistance: new SuggestKnowledgeResourceCandidate(generateWithContext),
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

  it('suggests typed candidate data from authorized context and keeps it non-canonical until explicit acceptance', async () => {
    const actorId = await createAdministratorCreator('Creator');
    const universeKey = parseNamespacedKey('assistance.test');
    const contextResourceType = parseNamespacedKey('assistance.context');

    const contextResourceId = await createPublishedContextResource(
      universeKey,
      contextResourceType,
    );

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(request.instructions).toContain(
          'Return exactly one Knowledge Resource type as a namespaced key.',
        );
        expect(request.instructions).toContain('Authorized AI context:');
        expect(request.instructions).toContain('User display name: Creator');
        expect(request.instructions).toContain(`Universe: ${universeKey}`);
        expect(request.instructions).toContain(`- ${contextResourceType} | ${contextResourceId}`);

        return {
          text: 'assistance.suggested-type',
          model: 'model.actual',
        };
      },
    };

    const { repository, assistance } = buildAssistance(provider);

    const result = await assistance.execute({
      actorId: parseResourceId(actorId),
      universeKey,
      request: 'Suggest a canonical Resource type for this creator draft.',
      contextQuery: 'context',
      contextResourceTypes: [contextResourceType],
      contextLimit: 5,
    });

    expect(result.candidate).toEqual({
      universeKey,
      resourceType: parseNamespacedKey('assistance.suggested-type'),
    });
    expect(result.generation.status).toBe('SUCCEEDED');

    const persisted = await database.generation.findUnique({
      where: {
        id: result.generation.id,
      },
      include: {
        request: true,
        result: true,
        provenance: true,
      },
    });

    expect(persisted).toMatchObject({
      status: 'SUCCEEDED',
      model: 'model.actual',
      result: {
        text: 'assistance.suggested-type',
      },
      provenance: {
        task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
      },
    });

    expect(persisted?.request?.instructions).toContain(
      `- ${contextResourceType} | ${contextResourceId}`,
    );

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey,
          resourceType: 'assistance.suggested-type',
        },
      }),
    ).resolves.toBe(0);

    const accepted = await buildAcceptance(repository).execute({
      generationId: result.generation.id,
      reviewedByActorId: parseResourceId(actorId),
      universeKey,
    });

    knowledgeResourceIds.add(accepted.canonicalResource.id);

    expect(accepted).toMatchObject({
      generationId: result.generation.id,
      reviewedByActorId: actorId,
      canonicalOwner: 'knowledge',
      canonicalResource: {
        universeKey,
        resourceType: 'assistance.suggested-type',
        lifecycle: 'DRAFT',
      },
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey,
          resourceType: 'assistance.suggested-type',
        },
      }),
    ).resolves.toBe(1);
  });

  it('rejects malformed assistance output as a candidate without canonical mutation', async () => {
    const actorId = await createAdministratorCreator('Creator');
    const universeKey = parseNamespacedKey('assistance.invalid');
    const contextResourceType = parseNamespacedKey('assistance.context');

    await createPublishedContextResource(universeKey, contextResourceType);

    const { assistance } = buildAssistance({
      async generateText() {
        return {
          text: 'Suggested: assistance.invalid-type',
          model: 'model.actual',
        };
      },
    });

    await expect(
      assistance.execute({
        actorId: parseResourceId(actorId),
        universeKey,
        request: 'Suggest one canonical Resource type.',
        contextQuery: 'context',
      }),
    ).rejects.toMatchObject({
      name: 'AiCreatorAssistanceError',
      code: 'INVALID_CANDIDATE',
    });

    const persisted = await database.generation.findFirst({
      where: {
        actorId,
      },
      include: {
        result: true,
        provenance: true,
      },
    });

    expect(persisted).toMatchObject({
      status: 'SUCCEEDED',
      result: {
        text: 'Suggested: assistance.invalid-type',
      },
      provenance: {
        task: AI_CREATOR_KNOWLEDGE_RESOURCE_CANDIDATE_TASK,
      },
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey,
          resourceType: 'assistance.invalid-type',
        },
      }),
    ).resolves.toBe(0);
  });
});
