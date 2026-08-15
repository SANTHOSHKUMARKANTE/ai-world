import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResource } from './knowledge-resource';

export interface FindKnowledgeResourceByIdInput {
  readonly id: ResourceId;
}

export interface KnowledgeResourceReader {
  findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null>;
}
