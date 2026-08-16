import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { ANIME_SERIES_RESOURCE_TYPE, ANIME_UNIVERSE_KEY } from './universe-definition';

export interface SeriesResource extends KnowledgeResource {
  readonly universeKey: typeof ANIME_UNIVERSE_KEY;

  readonly resourceType: typeof ANIME_SERIES_RESOURCE_TYPE;

  readonly title: string;
}
