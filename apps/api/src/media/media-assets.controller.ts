import { ApplicationError } from '@ai-world/foundation-errors';
import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  DeliverAsset,
  MEDIA_UPLOAD_MAX_BYTES,
  UploadAssetAsActor,
  type Asset,
} from '@ai-world/platform-media';
import {
  Controller,
  Get,
  Headers,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { MediaUploadPreauthorizationGuard } from './media-upload-preauthorization.guard';

interface UploadedMediaFile {
  readonly buffer: Buffer;
  readonly mimetype: string;
  readonly size: number;
}

export interface MediaAssetUploadResponse {
  readonly id: string;
  readonly assetType: Asset['assetType'];
  readonly technicalMetadata: Asset['technicalMetadata'];
  readonly lifecycle: Asset['lifecycle'];
  readonly createdAt: string;
  readonly updatedAt: string;
}

function missingUploadFile(): ApplicationError {
  return new ApplicationError({
    code: 'media.asset.upload.invalid_input',
    kind: 'validation',
    message: 'Media Asset upload requires one multipart file field named "file".',
    publicMessage: 'The uploaded media file is invalid.',
  });
}

function toResponse(asset: Asset): MediaAssetUploadResponse {
  return {
    id: asset.id,
    assetType: asset.assetType,
    technicalMetadata: asset.technicalMetadata,
    lifecycle: asset.lifecycle,
    createdAt: asset.createdAt.toISOString(),
    updatedAt: asset.updatedAt.toISOString(),
  };
}

@Controller('media/assets')
export class MediaAssetsController {
  public constructor(
    private readonly deliverAsset: DeliverAsset,
    private readonly validateSession: ValidateSession,
    private readonly uploadAssetAsActor: UploadAssetAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActingActorId(cookieHeader: string | undefined): Promise<string> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

    return session.actorId;
  }

  @Get(':id/content')
  public async deliverAssetContent(@Param('id') id: string): Promise<StreamableFile> {
    const delivery = await this.deliverAsset.execute({ id });

    return new StreamableFile(Buffer.from(delivery.content), {
      type: delivery.technicalMetadata.mimeType,
      length: delivery.content.byteLength,
    });
  }

  @Post()
  @UseGuards(MediaUploadPreauthorizationGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: MEDIA_UPLOAD_MAX_BYTES,
        files: 1,
      },
    }),
  )
  public async uploadAsset(
    @Headers('cookie') cookieHeader: string | undefined,
    @UploadedFile() file: UploadedMediaFile | undefined,
  ): Promise<MediaAssetUploadResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);

    if (!file || file.size !== file.buffer.byteLength) {
      throw missingUploadFile();
    }

    const asset = await this.uploadAssetAsActor.execute({
      actingActorId,
      content: file.buffer,
      mimeType: file.mimetype,
    });

    return toResponse(asset);
  }
}
