import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeEntityConfiguration } from './knowledge-entity';

export interface FindKnowledgeEntityConfigurationByResourceIdInput {
  readonly knowledgeResourceId: ResourceId;
}

export interface KnowledgeEntityConfigurationReader {
  findConfigurationByResourceId(
    input: FindKnowledgeEntityConfigurationByResourceIdInput,
  ): Promise<KnowledgeEntityConfiguration | null>;
}
