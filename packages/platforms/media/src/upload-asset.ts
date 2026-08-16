import { ApplicationError } from '@ai-world/foundation-errors';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { generateResourceId } from '@ai-world/kernel-identifiers';

import { ASSET_INITIAL_LIFECYCLE, type Asset } from './asset';
import type { AssetWriter } from './asset-writer';
import { validateMediaUpload } from './media-upload-policy';

export interface UploadAssetInput {
  readonly content: Uint8Array;
  readonly mimeType: string;
}

function invalidUpload(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.upload.invalid_input',
    kind: 'validation',
    message: `Media Asset upload failed canonical validation: ${error.message}`,
    publicMessage: 'The uploaded media file is invalid.',
    cause: error,
  });
}

export class UploadAsset {
  constructor(
    private readonly assetWriter: AssetWriter,
    private readonly storage: StorageObjectStore,
  ) {}

  async execute(input: UploadAssetInput): Promise<Asset> {
    let validated: ReturnType<typeof validateMediaUpload>;

    try {
      validated = validateMediaUpload(input.content, input.mimeType);
    } catch (error) {
      if (error instanceof TypeError) {
        throw invalidUpload(error);
      }

      throw error;
    }

    const id = generateResourceId();
    const storageReference = `media/assets/${id}/original`;

    await this.storage.writeObject({
      reference: storageReference,
      content: input.content,
    });

    try {
      return await this.assetWriter.create({
        id,
        assetType: validated.assetType,
        technicalMetadata: validated.technicalMetadata,
        storageReference,
        lifecycle: ASSET_INITIAL_LIFECYCLE,
      });
    } catch (error) {
      await this.storage.deleteObject(storageReference).catch(() => undefined);
      throw error;
    }
  }
}
