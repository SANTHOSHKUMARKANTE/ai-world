import { apiRequest } from '../api/api-client';

export interface PublicKnowledgeEntityFact {
  readonly key: string;
  readonly label: string;
  readonly value: string;
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
    readonly summary: string;
    readonly facts: readonly PublicKnowledgeEntityFact[];
  };
  readonly assetIds: readonly string[];
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

function isPublicKnowledgeEntity(value: unknown): value is PublicKnowledgeEntity {
  return (
    isRecord(value) &&
    isRecord(value.resource) &&
    typeof value.resource.id === 'string' &&
    typeof value.resource.universeKey === 'string' &&
    typeof value.resource.resourceType === 'string' &&
    isRecord(value.profile) &&
    typeof value.profile.slug === 'string' &&
    typeof value.profile.displayName === 'string' &&
    typeof value.profile.summary === 'string' &&
    Array.isArray(value.profile.facts) &&
    value.profile.facts.every(isFact) &&
    Array.isArray(value.assetIds) &&
    value.assetIds.every((assetId) => typeof assetId === 'string') &&
    Array.isArray(value.relations) &&
    value.relations.every(isRelation)
  );
}

export async function getPublicKnowledgeEntity(
  universeKey: string,
  slug: string,
): Promise<PublicKnowledgeEntity> {
  const response = await apiRequest(
    `/knowledge/entities/${encodeURIComponent(universeKey)}/${encodeURIComponent(slug)}`,
  );
  const payload: unknown = await response.json();

  if (!isPublicKnowledgeEntity(payload)) {
    throw new Error('Public Knowledge Entity response did not match the expected Web contract.');
  }

  return payload;
}
