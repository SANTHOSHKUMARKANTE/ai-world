import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE, DEVOTIONAL_UNIVERSE_KEY } from './universe-definition';

export interface ScriptureResource extends KnowledgeResource {
  readonly universeKey: typeof DEVOTIONAL_UNIVERSE_KEY;

  readonly resourceType: typeof DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE;

  readonly title: string;
}
