export const DEVOTIONAL_UNIVERSE_KEY = 'universe.devotional' as const;

export const DEVOTIONAL_DEITY_RESOURCE_TYPE = 'devotional.deity' as const;

export const DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE = 'devotional.scripture' as const;

export const DEVOTIONAL_TEMPLE_RESOURCE_TYPE = 'devotional.temple' as const;

export const DEVOTIONAL_RESOURCE_TYPES = [
  DEVOTIONAL_DEITY_RESOURCE_TYPE,
  DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
  DEVOTIONAL_TEMPLE_RESOURCE_TYPE,
] as const;

export type DevotionalResourceType = (typeof DEVOTIONAL_RESOURCE_TYPES)[number];

export const DEVOTIONAL_UNIVERSE_DEFINITION = {
  key: DEVOTIONAL_UNIVERSE_KEY,
  resourceTypes: DEVOTIONAL_RESOURCE_TYPES,
} as const;

export type DevotionalUniverseDefinition = typeof DEVOTIONAL_UNIVERSE_DEFINITION;
