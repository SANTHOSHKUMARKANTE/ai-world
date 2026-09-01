import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export interface GlobalSearchScope {
  readonly kind: 'global';
}

export interface UniverseSearchScope {
  readonly kind: 'universe';
  readonly universeKey: NamespacedKey;
}

export type SearchScope = GlobalSearchScope | UniverseSearchScope;

export interface SearchFilter {
  readonly resourceTypes: readonly NamespacedKey[];
}

export interface SearchPagination {
  readonly offset: number;
  readonly limit: number;
}

export interface SearchRequest {
  readonly query: string;
  readonly scope: SearchScope;
  readonly filter: SearchFilter;
  readonly pagination: SearchPagination;
}

export interface SearchResult {
  readonly resourceId: ResourceId;
  readonly resourceType: NamespacedKey;
  readonly universeKey?: NamespacedKey;
  readonly slug?: string;
  readonly displayName?: string;
  readonly summary?: string;
}

export interface SearchResultPage {
  readonly items: readonly SearchResult[];
  readonly pagination: SearchPagination;
}

export interface SearchContract {
  search(input: SearchRequest): Promise<SearchResultPage>;
}
