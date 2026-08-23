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
import { ResolvePublicMediaAssetDescriptor } from '../src/public-media-asset-descriptor';

const ASSET_ID = parseResourceId('11111111-1111-4111-8111-111111111111');

function asset(overrides: Partial<Asset> = {}): Asset {
  const now = new Date('2026-08-23T00:00:00.000Z');

  return {
    id: ASSET_ID,
    assetType: ASSET_IMAGE_TYPE,
    technicalMetadata: {
      mimeType: 'image/png',
      sizeBytes: 4096,
    },
    storageReference: 'secret/provider/path/original',
    lifecycle: ASSET_INITIAL_LIFECYCLE,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

class StaticAssetReader implements AssetReader {
  public constructor(private readonly value: Asset | null) {}

  public async findById(input: FindAssetByIdInput): Promise<Asset | null> {
    void input;
    return this.value;
  }
}

describe('ResolvePublicMediaAssetDescriptor', () => {
  it('returns only ACTIVE public-safe descriptor metadata', async () => {
    const descriptor = await new ResolvePublicMediaAssetDescriptor(
      new StaticAssetReader(
        asset({
          assetType: ASSET_VIDEO_TYPE,
          technicalMetadata: { mimeType: 'video/mp4', sizeBytes: 9876 },
        }),
      ),
    ).findById({ id: ASSET_ID });

    expect(descriptor).toEqual({
      id: ASSET_ID,
      assetType: ASSET_VIDEO_TYPE,
      mimeType: 'video/mp4',
    });
    expect(descriptor).not.toHaveProperty('storageReference');
    expect(descriptor).not.toHaveProperty('sizeBytes');
  });

  it('returns null for ARCHIVED Assets', async () => {
    const descriptor = await new ResolvePublicMediaAssetDescriptor(
      new StaticAssetReader(asset({ lifecycle: ASSET_ARCHIVED_LIFECYCLE })),
    ).findById({ id: ASSET_ID });

    expect(descriptor).toBeNull();
  });

  it('returns null for unknown Assets', async () => {
    const descriptor = await new ResolvePublicMediaAssetDescriptor(
      new StaticAssetReader(null),
    ).findById({ id: ASSET_ID });

    expect(descriptor).toBeNull();
  });

  it('exposes VIDEO duration without exposing private technical or Storage fields', async () => {
    const descriptor = await new ResolvePublicMediaAssetDescriptor(
      new StaticAssetReader(
        asset({
          assetType: ASSET_VIDEO_TYPE,
          technicalMetadata: {
            mimeType: 'video/mp4',
            sizeBytes: 9876,
            durationMs: 5000,
          },
        }),
      ),
    ).findById({ id: ASSET_ID });

    expect(descriptor).toEqual({
      id: ASSET_ID,
      assetType: ASSET_VIDEO_TYPE,
      mimeType: 'video/mp4',
      durationMs: 5000,
    });
    expect(descriptor).not.toHaveProperty('sizeBytes');
    expect(descriptor).not.toHaveProperty('storageReference');
  });
});
