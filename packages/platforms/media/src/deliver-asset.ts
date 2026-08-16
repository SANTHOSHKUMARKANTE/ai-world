import { ApplicationError } from '@ai-world/foundation-errors';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import { ASSET_IMAGE_TYPE, ASSET_INITIAL_LIFECYCLE, type AssetTechnicalMetadata } from './asset';
import type { AssetReader } from './asset-reader';

export interface DeliverAssetInput {
  readonly id: string;
}

export interface DeliveredAsset {
  readonly id: string;
  readonly technicalMetadata: AssetTechnicalMetadata;
  readonly content: Uint8Array;
}

function invalidAssetId(cause: unknown): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.delivery.invalid_asset_id',
    kind: 'validation',
    message: 'Media Asset delivery requires a valid Resource ID.',
    publicMessage: 'The Media Asset identifier is invalid.',
    cause,
  });
}

function assetNotDeliverable(): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.delivery.not_found',
    kind: 'not_found',
    message:
      'No ACTIVE initial Media Asset is available for delivery under the supplied Resource ID.',
    publicMessage: 'Media Asset not found.',
  });
}

export class DeliverAsset {
  public constructor(
    private readonly reader: AssetReader,
    private readonly storage: StorageObjectStore,
  ) {}

  public async execute(input: DeliverAssetInput): Promise<DeliveredAsset> {
    let id;

    try {
      id = parseResourceId(input.id);
    } catch (cause) {
      throw invalidAssetId(cause);
    }

    const asset = await this.reader.findById({ id });

    if (
      !asset ||
      asset.lifecycle !== ASSET_INITIAL_LIFECYCLE ||
      asset.assetType !== ASSET_IMAGE_TYPE
    ) {
      throw assetNotDeliverable();
    }

    const content = await this.storage.readObject(asset.storageReference);

    if (content.byteLength !== asset.technicalMetadata.sizeBytes) {
      throw new Error(
        `Stored Media Asset size does not match canonical technical metadata for Asset ${asset.id}.`,
      );
    }

    return {
      id: asset.id,
      technicalMetadata: asset.technicalMetadata,
      content,
    };
  }
}
