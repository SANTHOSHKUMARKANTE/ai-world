import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import {
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import { EvaluatePermission as EvaluateIdentityPermission } from '@ai-world/platform-identity-access';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  GenerateText,
  ReviewAndAcceptGenerationAsKnowledgeResource,
  type AiProviderPort,
} from '../src';
import {
  PlatformKnowledgeCanonicalAcceptance,
  PrismaGenerationRepository,
} from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for canonical acceptance integration tests.');
  }

  return databaseUrl;
}

describe('P7-M08 canonical acceptance flow', () => {
  let database: DatabaseClient;
  const actorIds = new Set<string>();
  const knowledgeResourceIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (knowledgeResourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...knowledgeResourceIds],
          },
        },
      });
    }

    if (actorIds.size > 0) {
      await database.generation.deleteMany({
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

    knowledgeResourceIds.clear();
    actorIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  async function createActor(grantAdministrator: boolean): Promise<string> {
    const actorId = generateResourceId();

    await database.actor.create({
      data: {
        id: actorId,
      },
    });

    if (grantAdministrator) {
      const administrator = await database.role.findUnique({
        where: {
          key: 'administrator',
        },
      });

      if (!administrator) {
        throw new Error('Administrator role seed is required.');
      }

      await database.actorRole.create({
        data: {
          actorId,
          roleId: administrator.id,
        },
      });
    }

    actorIds.add(actorId);
    return actorId;
  }

  function generationRepository() {
    return new PrismaGenerationRepository(database);
  }

  function generateText(provider: AiProviderPort, repository: PrismaGenerationRepository) {
    return new GenerateText(provider, repository, {
      provider: 'provider.test',
      permissions: new PrismaAuthorizationRepository(database),
    });
  }

  function acceptance(repository: PrismaGenerationRepository) {
    const authorization = new PrismaAuthorizationRepository(database);
    const knowledgeRepository = new PrismaKnowledgeResourceRepository(database);

    const owner = new PlatformKnowledgeCanonicalAcceptance(
      new CreateKnowledgeResourceAsActor(
        new EvaluateIdentityPermission(authorization),
        new CreateKnowledgeResource(knowledgeRepository),
      ),
    );

    return new ReviewAndAcceptGenerationAsKnowledgeResource(repository, owner);
  }

  it('keeps the AI result non-canonical until Creator review invokes the Knowledge owner', async () => {
    const actorId = await createActor(true);
    const repository = generationRepository();

    const generation = await generateText(
      {
        async generateText() {
          return {
            text: 'acceptance.resource',
            model: 'model.actual',
          };
        },
      },
      repository,
    ).execute({
      actorId: parseResourceId(actorId),
      input: 'Suggest one Knowledge Resource type.',
      task: 'ai.canonical-acceptance-proof',
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: 'acceptance.test',
        },
      }),
    ).resolves.toBe(0);

    const accepted = await acceptance(repository).execute({
      generationId: generation.id,
      reviewedByActorId: parseResourceId(actorId),
      universeKey: 'acceptance.test',
    });

    knowledgeResourceIds.add(accepted.canonicalResource.id);

    expect(accepted).toMatchObject({
      generationId: generation.id,
      reviewedByActorId: actorId,
      canonicalOwner: 'knowledge',
      canonicalResource: {
        universeKey: 'acceptance.test',
        resourceType: 'acceptance.resource',
        lifecycle: 'DRAFT',
      },
    });

    await expect(
      database.knowledgeResource.findUnique({
        where: {
          id: accepted.canonicalResource.id,
        },
      }),
    ).resolves.toMatchObject({
      universeKey: 'acceptance.test',
      resourceType: 'acceptance.resource',
      lifecycle: 'DRAFT',
    });
  });

  it('delegates authorization to the canonical Knowledge owner', async () => {
    const generatingActorId = await createActor(true);
    const reviewingActorId = await createActor(false);
    const repository = generationRepository();

    const generation = await generateText(
      {
        async generateText() {
          return {
            text: 'acceptance.resource',
            model: 'model.actual',
          };
        },
      },
      repository,
    ).execute({
      actorId: parseResourceId(generatingActorId),
      input: 'Suggest one Knowledge Resource type.',
      task: 'ai.canonical-acceptance-authorization-proof',
    });

    await expect(
      acceptance(repository).execute({
        generationId: generation.id,
        reviewedByActorId: parseResourceId(reviewingActorId),
        universeKey: 'acceptance.unauthorized',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: 'acceptance.unauthorized',
        },
      }),
    ).resolves.toBe(0);
  });

  it('delegates canonical candidate validation to the Knowledge owner', async () => {
    const actorId = await createActor(true);
    const repository = generationRepository();

    const generation = await generateText(
      {
        async generateText() {
          return {
            text: 'not a namespaced key',
            model: 'model.actual',
          };
        },
      },
      repository,
    ).execute({
      actorId: parseResourceId(actorId),
      input: 'Suggest one Knowledge Resource type.',
      task: 'ai.canonical-acceptance-validation-proof',
    });

    await expect(
      acceptance(repository).execute({
        generationId: generation.id,
        reviewedByActorId: parseResourceId(actorId),
        universeKey: 'acceptance.invalid',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.invalid_input',
    });

    await expect(
      database.knowledgeResource.count({
        where: {
          universeKey: 'acceptance.invalid',
        },
      }),
    ).resolves.toBe(0);
  });
});
