import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { ASSET_IMAGE_TYPE } from '@ai-world/platform-media';
import { describe, expect, it } from 'vitest';

import {
  KNOWLEDGE_MEDIA_STILL_PLAYBACK,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  ListPublicKnowledgeDiscovery,
  PUBLIC_KNOWLEDGE_DISCOVERY_DEFAULT_LIMIT,
  type PublicKnowledgeDiscoveryReader,
  type PublicKnowledgeEntity,
} from '../src';

function entity(options: {
  readonly id: string;
  readonly universeKey?: string;
  readonly resourceType?: string;
  readonly slug: string;
  readonly displayName: string;
  readonly updatedAt: string;
  readonly withPreview?: boolean;
}): PublicKnowledgeEntity {
  const resourceId = parseResourceId(options.id);
  const universeKey = parseNamespacedKey(options.universeKey ?? 'universe.anime');
  const resourceType = parseNamespacedKey(options.resourceType ?? 'anime.character');
  const createdAt = new Date('2026-08-01T00:00:00.000Z');
  const updatedAt = new Date(options.updatedAt);

  return {
    resource: {
      id: resourceId,
      universeKey,
      resourceType,
      lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      createdAt,
      updatedAt,
    },
    profile: {
      knowledgeResourceId: resourceId,
      routeKey: `${universeKey}/${options.slug}`,
      slug: options.slug,
      displayName: options.displayName,
      nativeName: null,
      alternateNames: [],
      summary: `${options.displayName} summary`,
      overview: null,
      facts: [],
      createdAt,
      updatedAt,
    },
    media: options.withPreview
      ? [
          {
            assetId: parseResourceId('94000000-0000-4000-8000-000000000001'),
            assetType: ASSET_IMAGE_TYPE,
            mimeType: 'image/png',
            role: 'HERO',
            playback: KNOWLEDGE_MEDIA_STILL_PLAYBACK,
            position: 0,
            altText: `${options.displayName} portrait`,
            caption: null,
            posterAssetId: null,
          },
        ]
      : [],
    relations: [],
  };
}

class FakeDiscoveryReader implements PublicKnowledgeDiscoveryReader {
  readonly calls: unknown[] = [];

  public constructor(private readonly items: readonly PublicKnowledgeEntity[]) {}

  public async listPublishedEntities(
    input: Parameters<PublicKnowledgeDiscoveryReader['listPublishedEntities']>[0],
  ): Promise<readonly PublicKnowledgeEntity[]> {
    this.calls.push(input);
    return this.items.slice(0, input.limit);
  }
}

describe('ListPublicKnowledgeDiscovery', () => {
  it('maps public Entity identity and one eligible preview through a generic discovery contract', async () => {
    const reader = new FakeDiscoveryReader([
      entity({
        id: '93000000-0000-4000-8000-000000000001',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        updatedAt: '2026-08-25T01:00:00.000Z',
        withPreview: true,
      }),
      entity({
        id: '93000000-0000-4000-8000-000000000002',
        slug: 'sasuke-uchiha',
        displayName: 'Sasuke Uchiha',
        updatedAt: '2026-08-24T01:00:00.000Z',
      }),
    ]);

    const result = await new ListPublicKnowledgeDiscovery(reader).execute({
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      limit: 2,
    });

    expect(reader.calls).toEqual([
      {
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        limit: 2,
      },
    ]);

    expect(result).toEqual([
      {
        resourceId: '93000000-0000-4000-8000-000000000001',
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        summary: 'Naruto Uzumaki summary',
        updatedAt: new Date('2026-08-25T01:00:00.000Z'),
        previewMedia: {
          assetId: '94000000-0000-4000-8000-000000000001',
          assetType: 'IMAGE',
          mimeType: 'image/png',
          playback: 'STILL',
          posterAssetId: null,
          altText: 'Naruto Uzumaki portrait',
        },
      },
      {
        resourceId: '93000000-0000-4000-8000-000000000002',
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'sasuke-uchiha',
        displayName: 'Sasuke Uchiha',
        summary: 'Sasuke Uchiha summary',
        updatedAt: new Date('2026-08-24T01:00:00.000Z'),
        previewMedia: null,
      },
    ]);
  });

  it('keeps Resource Type optional and applies the bounded default without Anime-specific branching', async () => {
    const reader = new FakeDiscoveryReader([
      entity({
        id: '93000000-0000-4000-8000-000000000001',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        updatedAt: '2026-08-25T01:00:00.000Z',
      }),
      entity({
        id: '93000000-0000-4000-8000-000000000006',
        resourceType: 'anime.series',
        slug: 'naruto-series',
        displayName: 'Naruto',
        updatedAt: '2026-08-24T01:00:00.000Z',
      }),
    ]);

    const result = await new ListPublicKnowledgeDiscovery(reader).execute({
      universeKey: 'universe.anime',
    });

    expect(reader.calls).toEqual([
      {
        universeKey: 'universe.anime',
        limit: PUBLIC_KNOWLEDGE_DISCOVERY_DEFAULT_LIMIT,
      },
    ]);
    expect(result.map((item) => item.resourceType)).toEqual(['anime.character', 'anime.series']);
  });

  it('remains generic across Universes and Resource Types', async () => {
    const reader = new FakeDiscoveryReader([
      entity({
        id: '93000000-0000-4000-8000-000000000007',
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'lord-shiva',
        displayName: 'Lord Shiva',
        updatedAt: '2026-08-25T01:00:00.000Z',
      }),
    ]);

    const result = await new ListPublicKnowledgeDiscovery(reader).execute({
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'lord-shiva',
      displayName: 'Lord Shiva',
    });
  });

  it('rejects invalid namespaced keys and out-of-range limits before reading persistence', async () => {
    const reader = new FakeDiscoveryReader([]);
    const discovery = new ListPublicKnowledgeDiscovery(reader);

    await expect(
      discovery.execute({
        universeKey: 'anime',
      }),
    ).rejects.toMatchObject({ code: 'knowledge.public.invalid_query' });

    await expect(
      discovery.execute({
        universeKey: 'universe.anime',
        limit: 51,
      }),
    ).rejects.toMatchObject({ code: 'knowledge.public.invalid_query' });

    expect(reader.calls).toEqual([]);
  });
});
