import { apiRequest } from '../api/api-client';

export interface PublicDiscoverySearchResult {
  readonly resourceId: string;
  readonly resourceType: string;
  readonly universeKey?: string;
}

export interface PublicDiscoverySearchResponse {
  readonly items: readonly PublicDiscoverySearchResult[];
  readonly pagination: { readonly offset: number; readonly limit: number };
}

export interface PublicDiscoverySearchInput {
  readonly query: string;
  readonly universeKey?: string;
  readonly resourceTypes: readonly string[];
  readonly offset?: number;
  readonly limit?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isSearchResult(value: unknown): value is PublicDiscoverySearchResult {
  return (
    isRecord(value) &&
    typeof value.resourceId === 'string' &&
    typeof value.resourceType === 'string' &&
    (value.universeKey === undefined || typeof value.universeKey === 'string')
  );
}

function isSearchResponse(value: unknown): value is PublicDiscoverySearchResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.items) &&
    value.items.every(isSearchResult) &&
    isRecord(value.pagination) &&
    Number.isInteger(value.pagination.offset) &&
    Number.isInteger(value.pagination.limit)
  );
}

export async function searchPublicKnowledge(
  input: PublicDiscoverySearchInput,
): Promise<PublicDiscoverySearchResponse> {
  const query = new URLSearchParams({
    query: input.query,
    offset: String(input.offset ?? 0),
    limit: String(input.limit ?? 20),
  });

  if (input.universeKey !== undefined) {
    query.set('universeKey', input.universeKey);
  }
  for (const resourceType of input.resourceTypes) {
    query.append('resourceType', resourceType);
  }

  const response = await apiRequest(`/discovery/search?${query.toString()}`);
  const payload: unknown = await response.json();
  if (!isSearchResponse(payload)) {
    throw new Error('Public Discovery Search response did not match the expected Web contract.');
  }
  return payload;
}
