import type { DatabaseClient, DatabaseTransactionClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import { isAssetLifecycle, isAssetType, type Asset } from './asset';
import type { AssetReader, FindAssetByIdInput } from './asset-reader';
import type { AssetWriter, CreateAssetRecordInput } from './asset-writer';

interface PersistedAsset {
  readonly id: string;
  readonly assetType: string;
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly storageReference: string;
  readonly lifecycle: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

function mapPersistedAsset(asset: PersistedAsset): Asset {
  if (!isAssetType(asset.assetType)) {
    throw new TypeError(`Persisted Asset has unsupported Asset Type: ${asset.assetType}`);
  }

  if (!isAssetLifecycle(asset.lifecycle)) {
    throw new TypeError(`Persisted Asset has unsupported lifecycle: ${asset.lifecycle}`);
  }

  return {
    id: parseResourceId(asset.id),
    assetType: asset.assetType,
    technicalMetadata: {
      mimeType: asset.mimeType,
      sizeBytes: asset.sizeBytes,
    },
    storageReference: asset.storageReference,
    lifecycle: asset.lifecycle,
    createdAt: asset.createdAt,
    updatedAt: asset.updatedAt,
  };
}

export class PrismaAssetRepository implements AssetReader, AssetWriter {
  constructor(private readonly database: DatabaseClient | DatabaseTransactionClient) {}

  async findById(input: FindAssetByIdInput): Promise<Asset | null> {
    const asset = await this.database.asset.findUnique({
      where: {
        id: input.id,
      },
    });

    return asset ? mapPersistedAsset(asset) : null;
  }

  async create(input: CreateAssetRecordInput): Promise<Asset> {
    const asset = await this.database.asset.create({
      data: {
        id: input.id,
        assetType: input.assetType,
        mimeType: input.technicalMetadata.mimeType,
        sizeBytes: input.technicalMetadata.sizeBytes,
        storageReference: input.storageReference,
        lifecycle: input.lifecycle,
      },
    });

    return mapPersistedAsset(asset);
  }
}
