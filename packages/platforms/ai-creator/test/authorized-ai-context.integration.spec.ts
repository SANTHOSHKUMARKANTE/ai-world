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

import { GenerateText, GenerateTextWithAuthorizedContext, type AiProviderPort } from '../src';
import { PlatformAuthorizedAiContext, PrismaGenerationRepository } from '../src/infrastructure';
import { allowAiGenerationPermission } from './support/allow-ai-generation-permission';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for authorized AI context integration tests.');
  }

  return databaseUrl;
}

describe('Authorized AI context vertical slice', () => {
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

  async function createActorWithUser(displayName: string): Promise<string> {
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

  it('flows self-User, Universe-scoped Discovery, and published Knowledge into generation without AI table bypass', async () => {
    const actorId = await createActorWithUser('Creator');
    const universeKey = parseNamespacedKey('context.test-alpha');
    const otherUniverseKey = parseNamespacedKey('context.test-beta');
    const resourceType = parseNamespacedKey('context.temple');

    const publishedResourceId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const draftResourceId = await createKnowledgeResource({
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });

    const otherUniverseResourceId = await createKnowledgeResource({
      universeKey: otherUniverseKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    });

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(request.instructions).toContain('Authorized AI context:');
        expect(request.instructions).toContain('User display name: Creator');
        expect(request.instructions).toContain(`Universe: ${universeKey}`);
        expect(request.instructions).toContain(`- ${resourceType} | ${publishedResourceId}`);
        expect(request.instructions).not.toContain(draftResourceId);
        expect(request.instructions).not.toContain(otherUniverseResourceId);

        return {
          text: 'Context-aware creator draft.',
          model: 'model.actual',
        };
      },
    };

    const authorizedContext = new PlatformAuthorizedAiContext(
      new PrismaUserProfileRepository(database),
      new PrismaKnowledgeSearch(database),
      new PrismaKnowledgeResourceRepository(database),
    );

    const generateText = new GenerateText(provider, new PrismaGenerationRepository(database), {
      provider: 'provider.test',
      permissions: allowAiGenerationPermission,
    });

    const useCase = new GenerateTextWithAuthorizedContext(authorizedContext, generateText);

    const generation = await useCase.execute({
      actorId: parseResourceId(actorId),
      universeKey,
      input: 'Draft a description using authorized context.',
      instructions: 'Use one concise sentence.',
      contextQuery: 'temple',
      contextLimit: 5,
    });

    expect(generation.status).toBe('SUCCEEDED');
    expect(generation.model).toBe('model.actual');
    expect(generation.result?.text).toBe('Context-aware creator draft.');

    const persisted = await database.generation.findUnique({
      where: {
        id: generation.id,
      },
      include: {
        request: true,
        result: true,
      },
    });

    expect(persisted?.request?.instructions).toContain('Authorized AI context:');
    expect(persisted?.request?.instructions).toContain(
      `- ${resourceType} | ${publishedResourceId}`,
    );
    expect(persisted?.request?.instructions).not.toContain(draftResourceId);
    expect(persisted?.request?.instructions).not.toContain(otherUniverseResourceId);
    expect(persisted?.status).toBe('SUCCEEDED');
  });
});
