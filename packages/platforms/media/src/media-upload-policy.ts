import { ASSET_IMAGE_TYPE, type AssetTechnicalMetadata, type AssetType } from './asset';

export const MEDIA_UPLOAD_MAX_BYTES = 10 * 1024 * 1024;

export const MEDIA_UPLOAD_PNG_MIME_TYPE = 'image/png' as const;
export const MEDIA_UPLOAD_JPEG_MIME_TYPE = 'image/jpeg' as const;

export type SupportedMediaUploadMimeType =
  typeof MEDIA_UPLOAD_PNG_MIME_TYPE | typeof MEDIA_UPLOAD_JPEG_MIME_TYPE;

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

function detectSupportedMimeType(content: Uint8Array): SupportedMediaUploadMimeType | null {
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
    declaredMimeType !== MEDIA_UPLOAD_JPEG_MIME_TYPE
  ) {
    throw new TypeError(
      'Uploaded media type is not supported. Initial upload supports image/png and image/jpeg.',
    );
  }

  const detectedMimeType = detectSupportedMimeType(content);

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
