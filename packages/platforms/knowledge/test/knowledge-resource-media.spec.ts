import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  ASSET_IMAGE_TYPE,
  ASSET_VIDEO_TYPE,
  type MediaAssetReference,
  type MediaAssetReferenceResolver,
  type ResolveMediaAssetReferenceInput,
} from '@ai-world/platform-media';
import { describe, expect, it } from 'vitest';

import type { KnowledgeResource } from '../src/knowledge-resource';
import type { KnowledgeResourceAssetReferenceStore } from '../src/knowledge-resource-asset-reference-store';
import type { KnowledgeResourceMediaPlacement } from '../src/knowledge-resource-media-placement';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from '../src/knowledge-resource-reader';
import { SetKnowledgeResourceMedia } from '../src/set-knowledge-resource-media';

const RESOURCE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const IMAGE_A = parseResourceId('22222222-2222-4222-8222-222222222222');
const IMAGE_B = parseResourceId('33333333-3333-4333-8333-333333333333');
const VIDEO = parseResourceId('44444444-4444-4444-8444-444444444444');
const POSTER = parseResourceId('55555555-5555-4555-8555-555555555555');

function createResource(): KnowledgeResource {
  const now = new Date('2026-08-23T00:00:00.000Z');
  return {
    id: RESOURCE_ID,
    universeKey: parseNamespacedKey('universe.anime'),
    resourceType: parseNamespacedKey('anime.character'),
    lifecycle: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

class RecordingResourceReader implements KnowledgeResourceReader {
  public readonly ids: ResourceId[] = [];
  public constructor(private readonly resource: KnowledgeResource | null) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    this.ids.push(input.id);
    return this.resource;
  }
}

class RecordingPlacementStore implements KnowledgeResourceAssetReferenceStore {
  public readonly replacements: Array<{
    readonly knowledgeResourceId: ResourceId;
    readonly placements: readonly KnowledgeResourceMediaPlacement[];
  }> = [];

  async listAssetIds(): Promise<readonly ResourceId[]> {
    return this.replacements.at(-1)?.placements.map(({ assetId }) => assetId) ?? [];
  }

  async replaceMediaPlacements(input: {
    readonly knowledgeResourceId: ResourceId;
    readonly placements: readonly KnowledgeResourceMediaPlacement[];
  }): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    this.replacements.push(input);
    return input.placements;
  }
}

class RecordingMediaResolver implements MediaAssetReferenceResolver {
  public readonly ids: string[] = [];
  public constructor(private readonly references: ReadonlyMap<string, MediaAssetReference>) {}

  async resolve(input: ResolveMediaAssetReferenceInput): Promise<MediaAssetReference> {
    this.ids.push(input.id);
    const reference = this.references.get(input.id);
    if (!reference) {
      throw new ApplicationError({
        code: 'media.asset.reference.not_found',
        kind: 'not_found',
        message: 'Test Media reference is unavailable.',
        publicMessage: 'Media Asset not found.',
      });
    }
    return reference;
  }
}

function resolver(): RecordingMediaResolver {
  return new RecordingMediaResolver(
    new Map([
      [IMAGE_A, { id: IMAGE_A, assetType: ASSET_IMAGE_TYPE }],
      [IMAGE_B, { id: IMAGE_B, assetType: ASSET_IMAGE_TYPE }],
      [VIDEO, { id: VIDEO, assetType: ASSET_VIDEO_TYPE }],
      [POSTER, { id: POSTER, assetType: ASSET_IMAGE_TYPE }],
    ]),
  );
}

describe('SetKnowledgeResourceMedia', () => {
  it('derives deterministic positions and persists normalized ordered IMAGE placements', async () => {
    const references = new RecordingPlacementStore();
    const media = resolver();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      media,
    );

    const result = await useCase.execute({
      id: RESOURCE_ID,
      placements: [
        {
          assetId: IMAGE_B,
          role: 'HERO',
          playback: 'STILL',
          altText: '  Naruto hero portrait  ',
          caption: '  Hero art  ',
        },
        {
          assetId: IMAGE_A,
          role: 'GALLERY',
          playback: 'STILL',
          altText: 'Naruto gallery portrait',
        },
      ],
    });

    expect(result).toEqual([
      {
        assetId: IMAGE_B,
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Naruto hero portrait',
        caption: 'Hero art',
        posterAssetId: null,
      },
      {
        assetId: IMAGE_A,
        role: 'GALLERY',
        playback: 'STILL',
        position: 1,
        altText: 'Naruto gallery portrait',
        caption: null,
        posterAssetId: null,
      },
    ]);
    expect(references.replacements).toHaveLength(1);
  });

  it('accepts VIDEO SHORT_LOOP only with an ACTIVE IMAGE poster reference', async () => {
    const references = new RecordingPlacementStore();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      resolver(),
    );

    await expect(
      useCase.execute({
        id: RESOURCE_ID,
        placements: [
          {
            assetId: VIDEO,
            role: 'HIGHLIGHT',
            playback: 'SHORT_LOOP',
            altText: 'Naruto short motion',
            posterAssetId: POSTER,
          },
        ],
      }),
    ).resolves.toEqual([
      {
        assetId: VIDEO,
        role: 'HIGHLIGHT',
        playback: 'SHORT_LOOP',
        position: 0,
        altText: 'Naruto short motion',
        caption: null,
        posterAssetId: POSTER,
      },
    ]);
  });

  it('rejects multiple HERO placements before Media resolution', async () => {
    const media = resolver();
    const references = new RecordingPlacementStore();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      media,
    );

    await expect(
      useCase.execute({
        id: RESOURCE_ID,
        placements: [
          { assetId: IMAGE_A, role: 'HERO', playback: 'STILL', altText: 'A' },
          { assetId: IMAGE_B, role: 'HERO', playback: 'STILL', altText: 'B' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'knowledge.resource.media.multiple_hero' });

    expect(media.ids).toEqual([]);
    expect(references.replacements).toEqual([]);
  });

  it('rejects duplicate canonical primary Assets without persisting', async () => {
    const references = new RecordingPlacementStore();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      resolver(),
    );

    await expect(
      useCase.execute({
        id: RESOURCE_ID,
        placements: [
          { assetId: IMAGE_A, role: 'GALLERY', playback: 'STILL', altText: 'A' },
          { assetId: IMAGE_A, role: 'HIGHLIGHT', playback: 'STILL', altText: 'A again' },
        ],
      }),
    ).rejects.toMatchObject({ code: 'knowledge.resource.media.duplicate_asset' });

    expect(references.replacements).toEqual([]);
  });

  it.each([
    {
      label: 'blank alt text',
      placement: { assetId: IMAGE_A, role: 'GALLERY', playback: 'STILL', altText: '   ' },
    },
    {
      label: 'IMAGE short loop',
      placement: { assetId: IMAGE_A, role: 'GALLERY', playback: 'SHORT_LOOP', altText: 'Image' },
    },
    {
      label: 'VIDEO without poster',
      placement: { assetId: VIDEO, role: 'HIGHLIGHT', playback: 'SHORT_LOOP', altText: 'Video' },
    },
  ])('rejects $label', async ({ placement }) => {
    const references = new RecordingPlacementStore();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      resolver(),
    );

    await expect(
      useCase.execute({ id: RESOURCE_ID, placements: [placement] }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.media.invalid_placement',
      kind: 'validation',
    });
    expect(references.replacements).toEqual([]);
  });

  it('checks Knowledge existence before resolving Media', async () => {
    const media = resolver();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(null),
      new RecordingPlacementStore(),
      media,
    );

    await expect(
      useCase.execute({
        id: RESOURCE_ID,
        placements: [{ assetId: IMAGE_A, role: 'GALLERY', playback: 'STILL', altText: 'Image' }],
      }),
    ).rejects.toMatchObject({ code: 'knowledge.resource.not_found' });

    expect(media.ids).toEqual([]);
  });

  it('supports clearing all placements without contacting Media', async () => {
    const media = resolver();
    const references = new RecordingPlacementStore();
    const useCase = new SetKnowledgeResourceMedia(
      new RecordingResourceReader(createResource()),
      references,
      media,
    );

    await expect(useCase.execute({ id: RESOURCE_ID, placements: [] })).resolves.toEqual([]);
    expect(media.ids).toEqual([]);
  });
});
