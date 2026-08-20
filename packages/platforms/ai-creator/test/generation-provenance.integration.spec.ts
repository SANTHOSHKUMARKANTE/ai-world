import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { GenerateText, type AiProviderPort, type GenerationSourceContext } from '../src';
import { PrismaGenerationRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Generation provenance integration tests.');
  }

  return databaseUrl;
}

describe('Generation provenance', () => {
  let database: DatabaseClient;

  const actorIds = new Set<string>();

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

      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    actorIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  async function createActor(): Promise<string> {
    const actorId = generateResourceId();

    await database.actor.create({
      data: {
        id: actorId,
      },
    });

    actorIds.add(actorId);

    return actorId;
  }

  it('persists requester/task/source context before Provider execution and retains actual Provider/model/time', async () => {
    const actorId = await createActor();
    const universeKey = parseNamespacedKey('context.test-alpha');
    const resourceType = parseNamespacedKey('context.temple');
    const resourceId = generateResourceId();

    const sourceContext: GenerationSourceContext = {
      universeKey,
      knowledgeResources: [
        {
          id: resourceId,
          resourceType,
          universeKey,
        },
      ],
    };

    const provider: AiProviderPort = {
      async generateText() {
        const requested = await database.generation.findFirst({
          where: {
            actorId,
          },
          include: {
            provenance: true,
          },
        });

        expect(requested).not.toBeNull();
        expect(requested?.status).toBe('REQUESTED');
        expect(requested?.provider).toBe('provider.test');
        expect(requested?.model).toBeNull();
        expect(requested?.provenance).toMatchObject({
          task: 'ai.creator-description',
          sourceContext: {
            universeKey,
            knowledgeResources: [
              {
                id: resourceId,
                resourceType,
                universeKey,
              },
            ],
          },
        });

        return {
          text: 'Provenance-aware creator draft.',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, new PrismaGenerationRepository(database), {
      provider: 'provider.test',
    });

    const generation = await generateText.execute({
      actorId: parseResourceId(actorId),
      input: 'Draft a description.',
      task: 'ai.creator-description',
      sourceContext,
    });

    expect(generation).toMatchObject({
      actorId,
      provider: 'provider.test',
      model: 'model.actual',
      status: 'SUCCEEDED',
      provenance: {
        task: 'ai.creator-description',
        sourceContext,
      },
    });

    expect(generation.createdAt).toBeInstanceOf(Date);
    expect(generation.provenance?.createdAt).toBeInstanceOf(Date);

    const persisted = await database.generation.findUnique({
      where: {
        id: generation.id,
      },
      include: {
        provenance: true,
      },
    });

    expect(persisted).toMatchObject({
      actorId,
      provider: 'provider.test',
      model: 'model.actual',
      status: 'SUCCEEDED',
      provenance: {
        task: 'ai.creator-description',
        sourceContext: {
          universeKey,
          knowledgeResources: [
            {
              id: resourceId,
              resourceType,
              universeKey,
            },
          ],
        },
      },
    });
  });

  it('retains provenance when Provider execution fails', async () => {
    const actorId = await createActor();
    const providerFailure = new Error('provider unavailable');

    const provider: AiProviderPort = {
      async generateText() {
        throw providerFailure;
      },
    };

    const generateText = new GenerateText(provider, new PrismaGenerationRepository(database), {
      provider: 'provider.test',
    });

    await expect(
      generateText.execute({
        actorId: parseResourceId(actorId),
        input: 'Draft text.',
        task: 'ai.creator-description',
      }),
    ).rejects.toBe(providerFailure);

    const persisted = await database.generation.findFirst({
      where: {
        actorId,
      },
      include: {
        provenance: true,
        result: true,
      },
    });

    expect(persisted).toMatchObject({
      actorId,
      provider: 'provider.test',
      model: null,
      status: 'FAILED',
      result: null,
      provenance: {
        task: 'ai.creator-description',
        sourceContext: null,
      },
    });
  });
});
