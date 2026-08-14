import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE } from '../src';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Knowledge persistence integration tests.');
  }

  return databaseUrl;
}

describe('Knowledge Resource persistence', () => {
  let database: DatabaseClient;

  const resourceIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...resourceIds],
          },
        },
      });
    }

    resourceIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('persists a canonical Knowledge Resource using Kernel semantics', async () => {
    const id = generateResourceId();
    const universeKey = parseNamespacedKey('knowledge.test-universe');
    const resourceType = parseNamespacedKey('knowledge.test-resource');

    const resource = await database.knowledgeResource.create({
      data: {
        id,
        universeKey,
        resourceType,
        lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
      },
    });

    resourceIds.add(resource.id);

    expect(resource.id).toBe(id);
    expect(resource.universeKey).toBe(universeKey);
    expect(resource.resourceType).toBe(resourceType);
    expect(resource.lifecycle).toBe('DRAFT');
    expect(resource.createdAt).toBeInstanceOf(Date);
    expect(resource.updatedAt).toBeInstanceOf(Date);

    const persistedResource = await database.knowledgeResource.findUniqueOrThrow({
      where: {
        id,
      },
    });

    expect(persistedResource.id).toBe(id);
    expect(persistedResource.universeKey).toBe(universeKey);
    expect(persistedResource.resourceType).toBe(resourceType);
    expect(persistedResource.lifecycle).toBe('DRAFT');
  });

  it('rejects duplicate canonical Resource identifiers', async () => {
    const id = generateResourceId();
    const universeKey = parseNamespacedKey('knowledge.test-universe');
    const resourceType = parseNamespacedKey('knowledge.test-resource');

    await database.knowledgeResource.create({
      data: {
        id,
        universeKey,
        resourceType,
        lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
      },
    });

    resourceIds.add(id);

    await expect(
      database.knowledgeResource.create({
        data: {
          id,
          universeKey,
          resourceType,
          lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });
});
