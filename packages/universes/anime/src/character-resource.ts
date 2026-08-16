import type { KnowledgeResource } from '@ai-world/platform-knowledge';

import { ANIME_CHARACTER_RESOURCE_TYPE, ANIME_UNIVERSE_KEY } from './universe-definition';

export interface CharacterResource extends KnowledgeResource {
  readonly universeKey: typeof ANIME_UNIVERSE_KEY;

  readonly resourceType: typeof ANIME_CHARACTER_RESOURCE_TYPE;

  readonly name: string;
}
