import type { ResourceId } from '@ai-world/kernel-identifiers';

import { ASSET_INITIAL_LIFECYCLE, type AssetType } from './asset';
import type { AssetReader } from './asset-reader';

export interface FindPublicMediaAssetDescriptorInput {
  readonly id: ResourceId;
}

export interface PublicMediaAssetDescriptor {
  readonly id: ResourceId;
  readonly assetType: AssetType;
  readonly mimeType: string;
  readonly width?: number;
  readonly height?: number;
  readonly durationMs?: number;
}

export interface PublicMediaAssetDescriptorReader {
  findById(input: FindPublicMediaAssetDescriptorInput): Promise<PublicMediaAssetDescriptor | null>;
}

export class ResolvePublicMediaAssetDescriptor implements PublicMediaAssetDescriptorReader {
  public constructor(private readonly assets: AssetReader) {}

  public async findById(
    input: FindPublicMediaAssetDescriptorInput,
  ): Promise<PublicMediaAssetDescriptor | null> {
    const asset = await this.assets.findById({ id: input.id });

    if (!asset || asset.lifecycle !== ASSET_INITIAL_LIFECYCLE) {
      return null;
    }

    return {
      id: asset.id,
      assetType: asset.assetType,
      mimeType: asset.technicalMetadata.mimeType,
      ...(asset.technicalMetadata.durationMs === undefined
        ? {}
        : { durationMs: asset.technicalMetadata.durationMs }),
    };
  }
}
