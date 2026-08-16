import { ApplicationError } from '@ai-world/foundation-errors';
import { EvaluatePermission } from '@ai-world/platform-identity-access';

import type { Asset } from './asset';
import { MEDIA_ASSET_UPLOAD_PERMISSION_KEY } from './media-authorization-policy';
import { UploadAsset, type UploadAssetInput } from './upload-asset';

export interface UploadAssetAsActorInput extends UploadAssetInput {
  readonly actingActorId: string;
}

export class UploadAssetAsActor {
  constructor(
    private readonly evaluatePermission: EvaluatePermission,
    private readonly uploadAsset: UploadAsset,
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

    return this.uploadAsset.execute({
      content: input.content,
      mimeType: input.mimeType,
    });
  }
}
