import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Asset } from './asset';

export interface FindAssetByIdInput {
  readonly id: ResourceId;
}

export interface AssetReader {
  findById(input: FindAssetByIdInput): Promise<Asset | null>;
}
