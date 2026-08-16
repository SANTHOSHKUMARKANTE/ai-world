import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  GetPublicKnowledgeResource,
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  ListPublicKnowledgeResources,
  PUBLIC_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT,
  PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT,
  type FindPublishedKnowledgeResourceByIdInput,
  type KnowledgeResource,
  type ListPublishedKnowledgeResourcesInput,
  type PublicKnowledgeResourceReader,
} from '../src';

const createdAt = new Date('2026-08-16T04:00:00.000Z');
const updatedAt = new Date('2026-08-16T04:00:00.000Z');

function makeResource(overrides: Partial<KnowledgeResource> = {}): KnowledgeResource {
  return {
    id: generateResourceId(),
    universeKey: parseNamespacedKey('universe.devotional'),
    resourceType: parseNamespacedKey('devotional.deity'),
    lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
    createdAt,
    updatedAt,
    ...overrides,
  };
}

describe('Public Knowledge Resource reads', () => {
  it('returns a published Resource by canonical Resource ID', async () => {
    const expected = makeResource();

    const reader: PublicKnowledgeResourceReader = {
      async findPublishedById(input: FindPublishedKnowledgeResourceByIdInput) {
        return input.id === expected.id ? expected : null;
      },
      async listPublished() {
        return [];
      },
    };

    const getPublicKnowledgeResource = new GetPublicKnowledgeResource(reader);

    await expect(getPublicKnowledgeResource.execute({ id: expected.id })).resolves.toEqual(
      expected,
    );
  });

  it.each([KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE, KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE])(
    'does not expose a %s Resource even if an infrastructure reader returns it',
    async (lifecycle) => {
      const hidden = makeResource({ lifecycle });

      const reader: PublicKnowledgeResourceReader = {
        async findPublishedById() {
          return hidden;
        },
        async listPublished() {
          return [];
        },
      };

      const getPublicKnowledgeResource = new GetPublicKnowledgeResource(reader);

      await expect(getPublicKnowledgeResource.execute({ id: hidden.id })).rejects.toMatchObject({
        code: 'knowledge.public.resource_not_found',
        kind: 'not_found',
        publicMessage: 'Knowledge Resource not found.',
      });
    },
  );

  it('rejects a non-canonical Resource ID before the public reader is called', async () => {
    let readerCalled = false;

    const reader: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        readerCalled = true;
        return null;
      },
      async listPublished() {
        return [];
      },
    };

    const getPublicKnowledgeResource = new GetPublicKnowledgeResource(reader);

    await expect(
      getPublicKnowledgeResource.execute({ id: 'not-a-resource-id' }),
    ).rejects.toMatchObject({
      code: 'knowledge.public.invalid_resource_id',
      kind: 'validation',
      publicMessage: 'The Knowledge Resource identifier is invalid.',
    });

    expect(readerCalled).toBe(false);
  });

  it('applies a bounded default query and filters accidental non-public reader results', async () => {
    const published = makeResource();
    const draft = makeResource({
      id: generateResourceId(),
      lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    });
    const otherUniverse = makeResource({
      id: generateResourceId(),
      universeKey: parseNamespacedKey('universe.anime'),
      resourceType: parseNamespacedKey('anime.character'),
    });

    let captured: ListPublishedKnowledgeResourcesInput | undefined;

    const reader: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        return null;
      },
      async listPublished(input) {
        captured = input;
        return [published, draft, otherUniverse];
      },
    };

    const listPublicKnowledgeResources = new ListPublicKnowledgeResources(reader);

    await expect(
      listPublicKnowledgeResources.execute({
        universeKey: 'universe.devotional',
      }),
    ).resolves.toEqual([published]);

    expect(captured).toEqual({
      universeKey: 'universe.devotional',
      limit: PUBLIC_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT,
    });
  });

  it('supports Resource Type filtering with an explicit bounded limit', async () => {
    const deity = makeResource();
    const scripture = makeResource({
      id: generateResourceId(),
      resourceType: parseNamespacedKey('devotional.scripture'),
    });

    let captured: ListPublishedKnowledgeResourcesInput | undefined;

    const reader: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        return null;
      },
      async listPublished(input) {
        captured = input;
        return [deity, scripture];
      },
    };

    const listPublicKnowledgeResources = new ListPublicKnowledgeResources(reader);

    await expect(
      listPublicKnowledgeResources.execute({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: 1,
      }),
    ).resolves.toEqual([deity]);

    expect(captured).toEqual({
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      limit: 1,
    });
  });

  it.each([
    {
      input: { universeKey: 'Devotional' },
      label: 'invalid Universe key',
    },
    {
      input: {
        universeKey: 'universe.devotional',
        resourceType: 'Deity',
      },
      label: 'invalid Resource Type',
    },
    {
      input: {
        universeKey: 'universe.devotional',
        resourceType: '',
      },
      label: 'empty Resource Type',
    },
    {
      input: { universeKey: 'universe.devotional', limit: 0 },
      label: 'zero limit',
    },
    {
      input: {
        universeKey: 'universe.devotional',
        limit: PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT + 1,
      },
      label: 'over-maximum limit',
    },
    {
      input: { universeKey: 'universe.devotional', limit: 1.5 },
      label: 'non-integer limit',
    },
  ])('rejects $label before list persistence', async ({ input }) => {
    let readerCalled = false;

    const reader: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        return null;
      },
      async listPublished() {
        readerCalled = true;
        return [];
      },
    };

    const listPublicKnowledgeResources = new ListPublicKnowledgeResources(reader);

    await expect(listPublicKnowledgeResources.execute(input)).rejects.toMatchObject({
      code: 'knowledge.public.invalid_query',
      kind: 'validation',
      publicMessage: 'The public Knowledge query is invalid.',
    });

    expect(readerCalled).toBe(false);
  });
});
