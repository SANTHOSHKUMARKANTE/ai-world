import sharp from 'sharp';

import type {
  CreateImageThumbnailInput,
  ImageThumbnailProcessor,
  ProcessedImageThumbnail,
} from './image-thumbnail-processor';
import { MEDIA_UPLOAD_JPEG_MIME_TYPE, MEDIA_UPLOAD_PNG_MIME_TYPE } from './media-upload-policy';

export class SharpImageThumbnailProcessor implements ImageThumbnailProcessor {
  public async createThumbnail(input: CreateImageThumbnailInput): Promise<ProcessedImageThumbnail> {
    const pipeline = sharp(input.content, {
      autoOrient: true,
    }).resize({
      width: input.maxEdgePixels,
      height: input.maxEdgePixels,
      fit: 'inside',
      withoutEnlargement: true,
    });

    if (input.mimeType === MEDIA_UPLOAD_PNG_MIME_TYPE) {
      pipeline.png();
    } else if (input.mimeType === MEDIA_UPLOAD_JPEG_MIME_TYPE) {
      pipeline.jpeg();
    } else {
      input.mimeType satisfies never;
    }

    const { data, info } = await pipeline.toBuffer({
      resolveWithObject: true,
    });

    return {
      content: data,
      mimeType: input.mimeType,
      widthPixels: info.width,
      heightPixels: info.height,
    };
  }
}
