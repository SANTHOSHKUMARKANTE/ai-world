import { ApplicationError } from '@ai-world/foundation-errors';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import {
  ASSET_AUDIO_TYPE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  ASSET_VIDEO_TYPE,
  type Asset,
  type AssetTechnicalMetadata,
} from './asset';
import type { AssetReader } from './asset-reader';
import {
  MEDIA_SHORT_VIDEO_MAX_DURATION_MS,
  MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE,
  MEDIA_UPLOAD_MP4_MIME_TYPE,
} from './media-upload-policy';

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
      'No ACTIVE supported Media Asset is available for delivery under the supplied Resource ID.',
    publicMessage: 'Media Asset not found.',
  });
}

function isPositiveIntegerDuration(value: number | undefined): value is number {
  return value !== undefined && Number.isInteger(value) && value > 0;
}

function isBoundedDeliverableVideo(asset: Asset): boolean {
  const durationMs = asset.technicalMetadata.durationMs;

  return (
    asset.assetType === ASSET_VIDEO_TYPE &&
    asset.technicalMetadata.mimeType === MEDIA_UPLOAD_MP4_MIME_TYPE &&
    isPositiveIntegerDuration(durationMs) &&
    durationMs <= MEDIA_SHORT_VIDEO_MAX_DURATION_MS
  );
}

function isDeliverableAudio(asset: Asset): boolean {
  return (
    asset.assetType === ASSET_AUDIO_TYPE &&
    asset.technicalMetadata.mimeType === MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE &&
    isPositiveIntegerDuration(asset.technicalMetadata.durationMs)
  );
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
      (asset.assetType !== ASSET_IMAGE_TYPE &&
        !isBoundedDeliverableVideo(asset) &&
        !isDeliverableAudio(asset))
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
