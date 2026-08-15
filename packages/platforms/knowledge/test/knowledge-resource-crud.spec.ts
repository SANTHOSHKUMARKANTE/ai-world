import { generateResourceId, isResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  CreateKnowledgeResource,
  GetKnowledgeResource,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  UpdateKnowledgeResource,
  type CreateKnowledgeResourceRecordInput,
  type FindKnowledgeResourceByIdInput,
  type KnowledgeResource,
  type KnowledgeResourceReader,
  type KnowledgeResourceWriter,
  type UpdateKnowledgeResourceTypeRecordInput,
} from '../src';

const createdAt = new Date('2026-08-15T10:00:00.000Z');
const updatedAt = new Date('2026-08-15T10:00:00.000Z');

function makeResource(overrides: Partial<KnowledgeResource> = {}): KnowledgeResource {
  return {
    id: generateResourceId(),
    universeKey: parseNamespacedKey('knowledge.test-universe'),
    resourceType: parseNamespacedKey('knowledge.test-resource'),
    lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    createdAt,
    updatedAt,
    ...overrides,
  };
}

describe('Knowledge Resource CRUD', () => {
  it('creates a canonical DRAFT Resource with a generated ResourceId', async () => {
    let captured: CreateKnowledgeResourceRecordInput | undefined;

    const writer: KnowledgeResourceWriter = {
      async create(input) {
        captured = input;

        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },
      async updateResourceType() {
        return null;
      },
    };

    const createKnowledgeResource = new CreateKnowledgeResource(writer);

    const resource = await createKnowledgeResource.execute({
      universeKey: parseNamespacedKey('knowledge.test-universe'),
      resourceType: parseNamespacedKey('knowledge.test-resource'),
    });

    expect(captured).toBeDefined();
    expect(isResourceId(resource.id)).toBe(true);
    expect(resource.universeKey).toBe('knowledge.test-universe');
    expect(resource.resourceType).toBe('knowledge.test-resource');
    expect(resource.lifecycle).toBe('DRAFT');
  });

  it('rejects an invalid Universe key before persistence', async () => {
    let createCalled = false;

    const writer: KnowledgeResourceWriter = {
      async create(input) {
        createCalled = true;

        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },
      async updateResourceType() {
        return null;
      },
    };

    const createKnowledgeResource = new CreateKnowledgeResource(writer);

    await expect(
      createKnowledgeResource.execute({
        universeKey: 'Devotional' as string,
        resourceType: parseNamespacedKey('knowledge.test-resource'),
      }),
    ).rejects.toBeInstanceOf(TypeError);

    expect(createCalled).toBe(false);
  });

  it('reads an existing Resource by canonical ResourceId', async () => {
    const expected = makeResource();

    const reader: KnowledgeResourceReader = {
      async findById(input: FindKnowledgeResourceByIdInput) {
        return input.id === expected.id ? expected : null;
      },
    };

    const getKnowledgeResource = new GetKnowledgeResource(reader);

    await expect(getKnowledgeResource.execute({ id: expected.id })).resolves.toEqual(expected);
  });

  it('returns the canonical not-found error for a missing Resource', async () => {
    const reader: KnowledgeResourceReader = {
      async findById() {
        return null;
      },
    };

    const getKnowledgeResource = new GetKnowledgeResource(reader);

    await expect(getKnowledgeResource.execute({ id: generateResourceId() })).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
      publicMessage: 'Knowledge Resource not found.',
    });
  });

  it('updates only the canonical Resource Type through the P4-M03 update operation', async () => {
    const existing = makeResource();
    const nextResourceType = parseNamespacedKey('knowledge.test-resource-updated');
    let captured: UpdateKnowledgeResourceTypeRecordInput | undefined;

    const writer: KnowledgeResourceWriter = {
      async create(input) {
        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },
      async updateResourceType(input) {
        captured = input;

        if (input.id !== existing.id) {
          return null;
        }

        return {
          ...existing,
          resourceType: input.resourceType,
          updatedAt: new Date('2026-08-15T10:01:00.000Z'),
        };
      },
    };

    const updateKnowledgeResource = new UpdateKnowledgeResource(writer);

    const updated = await updateKnowledgeResource.execute({
      id: existing.id,
      resourceType: nextResourceType,
    });

    expect(captured).toEqual({
      id: existing.id,
      resourceType: nextResourceType,
    });
    expect(updated.id).toBe(existing.id);
    expect(updated.universeKey).toBe(existing.universeKey);
    expect(updated.resourceType).toBe(nextResourceType);
    expect(updated.lifecycle).toBe(existing.lifecycle);
    expect(updated.createdAt).toEqual(existing.createdAt);
  });

  it('returns the canonical not-found error when updating a missing Resource', async () => {
    const writer: KnowledgeResourceWriter = {
      async create(input) {
        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },
      async updateResourceType() {
        return null;
      },
    };

    const updateKnowledgeResource = new UpdateKnowledgeResource(writer);

    await expect(
      updateKnowledgeResource.execute({
        id: generateResourceId(),
        resourceType: parseNamespacedKey('knowledge.test-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
      publicMessage: 'Knowledge Resource not found.',
    });
  });

  it('rejects a non-canonical ResourceId before an update reaches persistence', async () => {
    let updateCalled = false;

    const writer: KnowledgeResourceWriter = {
      async create(input) {
        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },
      async updateResourceType() {
        updateCalled = true;
        return null;
      },
    };

    const updateKnowledgeResource = new UpdateKnowledgeResource(writer);

    await expect(
      updateKnowledgeResource.execute({
        id: 'not-a-resource-id',
        resourceType: parseNamespacedKey('knowledge.test-resource-updated'),
      }),
    ).rejects.toBeInstanceOf(TypeError);

    expect(updateCalled).toBe(false);
  });
});
