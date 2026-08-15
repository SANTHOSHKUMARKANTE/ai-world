import type { KnowledgeResource } from '@ai-world/platform-knowledge';

export const DEVOTIONAL_UNIVERSE_KEY = 'universe.devotional' as const;

export const DEVOTIONAL_DEITY_RESOURCE_TYPE = 'devotional.deity' as const;

export interface DeityResource extends KnowledgeResource {
  readonly universeKey: typeof DEVOTIONAL_UNIVERSE_KEY;

  readonly resourceType: typeof DEVOTIONAL_DEITY_RESOURCE_TYPE;

  readonly name: string;
}
