import { apiRequest } from '../api/api-client';

export type PublicKnowledgeDiscoveryPreview = {
  readonly assetId: string;
  readonly assetType: 'IMAGE' | 'VIDEO';
  readonly mimeType: string;
  readonly playback: 'STILL' | 'SHORT_LOOP';
  readonly posterAssetId: string | null;
  readonly altText: string | null;
};

export type PublicKnowledgeDiscoveryItem = {
  readonly resourceId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly updatedAt: string;
  readonly previewMedia: PublicKnowledgeDiscoveryPreview | null;
};

interface PublicKnowledgeDiscoveryResponse {
  readonly items: readonly PublicKnowledgeDiscoveryItem[];
}

export interface ListPublicKnowledgeDiscoveryOptions {
  readonly universeKey: string;
  readonly resourceType?: string;
  readonly limit?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPreview(value: unknown): value is PublicKnowledgeDiscoveryPreview {
  if (!isRecord(value)) {
    return false;
  }

  const assetType = value.assetType;
  const playback = value.playback;
  const posterAssetId = value.posterAssetId;

  if (
    typeof value.assetId !== 'string' ||
    (assetType !== 'IMAGE' && assetType !== 'VIDEO') ||
    typeof value.mimeType !== 'string' ||
    (playback !== 'STILL' && playback !== 'SHORT_LOOP') ||
    (posterAssetId !== null && typeof posterAssetId !== 'string') ||
    (value.altText !== null && typeof value.altText !== 'string')
  ) {
    return false;
  }

  if (assetType === 'IMAGE') {
    return playback === 'STILL' && posterAssetId === null;
  }

  return playback === 'SHORT_LOOP' && typeof posterAssetId === 'string';
}

function isItem(value: unknown): value is PublicKnowledgeDiscoveryItem {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.resourceId === 'string' &&
    typeof value.universeKey === 'string' &&
    typeof value.resourceType === 'string' &&
    typeof value.slug === 'string' &&
    typeof value.displayName === 'string' &&
    typeof value.summary === 'string' &&
    typeof value.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(value.updatedAt)) &&
    (value.previewMedia === null || isPreview(value.previewMedia))
  );
}

function isResponse(value: unknown): value is PublicKnowledgeDiscoveryResponse {
  return isRecord(value) && Array.isArray(value.items) && value.items.every((item) => isItem(item));
}

export async function listPublicKnowledgeDiscovery(
  options: ListPublicKnowledgeDiscoveryOptions,
): Promise<readonly PublicKnowledgeDiscoveryItem[]> {
  const query = new URLSearchParams({
    universeKey: options.universeKey,
  });

  if (options.resourceType !== undefined) {
    query.set('resourceType', options.resourceType);
  }

  if (options.limit !== undefined) {
    query.set('limit', String(options.limit));
  }

  const response = await apiRequest(`/knowledge/discovery?${query.toString()}`);
  const payload: unknown = await response.json();

  if (!isResponse(payload)) {
    throw new Error('Public Knowledge discovery response did not match the expected Web contract.');
  }

  return payload.items;
}
