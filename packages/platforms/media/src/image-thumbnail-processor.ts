import type { SupportedImageUploadMimeType } from './media-upload-policy';

export interface CreateImageThumbnailInput {
  readonly content: Uint8Array;
  readonly mimeType: SupportedImageUploadMimeType;
  readonly maxEdgePixels: number;
}

export interface ProcessedImageThumbnail {
  readonly content: Uint8Array;
  readonly mimeType: SupportedImageUploadMimeType;
  readonly widthPixels: number;
  readonly heightPixels: number;
}

export interface ImageThumbnailProcessor {
  createThumbnail(input: CreateImageThumbnailInput): Promise<ProcessedImageThumbnail>;
}
