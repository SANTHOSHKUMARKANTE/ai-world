import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { describe, expect, it } from 'vitest';

import {
  ASSET_ARCHIVED_LIFECYCLE,
  ASSET_AUDIO_TYPE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  ASSET_VIDEO_TYPE,
  type Asset,
} from '../src/asset';
import type { AssetReader, FindAssetByIdInput } from '../src/asset-reader';
import { DeliverAsset } from '../src/deliver-asset';

const ASSET_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const CONTENT = Uint8Array.from([0x89, 0x50, 0x4e, 0x47]);

function createAsset(overrides: Partial<Asset> = {}): Asset {
  const now = new Date('2026-08-16T00:00:00.000Z');

  return {
    id: ASSET_ID,
    assetType: ASSET_IMAGE_TYPE,
    technicalMetadata: {
      mimeType: 'image/png',
      sizeBytes: CONTENT.byteLength,
    },
    storageReference: `media/assets/${ASSET_ID}/original`,
    lifecycle: ASSET_INITIAL_LIFECYCLE,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

class RecordingAssetReader implements AssetReader {
  public reads = 0;

  public constructor(private readonly asset: Asset | null) {}

  public async findById(input: FindAssetByIdInput): Promise<Asset | null> {
    void input;
    this.reads += 1;
    return this.asset;
  }
}

class RecordingStorage implements StorageObjectStore {
  public readReferences: string[] = [];

  public constructor(private readonly content: Uint8Array) {}

  public async writeObject(input: {
    readonly reference: string;
    readonly content: Uint8Array;
  }): Promise<string> {
    return input.reference;
  }

  public async readObject(reference: string): Promise<Uint8Array> {
    this.readReferences.push(reference);
    return this.content;
  }

  public async deleteObject(reference: string): Promise<void> {
    void reference;
  }
}

describe('DeliverAsset', () => {
  it('delivers bytes for an ACTIVE initial image Asset through its Storage reference', async () => {
    const asset = createAsset();
    const reader = new RecordingAssetReader(asset);
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(reader, storage);

    const result = await deliver.execute({
      id: asset.id,
    });

    expect(result).toEqual({
      id: asset.id,
      technicalMetadata: asset.technicalMetadata,
      content: CONTENT,
    });
    expect(storage.readReferences).toEqual([asset.storageReference]);
  });

  it('hides a missing Asset behind the Media delivery not-found contract', async () => {
    const reader = new RecordingAssetReader(null);
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(reader, storage);

    await expect(
      deliver.execute({
        id: ASSET_ID,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.delivery.not_found',
      kind: 'not_found',
    });

    expect(storage.readReferences).toEqual([]);
  });

  it('does not deliver an ARCHIVED Asset', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        lifecycle: ASSET_ARCHIVED_LIFECYCLE,
      }),
    );
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(reader, storage);

    await expect(
      deliver.execute({
        id: ASSET_ID,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.delivery.not_found',
    });

    expect(storage.readReferences).toEqual([]);
  });

  it('delivers bytes for an ACTIVE VIDEO Asset without adding a second delivery path', async () => {
    const asset = createAsset({
      assetType: ASSET_VIDEO_TYPE,
      technicalMetadata: {
        mimeType: 'video/mp4',
        sizeBytes: CONTENT.byteLength,
        durationMs: 5000,
      },
    });
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(new RecordingAssetReader(asset), storage);

    await expect(deliver.execute({ id: ASSET_ID })).resolves.toEqual({
      id: asset.id,
      technicalMetadata: asset.technicalMetadata,
      content: CONTENT,
    });
    expect(storage.readReferences).toEqual([asset.storageReference]);
  });

  it('delivers ACTIVE audio/mp4 AUDIO with positive duration through the same path', async () => {
    const asset = createAsset({
      assetType: ASSET_AUDIO_TYPE,
      technicalMetadata: {
        mimeType: 'audio/mp4',
        sizeBytes: CONTENT.byteLength,
        durationMs: 273,
      },
    });
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(new RecordingAssetReader(asset), storage);

    await expect(deliver.execute({ id: ASSET_ID })).resolves.toEqual({
      id: asset.id,
      technicalMetadata: asset.technicalMetadata,
      content: CONTENT,
    });
    expect(storage.readReferences).toEqual([asset.storageReference]);
  });

  it.each([
    { mimeType: 'video/mp4', durationMs: 273 },
    { mimeType: 'audio/mp4', durationMs: undefined },
  ])('does not deliver AUDIO outside the frozen profile (%o)', async (technical) => {
    const asset = createAsset({
      assetType: ASSET_AUDIO_TYPE,
      technicalMetadata: {
        mimeType: technical.mimeType,
        sizeBytes: CONTENT.byteLength,
        ...(technical.durationMs === undefined ? {} : { durationMs: technical.durationMs }),
      },
    });
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(new RecordingAssetReader(asset), storage);

    await expect(deliver.execute({ id: ASSET_ID })).rejects.toMatchObject({
      code: 'media.asset.delivery.not_found',
    });
    expect(storage.readReferences).toEqual([]);
  });

  it('rejects malformed Resource IDs before repository or Storage access', async () => {
    const reader = new RecordingAssetReader(createAsset());
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(reader, storage);

    await expect(
      deliver.execute({
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.delivery.invalid_asset_id',
      kind: 'validation',
    });

    expect(reader.reads).toBe(0);
    expect(storage.readReferences).toEqual([]);
  });

  it('refuses to deliver bytes when Storage size conflicts with canonical metadata', async () => {
    const reader = new RecordingAssetReader(
      createAsset({
        technicalMetadata: {
          mimeType: 'image/png',
          sizeBytes: CONTENT.byteLength + 1,
        },
      }),
    );
    const storage = new RecordingStorage(CONTENT);
    const deliver = new DeliverAsset(reader, storage);

    await expect(
      deliver.execute({
        id: ASSET_ID,
      }),
    ).rejects.toThrow('Stored Media Asset size does not match canonical technical metadata');
  });
});
