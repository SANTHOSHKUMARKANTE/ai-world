import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_PROVIDER_ERROR_FAILURE_KIND,
  GENERATION_SUCCEEDED_STATUS,
  GenerateText,
} from '../src';
import { PrismaGenerationRepository } from '../src/prisma-generation-repository';
import { allowAiGenerationPermission } from './support/allow-ai-generation-permission';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for AI usage tracking integration tests.');
  }

  return databaseUrl;
}

function deterministicClock(values: readonly number[]): () => number {
  let index = 0;

  return () => {
    const value = values[index];

    if (value === undefined) {
      throw new Error('Deterministic P7-M11 clock was exhausted.');
    }

    index += 1;
    return value;
  };
}

describe('P7-M11 AI Usage Tracking vertical slice', () => {
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

  async function createActor(): Promise<ResourceId> {
    const actorId = generateResourceId();

    await database.actor.create({
      data: {
        id: actorId,
      },
    });

    actorIds.add(actorId);
    return actorId;
  }

  it('persists Provider usage and latency with provider/model inputs sufficient for later cost estimation', async () => {
    const actorId = await createActor();
    const repository = new PrismaGenerationRepository(database);

    const generation = await new GenerateText(
      {
        async generateText() {
          return {
            text: 'Tracked output.',
            model: 'model.cost-input',
            usage: {
              inputTokens: 120,
              outputTokens: 30,
              totalTokens: 150,
            },
          };
        },
      },
      repository,
      {
        provider: 'provider.cost-input',
        permissions: allowAiGenerationPermission,
        nowMilliseconds: deterministicClock([1_000, 1_247]),
      },
    ).execute({
      actorId,
      input: 'Track this generation.',
    });

    expect(generation.status).toBe(GENERATION_SUCCEEDED_STATUS);
    expect(generation.provider).toBe('provider.cost-input');
    expect(generation.model).toBe('model.cost-input');
    expect(generation.usage).toMatchObject({
      providerLatencyMs: 247,
      inputTokens: 120,
      outputTokens: 30,
      totalTokens: 150,
      failureKind: null,
    });

    const persistedUsage = await database.generationUsage.findUnique({
      where: {
        generationId: generation.id,
      },
    });

    expect(persistedUsage).toMatchObject({
      generationId: generation.id,
      providerLatencyMs: 247,
      inputTokens: 120,
      outputTokens: 30,
      totalTokens: 150,
      failureKind: null,
    });

    expect(persistedUsage?.createdAt).toBeInstanceOf(Date);
  });

  it('persists bounded failure classification and Provider latency without storing raw Provider errors', async () => {
    const actorId = await createActor();
    const repository = new PrismaGenerationRepository(database);
    const providerFailure = new Error(
      'provider internal secret-bearing diagnostic must not be persisted',
    );

    await expect(
      new GenerateText(
        {
          async generateText() {
            throw providerFailure;
          },
        },
        repository,
        {
          provider: 'provider.failure',
          permissions: allowAiGenerationPermission,
          nowMilliseconds: deterministicClock([2_000, 2_088]),
        },
      ).execute({
        actorId,
        input: 'Generate failure proof.',
      }),
    ).rejects.toBe(providerFailure);

    const generation = await database.generation.findFirst({
      where: {
        actorId,
      },
      include: {
        usage: true,
        result: true,
      },
    });

    expect(generation).toMatchObject({
      status: GENERATION_FAILED_STATUS,
      provider: 'provider.failure',
      model: null,
      result: null,
      usage: {
        providerLatencyMs: 88,
        inputTokens: null,
        outputTokens: null,
        totalTokens: null,
        failureKind: GENERATION_PROVIDER_ERROR_FAILURE_KIND,
      },
    });

    const serializedUsage = JSON.stringify(generation?.usage);
    expect(serializedUsage).not.toContain(providerFailure.message);
  });
});
