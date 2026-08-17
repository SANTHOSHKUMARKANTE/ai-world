import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import type {
  MediaAssetReference,
  MediaAssetReferenceResolver,
  ResolveMediaAssetReferenceInput,
} from '@ai-world/platform-media';
import { describe, expect, it } from 'vitest';

import type { KnowledgeResource } from '../src/knowledge-resource';
import type { KnowledgeResourceAssetReferenceStore } from '../src/knowledge-resource-asset-reference-store';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from '../src/knowledge-resource-reader';
import { SetKnowledgeResourceAssets } from '../src/set-knowledge-resource-assets';

const RESOURCE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const ASSET_A = parseResourceId('22222222-2222-4222-8222-222222222222');
const ASSET_B = parseResourceId('33333333-3333-4333-8333-333333333333');

function createResource(): KnowledgeResource {
  const now = new Date('2026-08-16T00:00:00.000Z');
  return {
    id: RESOURCE_ID,
    universeKey: parseNamespacedKey('universe.devotional'),
    resourceType: parseNamespacedKey('devotional.deity'),
    lifecycle: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

class RecordingResourceReader implements KnowledgeResourceReader {
  public readonly ids: ResourceId[] = [];
  public constructor(private readonly resource: KnowledgeResource | null) {}
  public async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    this.ids.push(input.id);
    return this.resource;
  }
}

class RecordingReferenceStore implements KnowledgeResourceAssetReferenceStore {
  public readonly replacements: Array<{
    readonly knowledgeResourceId: ResourceId;
    readonly assetIds: readonly ResourceId[];
  }> = [];
  public async listAssetIds(): Promise<readonly ResourceId[]> {
    return this.replacements.at(-1)?.assetIds ?? [];
  }
  public async replaceAssetIds(input: {
    readonly knowledgeResourceId: ResourceId;
    readonly assetIds: readonly ResourceId[];
  }): Promise<readonly ResourceId[]> {
    this.replacements.push(input);
    return input.assetIds;
  }
}

class RecordingMediaResolver implements MediaAssetReferenceResolver {
  public readonly ids: string[] = [];
  public constructor(private readonly references: ReadonlyMap<string, MediaAssetReference>) {}
  public async resolve(input: ResolveMediaAssetReferenceInput): Promise<MediaAssetReference> {
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

describe('SetKnowledgeResourceAssets', () => {
  it('stores only Asset IDs resolved through the Media-owned Contract', async () => {
    const resources = new RecordingResourceReader(createResource());
    const references = new RecordingReferenceStore();
    const media = new RecordingMediaResolver(
      new Map([
        [ASSET_A, { id: ASSET_A }],
        [ASSET_B, { id: ASSET_B }],
      ]),
    );
    const setAssets = new SetKnowledgeResourceAssets(resources, references, media);
    await expect(
      setAssets.execute({ id: RESOURCE_ID, assetIds: [ASSET_A, ASSET_B] }),
    ).resolves.toEqual([ASSET_A, ASSET_B]);
    expect(resources.ids).toEqual([RESOURCE_ID]);
    expect(media.ids).toEqual([ASSET_A, ASSET_B]);
    expect(references.replacements).toEqual([
      {
        knowledgeResourceId: RESOURCE_ID,
        assetIds: [ASSET_A, ASSET_B],
      },
    ]);
  });

  it('checks Knowledge existence before resolving Media references', async () => {
    const media = new RecordingMediaResolver(new Map([[ASSET_A, { id: ASSET_A }]]));
    const references = new RecordingReferenceStore();
    const setAssets = new SetKnowledgeResourceAssets(
      new RecordingResourceReader(null),
      references,
      media,
    );
    await expect(setAssets.execute({ id: RESOURCE_ID, assetIds: [ASSET_A] })).rejects.toMatchObject(
      {
        code: 'knowledge.resource.not_found',
        kind: 'not_found',
      },
    );
    expect(media.ids).toEqual([]);
    expect(references.replacements).toEqual([]);
  });

  it('does not persist when Media rejects an Asset reference', async () => {
    const references = new RecordingReferenceStore();
    const setAssets = new SetKnowledgeResourceAssets(
      new RecordingResourceReader(createResource()),
      references,
      new RecordingMediaResolver(new Map()),
    );
    await expect(setAssets.execute({ id: RESOURCE_ID, assetIds: [ASSET_A] })).rejects.toMatchObject(
      {
        code: 'media.asset.reference.not_found',
      },
    );
    expect(references.replacements).toEqual([]);
  });

  it('rejects duplicate Asset IDs before Media resolution', async () => {
    const media = new RecordingMediaResolver(new Map([[ASSET_A, { id: ASSET_A }]]));
    const references = new RecordingReferenceStore();
    const setAssets = new SetKnowledgeResourceAssets(
      new RecordingResourceReader(createResource()),
      references,
      media,
    );
    await expect(
      setAssets.execute({ id: RESOURCE_ID, assetIds: [ASSET_A, ASSET_A] }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.assets.duplicate_asset',
      kind: 'validation',
    });
    expect(media.ids).toEqual([]);
    expect(references.replacements).toEqual([]);
  });

  it('allows clearing all Asset references without contacting Media', async () => {
    const media = new RecordingMediaResolver(new Map());
    const references = new RecordingReferenceStore();
    const setAssets = new SetKnowledgeResourceAssets(
      new RecordingResourceReader(createResource()),
      references,
      media,
    );
    await expect(setAssets.execute({ id: RESOURCE_ID, assetIds: [] })).resolves.toEqual([]);
    expect(media.ids).toEqual([]);
    expect(references.replacements).toEqual([
      {
        knowledgeResourceId: RESOURCE_ID,
        assetIds: [],
      },
    ]);
  });
});
