import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  GenerateText,
  type AiProviderPort,
} from '../src';
import { PrismaGenerationRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for text-generation integration tests.');
  }

  return databaseUrl;
}

describe('Text generation vertical slice', () => {
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

  it('persists REQUESTED before Provider execution and completes SUCCEEDED with actual output', async () => {
    const actorId = await createActor();
    const repository = new PrismaGenerationRepository(database);

    const provider: AiProviderPort = {
      async generateText(request) {
        const requested = await database.generation.findFirst({
          where: {
            actorId,
            provider: 'provider.test',
          },
          include: {
            request: true,
            result: true,
          },
        });

        expect(requested).not.toBeNull();
        expect(requested?.status).toBe(GENERATION_INITIAL_STATUS);
        expect(requested?.model).toBeNull();
        expect(requested?.result).toBeNull();
        expect(requested?.request).toMatchObject({
          input: 'Draft a creator description.',
          instructions: 'Use one concise sentence.',
        });
        expect(request).toEqual({
          input: 'Draft a creator description.',
          instructions: 'Use one concise sentence.',
        });

        return {
          text: 'AI World helps creators draft reusable multi-universe content.',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, repository, {
      provider: 'provider.test',
    });

    const generation = await generateText.execute({
      actorId: parseResourceId(actorId),
      input: 'Draft a creator description.',
      instructions: 'Use one concise sentence.',
    });

    expect(generation.status).toBe(GENERATION_SUCCEEDED_STATUS);
    expect(generation.provider).toBe('provider.test');
    expect(generation.model).toBe('model.actual');
    expect(generation.result?.text).toBe(
      'AI World helps creators draft reusable multi-universe content.',
    );

    const persisted = await database.generation.findUnique({
      where: {
        id: generation.id,
      },
      include: {
        request: true,
        result: true,
      },
    });

    expect(persisted).toMatchObject({
      actorId,
      status: 'SUCCEEDED',
      provider: 'provider.test',
      model: 'model.actual',
      request: {
        input: 'Draft a creator description.',
        instructions: 'Use one concise sentence.',
      },
      result: {
        text: 'AI World helps creators draft reusable multi-universe content.',
      },
    });
  });

  it('persists FAILED without model/result when the Provider rejects', async () => {
    const actorId = await createActor();
    const repository = new PrismaGenerationRepository(database);
    const providerFailure = new Error('provider unavailable');

    const provider: AiProviderPort = {
      async generateText() {
        throw providerFailure;
      },
    };

    const generateText = new GenerateText(provider, repository, {
      provider: 'provider.test',
    });

    await expect(
      generateText.execute({
        actorId: parseResourceId(actorId),
        input: 'Draft a creator description.',
      }),
    ).rejects.toBe(providerFailure);

    const persisted = await database.generation.findFirst({
      where: {
        actorId,
        provider: 'provider.test',
      },
      include: {
        request: true,
        result: true,
      },
    });

    expect(persisted).toMatchObject({
      actorId,
      status: GENERATION_FAILED_STATUS,
      provider: 'provider.test',
      model: null,
      request: {
        input: 'Draft a creator description.',
      },
      result: null,
    });
  });
});
