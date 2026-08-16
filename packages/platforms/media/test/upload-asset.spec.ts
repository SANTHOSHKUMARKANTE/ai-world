import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { EvaluatePermission } from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  MEDIA_UPLOAD_MAX_BYTES,
  MEDIA_UPLOAD_PNG_MIME_TYPE,
  UploadAsset,
  UploadAssetAsActor,
  type Asset,
  type AssetWriter,
  type CreateAssetRecordInput,
} from '../src';

const PNG_BYTES = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);

class RecordingStorage implements StorageObjectStore {
  readonly writes: Array<{
    readonly reference: string;
    readonly content: Uint8Array;
  }> = [];

  readonly deletes: string[] = [];

  async writeObject(input: {
    readonly reference: string;
    readonly content: Uint8Array;
  }): Promise<string> {
    this.writes.push(input);
    return input.reference;
  }

  async readObject(): Promise<Uint8Array> {
    throw new Error('Not used in upload tests.');
  }

  async deleteObject(reference: string): Promise<void> {
    this.deletes.push(reference);
  }
}

class RecordingAssetWriter implements AssetWriter {
  readonly creates: CreateAssetRecordInput[] = [];

  fail = false;

  async create(input: CreateAssetRecordInput): Promise<Asset> {
    this.creates.push(input);

    if (this.fail) {
      throw new Error('Persistence failed.');
    }

    const now = new Date('2026-08-16T11:15:00.000Z');

    return {
      ...input,
      createdAt: now,
      updatedAt: now,
    };
  }
}

describe('UploadAsset', () => {
  it('stores validated PNG bytes and persists the Media-owned Asset', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    const asset = await upload.execute({
      content: PNG_BYTES,
      mimeType: MEDIA_UPLOAD_PNG_MIME_TYPE,
    });

    expect(asset.assetType).toBe(ASSET_IMAGE_TYPE);
    expect(asset.lifecycle).toBe(ASSET_INITIAL_LIFECYCLE);
    expect(asset.technicalMetadata).toEqual({
      mimeType: 'image/png',
      sizeBytes: PNG_BYTES.byteLength,
    });
    expect(asset.storageReference).toBe(`media/assets/${asset.id}/original`);

    expect(storage.writes).toHaveLength(1);
    expect(storage.writes[0]?.reference).toBe(asset.storageReference);
    expect(storage.writes[0]?.content).toEqual(PNG_BYTES);
    expect(writer.creates).toHaveLength(1);
  });

  it('rejects unsupported media before touching Storage or persistence', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    await expect(
      upload.execute({
        content: new Uint8Array([1, 2, 3]),
        mimeType: 'text/plain',
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.upload.invalid_input',
      kind: 'validation',
    });

    expect(storage.writes).toHaveLength(0);
    expect(writer.creates).toHaveLength(0);
  });

  it('rejects a declared MIME type that does not match file bytes', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    await expect(
      upload.execute({
        content: PNG_BYTES,
        mimeType: 'image/jpeg',
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.upload.invalid_input',
    });

    expect(storage.writes).toHaveLength(0);
    expect(writer.creates).toHaveLength(0);
  });

  it('rejects oversized files before Storage', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    await expect(
      upload.execute({
        content: new Uint8Array(MEDIA_UPLOAD_MAX_BYTES + 1),
        mimeType: MEDIA_UPLOAD_PNG_MIME_TYPE,
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.upload.invalid_input',
    });

    expect(storage.writes).toHaveLength(0);
    expect(writer.creates).toHaveLength(0);
  });

  it('removes the stored object when Asset persistence fails', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    writer.fail = true;

    const upload = new UploadAsset(writer, storage);

    await expect(
      upload.execute({
        content: PNG_BYTES,
        mimeType: MEDIA_UPLOAD_PNG_MIME_TYPE,
      }),
    ).rejects.toThrow('Persistence failed.');

    expect(storage.writes).toHaveLength(1);
    expect(storage.deletes).toEqual([storage.writes[0]?.reference]);
  });
});

describe('UploadAssetAsActor', () => {
  it('checks authorization before canonical upload validation', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);
    const evaluatePermission = new EvaluatePermission({
      hasPermission: async () => false,
    });
    const uploadAsActor = new UploadAssetAsActor(evaluatePermission, upload);

    await expect(
      uploadAsActor.execute({
        actingActorId: '5f80a03b-0cdd-4cc6-80b3-3d7bd897ee21',
        content: new Uint8Array([1]),
        mimeType: 'text/plain',
      }),
    ).rejects.toMatchObject({
      code: 'media.authorization.forbidden',
      kind: 'forbidden',
    });

    expect(storage.writes).toHaveLength(0);
    expect(writer.creates).toHaveLength(0);
  });
});
