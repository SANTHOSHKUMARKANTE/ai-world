import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeResource } from './knowledge-resource';

export interface ListCreatorKnowledgeResourcesInput {
  readonly universeKey: NamespacedKey;
  readonly limit: number;
}

export interface CreatorKnowledgeResourceReader {
  listForCreator(input: ListCreatorKnowledgeResourcesInput): Promise<readonly KnowledgeResource[]>;
}
