import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResourceMediaPlacement } from './knowledge-resource-media-placement';

export interface ListKnowledgeResourceAssetIdsInput {
  readonly knowledgeResourceId: ResourceId;
}

export interface ReplaceKnowledgeResourceMediaPlacementsInput {
  readonly knowledgeResourceId: ResourceId;
  readonly placements: readonly KnowledgeResourceMediaPlacement[];
}

export interface KnowledgeResourceAssetReferenceStore {
  listAssetIds(input: ListKnowledgeResourceAssetIdsInput): Promise<readonly ResourceId[]>;
  replaceMediaPlacements(
    input: ReplaceKnowledgeResourceMediaPlacementsInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]>;
}
