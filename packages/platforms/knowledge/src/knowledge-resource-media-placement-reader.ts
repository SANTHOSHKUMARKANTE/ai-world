import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResourceMediaPlacement } from './knowledge-resource-media-placement';

export interface ListKnowledgeResourceMediaPlacementsInput {
  readonly knowledgeResourceId: ResourceId;
}

export interface KnowledgeResourceMediaPlacementReader {
  listMediaPlacements(
    input: ListKnowledgeResourceMediaPlacementsInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]>;
}
