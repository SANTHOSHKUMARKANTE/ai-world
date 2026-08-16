import { apiRequest } from '../api/api-client';

export interface PublicKnowledgeResource {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

interface PublicKnowledgeResourceListResponse {
  readonly items: readonly PublicKnowledgeResource[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPublicKnowledgeResource(value: unknown): value is PublicKnowledgeResource {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.universeKey === 'string' &&
    typeof value.resourceType === 'string' &&
    typeof value.createdAt === 'string' &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(value.updatedAt))
  );
}

function isPublicKnowledgeResourceListResponse(
  value: unknown,
): value is PublicKnowledgeResourceListResponse {
  if (!isRecord(value) || !Array.isArray(value.items)) {
    return false;
  }

  return value.items.every(isPublicKnowledgeResource);
}

export async function listPublicKnowledgeResources(
  universeKey: string,
): Promise<readonly PublicKnowledgeResource[]> {
  const query = new URLSearchParams({
    universeKey,
  });

  const response = await apiRequest(`/knowledge/resources?${query.toString()}`);

  const payload: unknown = await response.json();

  if (!isPublicKnowledgeResourceListResponse(payload)) {
    throw new Error('Public Knowledge API response did not match the expected Web contract.');
  }

  return payload.items;
}
