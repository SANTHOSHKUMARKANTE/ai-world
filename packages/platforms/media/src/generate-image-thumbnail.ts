import { ApplicationError } from '@ai-world/foundation-errors';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import { ASSET_IMAGE_TYPE, ASSET_INITIAL_LIFECYCLE } from './asset';
import type { AssetReader } from './asset-reader';
import type { ImageThumbnailProcessor } from './image-thumbnail-processor';
import {
  MEDIA_UPLOAD_JPEG_MIME_TYPE,
  MEDIA_UPLOAD_PNG_MIME_TYPE,
  type SupportedMediaUploadMimeType,
} from './media-upload-policy';

export const MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS = 320 as const;

export interface GenerateImageThumbnailInput {
  readonly id: string;
}

export interface GeneratedImageThumbnail {
  readonly id: ResourceId;
  readonly content: Uint8Array;
  readonly mimeType: SupportedMediaUploadMimeType;
  readonly widthPixels: number;
  readonly heightPixels: number;
}

function invalidAssetId(cause: unknown): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.thumbnail.invalid_asset_id',
    kind: 'validation',
    message: 'Media image thumbnail generation requires a valid Resource ID.',
    publicMessage: 'The Media Asset identifier is invalid.',
    cause,
  });
}

function thumbnailNotAvailable(): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.thumbnail.not_found',
    kind: 'not_found',
    message:
      'No ACTIVE initial image Asset is available for thumbnail generation under the supplied Resource ID.',
    publicMessage: 'Media Asset thumbnail not found.',
  });
}

function isSupportedThumbnailMimeType(mimeType: string): mimeType is SupportedMediaUploadMimeType {
  return mimeType === MEDIA_UPLOAD_PNG_MIME_TYPE || mimeType === MEDIA_UPLOAD_JPEG_MIME_TYPE;
}

export class GenerateImageThumbnail {
  public constructor(
    private readonly reader: AssetReader,
    private readonly storage: StorageObjectStore,
    private readonly processor: ImageThumbnailProcessor,
  ) {}

  public async execute(input: GenerateImageThumbnailInput): Promise<GeneratedImageThumbnail> {
    let id: ResourceId;

    try {
      id = parseResourceId(input.id);
    } catch (cause) {
      throw invalidAssetId(cause);
    }

    const asset = await this.reader.findById({ id });

    if (
      !asset ||
      asset.lifecycle !== ASSET_INITIAL_LIFECYCLE ||
      asset.assetType !== ASSET_IMAGE_TYPE ||
      !isSupportedThumbnailMimeType(asset.technicalMetadata.mimeType)
    ) {
      throw thumbnailNotAvailable();
    }

    const source = await this.storage.readObject(asset.storageReference);

    if (source.byteLength !== asset.technicalMetadata.sizeBytes) {
      throw new Error(
        `Stored Media Asset size does not match canonical technical metadata for thumbnail source ${asset.id}.`,
      );
    }

    const thumbnail = await this.processor.createThumbnail({
      content: source,
      mimeType: asset.technicalMetadata.mimeType,
      maxEdgePixels: MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS,
    });

    if (
      thumbnail.content.byteLength === 0 ||
      thumbnail.mimeType !== asset.technicalMetadata.mimeType ||
      thumbnail.widthPixels < 1 ||
      thumbnail.heightPixels < 1 ||
      thumbnail.widthPixels > MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS ||
      thumbnail.heightPixels > MEDIA_IMAGE_THUMBNAIL_MAX_EDGE_PIXELS
    ) {
      throw new Error(
        `Media image thumbnail processor returned an invalid result for Asset ${asset.id}.`,
      );
    }

    return {
      id: asset.id,
      content: thumbnail.content,
      mimeType: thumbnail.mimeType,
      widthPixels: thumbnail.widthPixels,
      heightPixels: thumbnail.heightPixels,
    };
  }
}
