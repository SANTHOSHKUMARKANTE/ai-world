import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Asset, AssetLifecycle, AssetTechnicalMetadata, AssetType } from './asset';

export interface CreateAssetRecordInput {
  readonly id: ResourceId;
  readonly assetType: AssetType;
  readonly technicalMetadata: AssetTechnicalMetadata;
  readonly storageReference: string;
  readonly lifecycle: AssetLifecycle;
}

export interface AssetWriter {
  create(input: CreateAssetRecordInput): Promise<Asset>;
}
