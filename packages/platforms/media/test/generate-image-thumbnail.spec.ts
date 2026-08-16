import type { StorageObjectStore } from '@ai-world/foundation-storage';
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
import {
  GenerateImageThumbnail,
  MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS,
} from '../src/generate-image-thumbnail';
import type {
  CreateImageThumbnailInput,
  ImageThumbnailProcessor,
  ProcessedImageThumbnail,
} from '../src/image-thumbnail-processor';

const ASSET_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const SOURCE = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);

function createAsset(overrides: Partial<Asset> = {}): Asset {
  const now = new Date('2026-08-16T00:00:00.000Z');

  return {
    id: ASSET_ID,
    assetType: ASSET_IMAGE_TYPE,
    technicalMetadata: {
      mimeType: 'image/png',
      sizeBytes: SOURCE.byteLength,
    },
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

class RecordingStorage implements StorageObjectStore {
  public readonly readReferences: string[] = [];

  public constructor(private readonly source: Uint8Array) {}

  public async writeObject(input: {
    readonly reference: string;
    readonly content: Uint8Array;
  }): Promise<string> {
    return input.reference;
  }

  public async readObject(reference: string): Promise<Uint8Array> {
    this.readReferences.push(reference);
    return this.source;
  }

  public async deleteObject(reference: string): Promise<void> {
    void reference;
  }
}

class RecordingThumbnailProcessor implements ImageThumbnailProcessor {
  public readonly calls: CreateImageThumbnailInput[] = [];

  public async createThumbnail(input: CreateImageThumbnailInput): Promise<ProcessedImageThumbnail> {
    this.calls.push(input);

    return {
      content: Uint8Array.from([1, 2, 3]),
      mimeType: input.mimeType,
      widthPixels: 320,
      heightPixels: 240,
    };
  }
}

describe('GenerateImageThumbnail', () => {
  it('generates one bounded thumbnail from an ACTIVE initial image Asset', async () => {
    const asset = createAsset();
    const reader = new RecordingAssetReader(asset);
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    const result = await generate.execute({
      id: asset.id,
    });

    expect(result).toMatchObject({
      id: asset.id,
      mimeType: 'image/png',
      widthPixels: 320,
      heightPixels: 240,
    });
    expect(result.content).toEqual(Uint8Array.from([1, 2, 3]));
    expect(reader.ids).toEqual([asset.id]);
    expect(storage.readReferences).toEqual([asset.storageReference]);
    expect(processor.calls).toHaveLength(1);
    expect(processor.calls[0]?.maxEdgePixels).toBe(MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS);
  });

  it('does not process an ARCHIVED Asset', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        lifecycle: ASSET_ARCHIVED_LIFECYCLE,
      }),
    );
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    await expect(
      generate.execute({
        id: ASSET_ID,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.thumbnail.not_found',
      kind: 'not_found',
    });

    expect(storage.readReferences).toEqual([]);
    expect(processor.calls).toEqual([]);
  });

  it('does not claim thumbnail support for non-image Assets', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        assetType: ASSET_VIDEO_TYPE,
      }),
    );
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    await expect(
      generate.execute({
        id: ASSET_ID,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.thumbnail.not_found',
    });

    expect(storage.readReferences).toEqual([]);
    expect(processor.calls).toEqual([]);
  });

  it('rejects malformed Resource IDs before Asset or Storage reads', async () => {
    const reader = new RecordingAssetReader(createAsset());
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    await expect(
      generate.execute({
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.thumbnail.invalid_asset_id',
      kind: 'validation',
    });

    expect(reader.ids).toEqual([]);
    expect(storage.readReferences).toEqual([]);
    expect(processor.calls).toEqual([]);
  });

  it('rejects unsupported image MIME metadata before Storage access', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        technicalMetadata: {
          mimeType: 'image/gif',
          sizeBytes: SOURCE.byteLength,
        },
      }),
    );
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    await expect(
      generate.execute({
        id: ASSET_ID,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.thumbnail.not_found',
    });

    expect(storage.readReferences).toEqual([]);
    expect(processor.calls).toEqual([]);
  });

  it('does not invoke Sharp boundary when canonical source size conflicts with Storage', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        technicalMetadata: {
          mimeType: 'image/png',
          sizeBytes: SOURCE.byteLength + 1,
        },
      }),
    );
    const storage = new RecordingStorage(SOURCE);
    const processor = new RecordingThumbnailProcessor();
    const generate = new GenerateImageThumbnail(reader, storage, processor);

    await expect(
      generate.execute({
        id: ASSET_ID,
      }),
    ).rejects.toThrow('Stored Media Asset size does not match canonical technical metadata');

    expect(processor.calls).toEqual([]);
  });
});
