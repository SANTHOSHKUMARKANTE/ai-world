import type { ResourceId } from '@ai-world/kernel-identifiers';

export const ASSET_IMAGE_TYPE = 'IMAGE' as const;
export const ASSET_VIDEO_TYPE = 'VIDEO' as const;
export const ASSET_AUDIO_TYPE = 'AUDIO' as const;
export const ASSET_DOCUMENT_TYPE = 'DOCUMENT' as const;

export type AssetType =
  | typeof ASSET_IMAGE_TYPE
  | typeof ASSET_VIDEO_TYPE
  | typeof ASSET_AUDIO_TYPE
  | typeof ASSET_DOCUMENT_TYPE;

export const ASSET_INITIAL_LIFECYCLE = 'ACTIVE' as const;
export const ASSET_ARCHIVED_LIFECYCLE = 'ARCHIVED' as const;
export const ASSET_DELETED_LIFECYCLE = 'DELETED' as const;

export type AssetLifecycle =
  typeof ASSET_INITIAL_LIFECYCLE | typeof ASSET_ARCHIVED_LIFECYCLE | typeof ASSET_DELETED_LIFECYCLE;

export interface AssetTechnicalMetadata {
  readonly mimeType: string;
  readonly sizeBytes: number;
  readonly durationMs?: number;
}

export interface Asset {
  readonly id: ResourceId;
  readonly assetType: AssetType;
  readonly technicalMetadata: AssetTechnicalMetadata;
  readonly storageReference: string;
  readonly lifecycle: AssetLifecycle;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function isAssetType(value: unknown): value is AssetType {
  return (
    value === ASSET_IMAGE_TYPE ||
    value === ASSET_VIDEO_TYPE ||
    value === ASSET_AUDIO_TYPE ||
    value === ASSET_DOCUMENT_TYPE
  );
}

export function isAssetLifecycle(value: unknown): value is AssetLifecycle {
  return (
    value === ASSET_INITIAL_LIFECYCLE ||
    value === ASSET_ARCHIVED_LIFECYCLE ||
    value === ASSET_DELETED_LIFECYCLE
  );
}
