import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import { GetPublicKnowledgeEntityByResourceId } from '../src/get-public-knowledge-entity-by-resource-id';
import type { PublicKnowledgeEntity } from '../src/knowledge-entity';
import type {
  FindPublishedKnowledgeEntityByResourceIdInput,
  PublicKnowledgeEntityByResourceIdReader,
} from '../src/public-knowledge-entity-by-resource-id-reader';

const RESOURCE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');

class MemoryReader implements PublicKnowledgeEntityByResourceIdReader {
  public entity: PublicKnowledgeEntity | null = null;
  public requestedId: string | null = null;

  public async findPublishedByResourceId(
    input: FindPublishedKnowledgeEntityByResourceIdInput,
  ): Promise<PublicKnowledgeEntity | null> {
    this.requestedId = input.knowledgeResourceId;
    return this.entity;
  }
}

function publishedEntity(): PublicKnowledgeEntity {
  return {
    resource: {
      id: RESOURCE_ID,
      universeKey: parseNamespacedKey('universe.devotional'),
      resourceType: parseNamespacedKey('devotional.temple'),
      lifecycle: 'PUBLISHED',
      createdAt: new Date('2026-08-31T00:00:00.000Z'),
      updatedAt: new Date('2026-08-31T00:00:00.000Z'),
    },
    profile: {
      knowledgeResourceId: RESOURCE_ID,
      routeKey: 'universe.devotional/kashi-vishwanath',
      slug: 'kashi-vishwanath',
      displayName: 'Kashi Vishwanath Temple',
      nativeName: null,
      alternateNames: [],
      summary: 'A published sacred-place profile.',
      overview: null,
      facts: [],
      createdAt: new Date('2026-08-31T00:00:00.000Z'),
      updatedAt: new Date('2026-08-31T00:00:00.000Z'),
    },
    media: [],
    relations: [],
  };
}

describe('GetPublicKnowledgeEntityByResourceId', () => {
  it('returns the existing PUBLISHED public Entity projection by canonical Resource ID', async () => {
    const reader = new MemoryReader();
    reader.entity = publishedEntity();

    const result = await new GetPublicKnowledgeEntityByResourceId(reader).execute({
      resourceId: RESOURCE_ID,
    });

    expect(reader.requestedId).toBe(RESOURCE_ID);
    expect(result.profile.displayName).toBe('Kashi Vishwanath Temple');
  });

  it('keeps invalid, missing and mismatched Resources opaque', async () => {
    const reader = new MemoryReader();
    const useCase = new GetPublicKnowledgeEntityByResourceId(reader);

    await expect(useCase.execute({ resourceId: 'not-a-resource-id' })).rejects.toMatchObject({
      code: 'knowledge.entity.public_not_found',
    });

    await expect(useCase.execute({ resourceId: RESOURCE_ID })).rejects.toMatchObject({
      code: 'knowledge.entity.public_not_found',
    });

    const otherId = parseResourceId('22222222-2222-4222-8222-222222222222');
    reader.entity = {
      ...publishedEntity(),
      resource: { ...publishedEntity().resource, id: otherId },
    };

    await expect(useCase.execute({ resourceId: RESOURCE_ID })).rejects.toMatchObject({
      code: 'knowledge.entity.public_not_found',
    });
  });
});
