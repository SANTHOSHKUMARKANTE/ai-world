import type { StorageObjectStore } from '@ai-world/foundation-storage';
import type { AuditRecorder, RecordAuditInput } from '@ai-world/kernel-audit';
import { EvaluatePermission } from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  ASSET_AUDIO_TYPE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE,
  MEDIA_UPLOAD_MAX_BYTES,
  MEDIA_UPLOAD_PNG_MIME_TYPE,
  UploadAsset,
  UploadAssetAsActor,
  type Asset,
  type MediaAssetUploadTransaction,
  type AssetWriter,
  type CreateAssetRecordInput,
} from '../src';
import { AAC_LC_AUDIO_MP4 } from './audio-mp4-fixture';

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

class RecordingAuditRecorder implements AuditRecorder {
  readonly records: RecordAuditInput[] = [];

  async record(input: RecordAuditInput): Promise<void> {
    this.records.push(input);
  }
}

class FailingAuditRecorder implements AuditRecorder {
  async record(): Promise<void> {
    throw new Error('Audit persistence failed.');
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

class RecordingMediaAssetUploadTransaction implements MediaAssetUploadTransaction {
  constructor(
    private readonly assetWriter: AssetWriter,
    private readonly auditRecorder: AuditRecorder,
  ) {}

  execute<TResult>(
    operation: Parameters<MediaAssetUploadTransaction['execute']>[0],
  ): Promise<TResult> {
    return operation({
      assetWriter: this.assetWriter,
      auditRecorder: this.auditRecorder,
    }) as Promise<TResult>;
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

  it('stores validated AAC-LC audio/mp4 and persists canonical AUDIO duration', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    const asset = await upload.execute({
      content: AAC_LC_AUDIO_MP4,
      mimeType: MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE,
    });

    expect(asset.assetType).toBe(ASSET_AUDIO_TYPE);
    expect(asset.lifecycle).toBe(ASSET_INITIAL_LIFECYCLE);
    expect(asset.technicalMetadata).toEqual({
      mimeType: 'audio/mp4',
      sizeBytes: AAC_LC_AUDIO_MP4.byteLength,
      durationMs: 273,
    });
    expect(storage.writes[0]?.content).toEqual(AAC_LC_AUDIO_MP4);
    expect(writer.creates).toHaveLength(1);
  });

  it('rejects AAC-LC bytes when declared as video/mp4', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const upload = new UploadAsset(writer, storage);

    await expect(
      upload.execute({
        content: AAC_LC_AUDIO_MP4,
        mimeType: 'video/mp4',
      }),
    ).rejects.toMatchObject({
      code: 'media.asset.upload.invalid_input',
    });

    expect(storage.writes).toHaveLength(0);
    expect(writer.creates).toHaveLength(0);
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
  it('records the successful ACTIVE Asset creation through the shared Audit Kernel', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const audit = new RecordingAuditRecorder();
    const actingActorId = 'b3b3482c-a885-4d70-9fd7-67659891c322';
    const evaluatePermission = new EvaluatePermission({
      hasPermission: async () => true,
    });
    const uploadAsActor = new UploadAssetAsActor(
      evaluatePermission,
      new RecordingMediaAssetUploadTransaction(writer, audit),
      storage,
    );

    const asset = await uploadAsActor.execute({
      actingActorId,
      content: PNG_BYTES,
      mimeType: MEDIA_UPLOAD_PNG_MIME_TYPE,
    });

    expect(audit.records).toEqual([
      {
        actorId: actingActorId,
        action: 'media.asset.upload',
        resource: {
          type: 'media.asset',
          id: asset.id,
        },
        result: 'media.asset.created',
        context: {
          assetType: 'IMAGE',
          mimeType: 'image/png',
          sizeBytes: PNG_BYTES.byteLength,
          lifecycle: 'ACTIVE',
        },
      },
    ]);
    expect(audit.records[0]?.context).not.toHaveProperty('storageReference');
  });

  it('removes stored bytes when required Audit persistence fails after Asset creation', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const evaluatePermission = new EvaluatePermission({
      hasPermission: async () => true,
    });
    const uploadAsActor = new UploadAssetAsActor(
      evaluatePermission,
      new RecordingMediaAssetUploadTransaction(writer, new FailingAuditRecorder()),
      storage,
    );

    await expect(
      uploadAsActor.execute({
        actingActorId: '726c5b37-8cad-4e42-b302-59f383bc1b7c',
        content: PNG_BYTES,
        mimeType: MEDIA_UPLOAD_PNG_MIME_TYPE,
      }),
    ).rejects.toThrow('Audit persistence failed.');

    expect(storage.writes).toHaveLength(1);
    expect(storage.deletes).toEqual([storage.writes[0]?.reference]);
  });

  it('checks authorization before canonical upload validation and records no lifecycle Audit', async () => {
    const storage = new RecordingStorage();
    const writer = new RecordingAssetWriter();
    const audit = new RecordingAuditRecorder();
    const evaluatePermission = new EvaluatePermission({
      hasPermission: async () => false,
    });
    const uploadAsActor = new UploadAssetAsActor(
      evaluatePermission,
      new RecordingMediaAssetUploadTransaction(writer, audit),
      storage,
    );

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
    expect(audit.records).toHaveLength(0);
  });
});
