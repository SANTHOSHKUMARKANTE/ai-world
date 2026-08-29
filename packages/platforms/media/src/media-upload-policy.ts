import {
  ASSET_AUDIO_TYPE,
  ASSET_IMAGE_TYPE,
  ASSET_VIDEO_TYPE,
  type AssetTechnicalMetadata,
  type AssetType,
} from './asset';
import { inspectMp4Audio } from './mp4-audio';
import { inspectShortMp4Video } from './mp4-short-video';

export const MEDIA_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;
export const MEDIA_SHORT_VIDEO_MAX_DURATION_MS = 8000;

export const MEDIA_UPLOAD_PNG_MIME_TYPE = 'image/png' as const;
export const MEDIA_UPLOAD_JPEG_MIME_TYPE = 'image/jpeg' as const;
export const MEDIA_UPLOAD_MP4_MIME_TYPE = 'video/mp4' as const;
export const MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE = 'audio/mp4' as const;

export type SupportedImageUploadMimeType =
  typeof MEDIA_UPLOAD_PNG_MIME_TYPE | typeof MEDIA_UPLOAD_JPEG_MIME_TYPE;

export type SupportedMediaUploadMimeType =
  | SupportedImageUploadMimeType
  | typeof MEDIA_UPLOAD_MP4_MIME_TYPE
  | typeof MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE;

export interface ValidatedMediaUpload {
  readonly assetType: AssetType;
  readonly technicalMetadata: AssetTechnicalMetadata;
}

const PNG_SIGNATURE = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function startsWithBytes(content: Uint8Array, signature: Uint8Array): boolean {
  if (content.byteLength < signature.byteLength) {
    return false;
  }

  for (let index = 0; index < signature.byteLength; index += 1) {
    if (content[index] !== signature[index]) {
      return false;
    }
  }

  return true;
}

function detectSupportedImageMimeType(
  content: Uint8Array,
): typeof MEDIA_UPLOAD_PNG_MIME_TYPE | typeof MEDIA_UPLOAD_JPEG_MIME_TYPE | null {
  if (startsWithBytes(content, PNG_SIGNATURE)) {
    return MEDIA_UPLOAD_PNG_MIME_TYPE;
  }

  if (
    content.byteLength >= 3 &&
    content[0] === 0xff &&
    content[1] === 0xd8 &&
    content[2] === 0xff
  ) {
    return MEDIA_UPLOAD_JPEG_MIME_TYPE;
  }

  return null;
}

export function validateMediaUpload(
  content: Uint8Array,
  declaredMimeType: string,
): ValidatedMediaUpload {
  if (content.byteLength === 0) {
    throw new TypeError('Uploaded file must not be empty.');
  }

  if (content.byteLength > MEDIA_UPLOAD_MAX_BYTES) {
    throw new TypeError(`Uploaded file exceeds the ${MEDIA_UPLOAD_MAX_BYTES}-byte limit.`);
  }

  if (
    declaredMimeType !== MEDIA_UPLOAD_PNG_MIME_TYPE &&
    declaredMimeType !== MEDIA_UPLOAD_JPEG_MIME_TYPE &&
    declaredMimeType !== MEDIA_UPLOAD_MP4_MIME_TYPE &&
    declaredMimeType !== MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE
  ) {
    throw new TypeError(
      'Uploaded media type is not supported. Upload supports image/png, image/jpeg, bounded video/mp4 and AAC-LC audio/mp4.',
    );
  }

  if (declaredMimeType === MEDIA_UPLOAD_MP4_MIME_TYPE) {
    const inspection = inspectShortMp4Video(content);

    if (inspection.durationMs <= 0 || inspection.durationMs > MEDIA_SHORT_VIDEO_MAX_DURATION_MS) {
      throw new TypeError(
        `Uploaded MP4 duration must be between 1 and ${MEDIA_SHORT_VIDEO_MAX_DURATION_MS} milliseconds.`,
      );
    }

    return {
      assetType: ASSET_VIDEO_TYPE,
      technicalMetadata: {
        mimeType: MEDIA_UPLOAD_MP4_MIME_TYPE,
        sizeBytes: content.byteLength,
        durationMs: inspection.durationMs,
      },
    };
  }

  if (declaredMimeType === MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE) {
    const inspection = inspectMp4Audio(content);

    return {
      assetType: ASSET_AUDIO_TYPE,
      technicalMetadata: {
        mimeType: MEDIA_UPLOAD_AUDIO_MP4_MIME_TYPE,
        sizeBytes: content.byteLength,
        durationMs: inspection.durationMs,
      },
    };
  }

  const detectedMimeType = detectSupportedImageMimeType(content);

  if (!detectedMimeType) {
    throw new TypeError('Uploaded bytes do not match a supported PNG or JPEG file signature.');
  }

  if (detectedMimeType !== declaredMimeType) {
    throw new TypeError('Declared media type does not match the uploaded file signature.');
  }

  return {
    assetType: ASSET_IMAGE_TYPE,
    technicalMetadata: {
      mimeType: detectedMimeType,
      sizeBytes: content.byteLength,
    },
  };
}
