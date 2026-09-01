import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { PublicKnowledgeEntity } from './knowledge-entity';

export interface FindPublishedKnowledgeEntityByResourceIdInput {
  readonly knowledgeResourceId: ResourceId;
}

export interface PublicKnowledgeEntityByResourceIdReader {
  findPublishedByResourceId(
    input: FindPublishedKnowledgeEntityByResourceIdInput,
  ): Promise<PublicKnowledgeEntity | null>;
}
