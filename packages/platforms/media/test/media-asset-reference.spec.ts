import { parseResourceId } from '@ai-world/kernel-identifiers';
import { describe, expect, it } from 'vitest';

import {
  ASSET_ARCHIVED_LIFECYCLE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  ASSET_VIDEO_TYPE,
  type Asset,
} from '../src/asset';
import type { AssetReader, FindAssetByIdInput } from '../src/asset-reader';
import { ResolveAssetReference } from '../src/media-asset-reference';

const ASSET_ID = parseResourceId('11111111-1111-4111-8111-111111111111');

function createAsset(overrides: Partial<Asset> = {}): Asset {
  const now = new Date('2026-08-16T00:00:00.000Z');
  return {
    id: ASSET_ID,
    assetType: ASSET_IMAGE_TYPE,
    technicalMetadata: { mimeType: 'image/png', sizeBytes: 4 },
    storageReference: `media/assets/${ASSET_ID}/original`,
    lifecycle: ASSET_INITIAL_LIFECYCLE,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

class RecordingAssetReader implements AssetReader {
  public readonly ids: string[] = [];
  public constructor(private readonly asset: Asset | null) {}
  public async findById(input: FindAssetByIdInput): Promise<Asset | null> {
    this.ids.push(input.id);
    return this.asset;
  }
}

describe('ResolveAssetReference', () => {
  it('returns only canonical reference-safe identity and Asset Type for an ACTIVE Asset', async () => {
    const reader = new RecordingAssetReader(createAsset({ assetType: ASSET_VIDEO_TYPE }));
    const resolver = new ResolveAssetReference(reader);
    const reference = await resolver.resolve({ id: ASSET_ID });

    expect(reference).toEqual({ id: ASSET_ID, assetType: ASSET_VIDEO_TYPE });
    expect(reference).not.toHaveProperty('storageReference');
    expect(reference).not.toHaveProperty('technicalMetadata');
    expect(reader.ids).toEqual([ASSET_ID]);
  });

  it('rejects malformed IDs before Media lookup', async () => {
    const reader = new RecordingAssetReader(createAsset());
    const resolver = new ResolveAssetReference(reader);

    await expect(resolver.resolve({ id: 'not-a-resource-id' })).rejects.toMatchObject({
      code: 'media.asset.reference.invalid_asset_id',
      kind: 'validation',
    });
    expect(reader.ids).toEqual([]);
  });

  it('does not expose ARCHIVED Assets as referenceable', async () => {
    const resolver = new ResolveAssetReference(
      new RecordingAssetReader(createAsset({ lifecycle: ASSET_ARCHIVED_LIFECYCLE })),
    );

    await expect(resolver.resolve({ id: ASSET_ID })).rejects.toMatchObject({
      code: 'media.asset.reference.not_found',
      kind: 'not_found',
    });
  });

  it('returns the same not-found contract for an unknown Asset', async () => {
    const resolver = new ResolveAssetReference(new RecordingAssetReader(null));

    await expect(resolver.resolve({ id: ASSET_ID })).rejects.toMatchObject({
      code: 'media.asset.reference.not_found',
      kind: 'not_found',
    });
  });
});
