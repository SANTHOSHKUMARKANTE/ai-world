import type { ResourceId } from '@ai-world/kernel-identifiers';

export interface ListKnowledgeResourceAssetIdsInput {
  readonly knowledgeResourceId: ResourceId;
}

export interface ReplaceKnowledgeResourceAssetIdsInput {
  readonly knowledgeResourceId: ResourceId;
  readonly assetIds: readonly ResourceId[];
}

export interface KnowledgeResourceAssetReferenceStore {
  listAssetIds(input: ListKnowledgeResourceAssetIdsInput): Promise<readonly ResourceId[]>;
  replaceAssetIds(input: ReplaceKnowledgeResourceAssetIdsInput): Promise<readonly ResourceId[]>;
}
