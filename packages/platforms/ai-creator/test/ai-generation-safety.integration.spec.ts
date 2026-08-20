import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId, parseResourceId } from '@ai-world/kernel-identifiers';
import { PrismaAuthorizationRepository } from '@ai-world/platform-identity-access/infrastructure';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AI_TEXT_MODEL_MAX_LENGTH, GenerateText, type AiProviderPort } from '../src';
import { PrismaGenerationRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for AI safety integration tests.');
  }

  return databaseUrl;
}

describe('AI generation safety baseline', () => {
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

  function createGenerateText(provider: AiProviderPort) {
    return new GenerateText(provider, new PrismaGenerationRepository(database), {
      provider: 'provider.test',
      permissions: new PrismaAuthorizationRepository(database),
    });
  }

  it('seeds ai.generate and permits an Administrator while keeping Provider requests tool-free', async () => {
    const permission = await database.permission.findUnique({
      where: {
        key: 'ai.generate',
      },
    });

    expect(permission?.description).toBe('Execute AI text generation.');

    const actorId = await createActor(true);

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(request).toEqual({
          input: 'Draft safe text.',
          instructions: 'Use one sentence.',
        });
        expect('tools' in request).toBe(false);

        return {
          text: 'Safe generated text.',
          model: 'model.actual',
        };
      },
    };

    const generation = await createGenerateText(provider).execute({
      actorId: parseResourceId(actorId),
      input: 'Draft safe text.',
      instructions: 'Use one sentence.',
    });

    expect(generation.status).toBe('SUCCEEDED');
    expect(generation.model).toBe('model.actual');
  });

  it('denies an Actor without ai.generate before persistence or Provider execution', async () => {
    const actorId = await createActor(false);
    let providerCalled = false;

    const provider: AiProviderPort = {
      async generateText() {
        providerCalled = true;
        return {
          text: 'Must not happen.',
          model: 'model.actual',
        };
      },
    };

    await expect(
      createGenerateText(provider).execute({
        actorId: parseResourceId(actorId),
        input: 'Draft text.',
      }),
    ).rejects.toMatchObject({
      code: 'PERMISSION_DENIED',
    });

    expect(providerCalled).toBe(false);

    await expect(
      database.generation.count({
        where: {
          actorId,
        },
      }),
    ).resolves.toBe(0);
  });

  it('blocks credential-like sensitive data before persistence or Provider transfer', async () => {
    const actorId = await createActor(true);
    let providerCalled = false;

    const provider: AiProviderPort = {
      async generateText() {
        providerCalled = true;
        return {
          text: 'Must not happen.',
          model: 'model.actual',
        };
      },
    };

    await expect(
      createGenerateText(provider).execute({
        actorId: parseResourceId(actorId),
        input: 'credential: password=super-secret-value-12345',
      }),
    ).rejects.toMatchObject({
      code: 'SENSITIVE_DATA',
    });

    expect(providerCalled).toBe(false);

    await expect(
      database.generation.count({
        where: {
          actorId,
        },
      }),
    ).resolves.toBe(0);
  });

  it('rejects a Provider model that cannot fit Generation.model and records FAILED', async () => {
    const actorId = await createActor(true);

    const provider: AiProviderPort = {
      async generateText() {
        return {
          text: 'Generated text.',
          model: 'm'.repeat(AI_TEXT_MODEL_MAX_LENGTH + 1),
        };
      },
    };

    await expect(
      createGenerateText(provider).execute({
        actorId: parseResourceId(actorId),
        input: 'Draft text.',
        task: 'ai.safety-model-bound-proof',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_OUTPUT',
    });

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
      status: 'FAILED',
      model: null,
      result: null,
      provenance: {
        task: 'ai.safety-model-bound-proof',
      },
    });
  });

  it('fails the Generation when Provider output violates the runtime output schema', async () => {
    const actorId = await createActor(true);

    const provider: AiProviderPort = {
      async generateText() {
        return {
          text: '   ',
          model: 'model.actual',
        };
      },
    };

    await expect(
      createGenerateText(provider).execute({
        actorId: parseResourceId(actorId),
        input: 'Draft text.',
        task: 'ai.safety-output-proof',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_OUTPUT',
    });

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
      status: 'FAILED',
      model: null,
      result: null,
      provenance: {
        task: 'ai.safety-output-proof',
      },
    });
  });
});
