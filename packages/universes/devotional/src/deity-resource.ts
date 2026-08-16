import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { DEVOTIONAL_DEITY_RESOURCE_TYPE, DEVOTIONAL_UNIVERSE_KEY } from './universe-definition';

export interface DeityResource extends KnowledgeResource {
  readonly universeKey: typeof DEVOTIONAL_UNIVERSE_KEY;

  readonly resourceType: typeof DEVOTIONAL_DEITY_RESOURCE_TYPE;

  readonly name: string;
}
