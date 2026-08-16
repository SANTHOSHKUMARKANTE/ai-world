import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { DEVOTIONAL_TEMPLE_RESOURCE_TYPE, DEVOTIONAL_UNIVERSE_KEY } from './universe-definition';

export interface TempleResource extends KnowledgeResource {
  readonly universeKey: typeof DEVOTIONAL_UNIVERSE_KEY;

  readonly resourceType: typeof DEVOTIONAL_TEMPLE_RESOURCE_TYPE;

  readonly name: string;
}
