import { apiRequest } from '../api/api-client';

export type PublicKnowledgeEntityAssetType = 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT';
export type PublicKnowledgeEntityMediaRole = 'HERO' | 'GALLERY' | 'HIGHLIGHT';
export type PublicKnowledgeEntityMediaPlayback = 'STILL' | 'SHORT_LOOP';

export interface PublicKnowledgeEntityFact {
  readonly key: string;
  readonly label: string;
  readonly value: string;
}

export interface PublicKnowledgeEntityMedia {
  readonly assetId: string;
  readonly assetType: PublicKnowledgeEntityAssetType;
  readonly mimeType: string;
  readonly role: PublicKnowledgeEntityMediaRole;
  readonly playback: PublicKnowledgeEntityMediaPlayback;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly width?: number;
  readonly height?: number;
  readonly durationMs?: number;
  readonly posterAssetId: string | null;
}

export interface PublicKnowledgeEntityRelation {
  readonly sectionKey: string;
  readonly relationshipType: string;
  readonly position: number;
  readonly target: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
    readonly slug: string;
    readonly displayName: string;
    readonly summary: string;
    readonly previewAssetId: string | null;
  };
}

export interface PublicKnowledgeEntity {
  readonly resource: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
  };
  readonly profile: {
    readonly slug: string;
    readonly displayName: string;
    readonly nativeName: string | null;
    readonly alternateNames: readonly string[];
    readonly summary: string;
    readonly overview: string | null;
    readonly facts: readonly PublicKnowledgeEntityFact[];
  };
  readonly media: readonly PublicKnowledgeEntityMedia[];
  readonly relations: readonly PublicKnowledgeEntityRelation[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isFact(value: unknown): value is PublicKnowledgeEntityFact {
  return (
    isRecord(value) &&
    typeof value.key === 'string' &&
    typeof value.label === 'string' &&
    typeof value.value === 'string'
  );
}

function isAssetType(value: unknown): value is PublicKnowledgeEntityAssetType {
  return value === 'IMAGE' || value === 'VIDEO' || value === 'AUDIO' || value === 'DOCUMENT';
}

function isMediaRole(value: unknown): value is PublicKnowledgeEntityMediaRole {
  return value === 'HERO' || value === 'GALLERY' || value === 'HIGHLIGHT';
}

function isMediaPlayback(value: unknown): value is PublicKnowledgeEntityMediaPlayback {
  return value === 'STILL' || value === 'SHORT_LOOP';
}

function isOptionalPositiveInteger(value: unknown): boolean {
  return value === undefined || (Number.isInteger(value) && Number(value) > 0);
}

function isMedia(value: unknown): value is PublicKnowledgeEntityMedia {
  return (
    isRecord(value) &&
    typeof value.assetId === 'string' &&
    isAssetType(value.assetType) &&
    typeof value.mimeType === 'string' &&
    isMediaRole(value.role) &&
    isMediaPlayback(value.playback) &&
    Number.isInteger(value.position) &&
    Number(value.position) >= 0 &&
    (typeof value.altText === 'string' || value.altText === null) &&
    (typeof value.caption === 'string' || value.caption === null) &&
    isOptionalPositiveInteger(value.width) &&
    isOptionalPositiveInteger(value.height) &&
    isOptionalPositiveInteger(value.durationMs) &&
    (typeof value.posterAssetId === 'string' || value.posterAssetId === null)
  );
}

function isRelation(value: unknown): value is PublicKnowledgeEntityRelation {
  return (
    isRecord(value) &&
    typeof value.sectionKey === 'string' &&
    typeof value.relationshipType === 'string' &&
    Number.isInteger(value.position) &&
    isRecord(value.target) &&
    typeof value.target.id === 'string' &&
    typeof value.target.universeKey === 'string' &&
    typeof value.target.resourceType === 'string' &&
    typeof value.target.slug === 'string' &&
    typeof value.target.displayName === 'string' &&
    typeof value.target.summary === 'string' &&
    (typeof value.target.previewAssetId === 'string' || value.target.previewAssetId === null)
  );
}

function isOptionalNullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string';
}

function isOptionalStringArray(value: unknown): value is readonly string[] | undefined {
  return (
    value === undefined || (Array.isArray(value) && value.every((item) => typeof item === 'string'))
  );
}

export function parsePublicKnowledgeEntity(value: unknown): PublicKnowledgeEntity | null {
  if (
    !isRecord(value) ||
    'assetIds' in value ||
    !isRecord(value.resource) ||
    typeof value.resource.id !== 'string' ||
    typeof value.resource.universeKey !== 'string' ||
    typeof value.resource.resourceType !== 'string' ||
    !isRecord(value.profile) ||
    typeof value.profile.slug !== 'string' ||
    typeof value.profile.displayName !== 'string' ||
    typeof value.profile.summary !== 'string' ||
    !isOptionalNullableString(value.profile.nativeName) ||
    !isOptionalStringArray(value.profile.alternateNames) ||
    !isOptionalNullableString(value.profile.overview) ||
    !Array.isArray(value.profile.facts) ||
    !value.profile.facts.every(isFact) ||
    !Array.isArray(value.media) ||
    !value.media.every(isMedia) ||
    !Array.isArray(value.relations) ||
    !value.relations.every(isRelation)
  ) {
    return null;
  }

  return {
    resource: {
      id: value.resource.id,
      universeKey: value.resource.universeKey,
      resourceType: value.resource.resourceType,
    },
    profile: {
      slug: value.profile.slug,
      displayName: value.profile.displayName,
      nativeName: value.profile.nativeName ?? null,
      alternateNames: value.profile.alternateNames ?? [],
      summary: value.profile.summary,
      overview: value.profile.overview ?? null,
      facts: value.profile.facts,
    },
    media: value.media,
    relations: value.relations,
  };
}

export async function getPublicKnowledgeEntity(
  universeKey: string,
  slug: string,
): Promise<PublicKnowledgeEntity> {
  const response = await apiRequest(
    `/knowledge/entities/${encodeURIComponent(universeKey)}/${encodeURIComponent(slug)}`,
  );
  const payload: unknown = await response.json();
  const entity = parsePublicKnowledgeEntity(payload);

  if (!entity) {
    throw new Error('Public Knowledge Entity response did not match the expected Web contract.');
  }

  return entity;
}
