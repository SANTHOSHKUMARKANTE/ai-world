import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
} from '../src';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Generation persistence integration tests.');
  }

  return databaseUrl;
}

describe('Generation persistence', () => {
  let database: DatabaseClient;

  const generationIds = new Set<string>();
  const actorIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (generationIds.size > 0) {
      await database.generation.deleteMany({
        where: {
          id: {
            in: [...generationIds],
          },
        },
      });
    }

    if (actorIds.size > 0) {
      await database.actor.deleteMany({
        where: {
          id: {
            in: [...actorIds],
          },
        },
      });
    }

    generationIds.clear();
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

  it('persists a requested Generation with Actor ownership and immutable request state', async () => {
    const actorId = await createActor();
    const generationId = generateResourceId();

    const generation = await database.generation.create({
      data: {
        id: generationId,
        actorId,
        status: GENERATION_INITIAL_STATUS,
        provider: 'provider.test',
        request: {
          create: {
            input: 'Describe AI World.',
            instructions: 'Write one concise sentence.',
          },
        },
      },
      include: {
        actor: true,
        request: true,
        result: true,
      },
    });

    generationIds.add(generationId);

    expect(generation.id).toBe(generationId);
    expect(generation.actorId).toBe(actorId);
    expect(generation.actor.id).toBe(actorId);
    expect(generation.status).toBe('REQUESTED');
    expect(generation.provider).toBe('provider.test');
    expect(generation.model).toBeNull();
    expect(generation.request).toMatchObject({
      generationId,
      input: 'Describe AI World.',
      instructions: 'Write one concise sentence.',
    });
    expect(generation.request?.createdAt).toBeInstanceOf(Date);
    expect(generation.result).toBeNull();
    expect(generation.createdAt).toBeInstanceOf(Date);
    expect(generation.updatedAt).toBeInstanceOf(Date);
  });

  it('persists the actual model and result when a Generation succeeds', async () => {
    const actorId = await createActor();
    const generationId = generateResourceId();

    await database.generation.create({
      data: {
        id: generationId,
        actorId,
        status: GENERATION_INITIAL_STATUS,
        provider: 'provider.test',
        request: {
          create: {
            input: 'Generate text.',
          },
        },
      },
    });

    generationIds.add(generationId);

    const generation = await database.generation.update({
      where: {
        id: generationId,
      },
      data: {
        status: GENERATION_SUCCEEDED_STATUS,
        model: 'model.test',
        result: {
          create: {
            text: 'Generated text.',
          },
        },
      },
      include: {
        request: true,
        result: true,
      },
    });

    expect(generation.status).toBe('SUCCEEDED');
    expect(generation.provider).toBe('provider.test');
    expect(generation.model).toBe('model.test');
    expect(generation.request?.input).toBe('Generate text.');
    expect(generation.result).toMatchObject({
      generationId,
      text: 'Generated text.',
    });
    expect(generation.result?.createdAt).toBeInstanceOf(Date);
  });

  it('represents a failed Generation without manufacturing a result or model', async () => {
    const actorId = await createActor();
    const generationId = generateResourceId();

    await database.generation.create({
      data: {
        id: generationId,
        actorId,
        status: GENERATION_INITIAL_STATUS,
        provider: 'provider.test',
        request: {
          create: {
            input: 'Generate text.',
          },
        },
      },
    });

    generationIds.add(generationId);

    const generation = await database.generation.update({
      where: {
        id: generationId,
      },
      data: {
        status: GENERATION_FAILED_STATUS,
      },
      include: {
        result: true,
      },
    });

    expect(generation.status).toBe('FAILED');
    expect(generation.provider).toBe('provider.test');
    expect(generation.model).toBeNull();
    expect(generation.result).toBeNull();
  });
});
