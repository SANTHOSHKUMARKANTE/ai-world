import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import type { AuditRecorder } from '@ai-world/kernel-audit';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { ASSET_IMAGE_TYPE, ASSET_INITIAL_LIFECYCLE } from '../src';
import { PrismaMediaAssetUploadTransaction } from '../src/infrastructure';

class FailingAuditRecorder implements AuditRecorder {
  async record(): Promise<void> {
    throw new Error('Audit persistence failed.');
  }
}

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Media persistence integration tests.');
  }

  return databaseUrl;
}

describe('Media Asset persistence', () => {
  let database: DatabaseClient;

  const assetIds = new Set<string>();

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });
  });

  afterEach(async () => {
    if (assetIds.size > 0) {
      await database.asset.deleteMany({
        where: {
          id: {
            in: [...assetIds],
          },
        },
      });
    }

    assetIds.clear();
  });

  afterAll(async () => {
    await database.$disconnect();
  });

  it('persists the canonical Media-owned Asset record', async () => {
    const id = generateResourceId();

    const asset = await database.asset.create({
      data: {
        id,
        assetType: ASSET_IMAGE_TYPE,
        mimeType: 'image/png',
        sizeBytes: 1_024,
        storageReference: 'media/test/image.png',
        lifecycle: ASSET_INITIAL_LIFECYCLE,
      },
    });

    assetIds.add(asset.id);

    expect(asset.id).toBe(id);
    expect(asset.assetType).toBe('IMAGE');
    expect(asset.mimeType).toBe('image/png');
    expect(asset.sizeBytes).toBe(1_024);
    expect(asset.storageReference).toBe('media/test/image.png');
    expect(asset.lifecycle).toBe('ACTIVE');
    expect(asset.createdAt).toBeInstanceOf(Date);
    expect(asset.updatedAt).toBeInstanceOf(Date);

    const persistedAsset = await database.asset.findUniqueOrThrow({
      where: {
        id,
      },
    });

    expect(persistedAsset.id).toBe(id);
    expect(persistedAsset.assetType).toBe('IMAGE');
    expect(persistedAsset.mimeType).toBe('image/png');
    expect(persistedAsset.sizeBytes).toBe(1_024);
    expect(persistedAsset.storageReference).toBe('media/test/image.png');
    expect(persistedAsset.lifecycle).toBe('ACTIVE');
  });

  it('rolls back Asset persistence when required Audit persistence fails in the upload transaction', async () => {
    const id = generateResourceId();
    const actorId = generateResourceId();
    const transaction = new PrismaMediaAssetUploadTransaction(
      database,
      () => new FailingAuditRecorder(),
    );

    await expect(
      transaction.execute(async ({ assetWriter, auditRecorder }) => {
        const asset = await assetWriter.create({
          id,
          assetType: ASSET_IMAGE_TYPE,
          technicalMetadata: {
            mimeType: 'image/png',
            sizeBytes: 512,
          },
          storageReference: `media/assets/${id}/original`,
          lifecycle: ASSET_INITIAL_LIFECYCLE,
        });

        await auditRecorder.record({
          actorId,
          action: parseNamespacedKey('media.asset.upload'),
          resource: {
            type: parseNamespacedKey('media.asset'),
            id: asset.id,
          },
          result: parseNamespacedKey('media.asset.created'),
        });

        return asset;
      }),
    ).rejects.toThrow('Audit persistence failed.');

    expect(
      await database.asset.findUnique({
        where: {
          id,
        },
      }),
    ).toBeNull();
  });

  it('rejects duplicate canonical Resource identifiers', async () => {
    const id = generateResourceId();

    await database.asset.create({
      data: {
        id,
        assetType: ASSET_IMAGE_TYPE,
        mimeType: 'image/png',
        sizeBytes: 2_048,
        storageReference: 'media/test/original.png',
        lifecycle: ASSET_INITIAL_LIFECYCLE,
      },
    });

    assetIds.add(id);

    await expect(
      database.asset.create({
        data: {
          id,
          assetType: ASSET_IMAGE_TYPE,
          mimeType: 'image/png',
          sizeBytes: 2_048,
          storageReference: 'media/test/duplicate.png',
          lifecycle: ASSET_INITIAL_LIFECYCLE,
        },
      }),
    ).rejects.toMatchObject({
      code: 'P2002',
    });
  });
});
