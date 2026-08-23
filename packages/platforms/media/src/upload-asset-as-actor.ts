import { ApplicationError } from '@ai-world/foundation-errors';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import type { Asset } from './asset';
import {
  MEDIA_ASSET_AUDIT_RESOURCE_TYPE,
  MEDIA_ASSET_CREATED_AUDIT_RESULT,
  MEDIA_ASSET_UPLOAD_AUDIT_ACTION,
} from './media-audit-policy';
import type { MediaAssetUploadTransaction } from './media-asset-upload-transaction';
import { MEDIA_ASSET_UPLOAD_PERMISSION_KEY } from './media-authorization-policy';
import { UploadAsset, type UploadAssetInput } from './upload-asset';

export interface UploadAssetAsActorInput extends UploadAssetInput {
  readonly actingActorId: string;
}

export class UploadAssetAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly transaction: MediaAssetUploadTransaction,
    private readonly storage: StorageObjectStore,
  ) {}

  async authorize(actingActorId: string): Promise<void> {
    const evaluation = await this.evaluatePermission.execute({
      actorId: actingActorId,
      permissionKey: MEDIA_ASSET_UPLOAD_PERMISSION_KEY,
    });

    if (!evaluation.allowed) {
      throw new ApplicationError({
        code: 'media.authorization.forbidden',
        kind: 'forbidden',
        message:
          'Media Asset upload was denied because the acting Actor does not have the required Permission.',
        publicMessage: 'You do not have permission to perform this action.',
      });
    }
  }

  async execute(input: UploadAssetAsActorInput): Promise<Asset> {
    await this.authorize(input.actingActorId);

    let uploadedAsset: Asset | undefined;

    try {
      return await this.transaction.execute(async ({ assetWriter, auditRecorder }) => {
        const uploadAsset = new UploadAsset(assetWriter, this.storage);

        const asset = await uploadAsset.execute({
          content: input.content,
          mimeType: input.mimeType,
        });

        uploadedAsset = asset;

        await auditRecorder.record({
          actorId: input.actingActorId,
          action: MEDIA_ASSET_UPLOAD_AUDIT_ACTION,
          resource: {
            type: MEDIA_ASSET_AUDIT_RESOURCE_TYPE,
            id: asset.id,
          },
          result: MEDIA_ASSET_CREATED_AUDIT_RESULT,
          context: {
            assetType: asset.assetType,
            mimeType: asset.technicalMetadata.mimeType,
            sizeBytes: asset.technicalMetadata.sizeBytes,
            ...(asset.technicalMetadata.durationMs === undefined
              ? {}
              : { durationMs: asset.technicalMetadata.durationMs }),
            lifecycle: asset.lifecycle,
          },
        });

        return asset;
      });
    } catch (error) {
      if (uploadedAsset) {
        await this.storage.deleteObject(uploadedAsset.storageReference).catch(() => undefined);
      }

      throw error;
    }
  }
}
