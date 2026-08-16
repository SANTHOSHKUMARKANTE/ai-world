export const ANIME_UNIVERSE_KEY = 'universe.anime' as const;

export const ANIME_CHARACTER_RESOURCE_TYPE = 'anime.character' as const;

export const ANIME_SERIES_RESOURCE_TYPE = 'anime.series' as const;

export const ANIME_RESOURCE_TYPES = [
  ANIME_CHARACTER_RESOURCE_TYPE,
  ANIME_SERIES_RESOURCE_TYPE,
] as const;

export type AnimeResourceType = (typeof ANIME_RESOURCE_TYPES)[number];

export const ANIME_UNIVERSE_DEFINITION = {
  key: ANIME_UNIVERSE_KEY,
  resourceTypes: ANIME_RESOURCE_TYPES,
} as const;

export type AnimeUniverseDefinition = typeof ANIME_UNIVERSE_DEFINITION;
