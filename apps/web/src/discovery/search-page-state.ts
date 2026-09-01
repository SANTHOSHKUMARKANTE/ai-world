const SEARCH_UNIVERSE_KEYS = new Set(['universe.devotional', 'universe.anime']);

const SEARCH_RESOURCE_TYPES = new Set([
  'devotional.deity',
  'devotional.scripture',
  'devotional.temple',
  'anime.character',
  'anime.series',
]);

export interface SearchPageState {
  readonly query: string;
  readonly universeKey: string;
  readonly resourceTypes: readonly string[];
  readonly offset: number;
}

type SearchParamValue = string | readonly string[] | undefined;

function first(value: SearchParamValue): string | undefined {
  return typeof value === 'string' ? value : value?.[0];
}

function all(value: SearchParamValue): readonly string[] {
  if (value === undefined) {
    return [];
  }

  return typeof value === 'string' ? [value] : value;
}

export function parseSearchPageState(
  params: Readonly<Record<string, SearchParamValue>>,
): SearchPageState {
  const query = first(params.query)?.trim().slice(0, 256) ?? '';
  const requestedUniverseKey = first(params.universeKey);
  const universeKey =
    requestedUniverseKey && SEARCH_UNIVERSE_KEYS.has(requestedUniverseKey)
      ? requestedUniverseKey
      : '';
  const resourceTypes = [
    ...new Set(all(params.resourceType).filter((value) => SEARCH_RESOURCE_TYPES.has(value))),
  ];
  const requestedOffset = Number(first(params.offset) ?? 0);
  const offset =
    Number.isSafeInteger(requestedOffset) && requestedOffset >= 0 ? requestedOffset : 0;

  return { query, universeKey, resourceTypes, offset };
}
