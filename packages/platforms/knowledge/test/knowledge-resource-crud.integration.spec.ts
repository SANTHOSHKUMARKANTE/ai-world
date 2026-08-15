import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { CreateKnowledgeResource, GetKnowledgeResource, UpdateKnowledgeResource } from '../src';
import { PrismaKnowledgeResourceRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Knowledge CRUD integration tests.');
  }

  return databaseUrl;
}

describe('Knowledge Resource CRUD persistence', () => {
  let database: DatabaseClient;
  let repository: PrismaKnowledgeResourceRepository;
  let createKnowledgeResource: CreateKnowledgeResource;
  let getKnowledgeResource: GetKnowledgeResource;
  let updateKnowledgeResource: UpdateKnowledgeResource;

  const resourceIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });

    repository = new PrismaKnowledgeResourceRepository(database);
    createKnowledgeResource = new CreateKnowledgeResource(repository);
    getKnowledgeResource = new GetKnowledgeResource(repository);
    updateKnowledgeResource = new UpdateKnowledgeResource(repository);
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

  it('creates and reads a canonical Knowledge Resource through owner operations', async () => {
    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.test-universe'),
      resourceType: parseNamespacedKey('knowledge.test-resource'),
    });

    resourceIds.add(created.id);

    expect(created.universeKey).toBe('knowledge.test-universe');
    expect(created.resourceType).toBe('knowledge.test-resource');
    expect(created.lifecycle).toBe('DRAFT');
    expect(created.createdAt).toBeInstanceOf(Date);
    expect(created.updatedAt).toBeInstanceOf(Date);

    const read = await getKnowledgeResource.execute({
      id: created.id,
    });

    expect(read).toEqual(created);

    const persisted = await database.knowledgeResource.findUniqueOrThrow({
      where: {
        id: created.id,
      },
    });

    expect(persisted.id).toBe(created.id);
    expect(persisted.universeKey).toBe(created.universeKey);
    expect(persisted.resourceType).toBe(created.resourceType);
    expect(persisted.lifecycle).toBe('DRAFT');
  });

  it('updates Resource Type without changing identity, Universe association, lifecycle, or creation time', async () => {
    const created = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.test-universe'),
      resourceType: parseNamespacedKey('knowledge.test-resource'),
    });

    resourceIds.add(created.id);

    const updated = await updateKnowledgeResource.execute({
      id: created.id,
      resourceType: parseNamespacedKey('knowledge.test-resource-updated'),
    });

    expect(updated.id).toBe(created.id);
    expect(updated.universeKey).toBe(created.universeKey);
    expect(updated.resourceType).toBe('knowledge.test-resource-updated');
    expect(updated.lifecycle).toBe(created.lifecycle);
    expect(updated.createdAt).toEqual(created.createdAt);
    expect(updated.updatedAt.getTime()).toBeGreaterThanOrEqual(created.updatedAt.getTime());

    const persisted = await getKnowledgeResource.execute({
      id: created.id,
    });

    expect(persisted.resourceType).toBe('knowledge.test-resource-updated');
    expect(persisted.universeKey).toBe('knowledge.test-universe');
    expect(persisted.lifecycle).toBe('DRAFT');
  });

  it('returns canonical not-found semantics for missing reads and updates', async () => {
    const missingId = generateResourceId();

    await expect(
      getKnowledgeResource.execute({
        id: missingId,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });

    await expect(
      updateKnowledgeResource.execute({
        id: missingId,
        resourceType: parseNamespacedKey('knowledge.test-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });
  });
});
