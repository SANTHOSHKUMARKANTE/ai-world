import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { PublicKnowledgeEntity } from './knowledge-entity';

export interface ListPublishedKnowledgeDiscoveryEntitiesInput {
  readonly universeKey: NamespacedKey;
  readonly resourceType?: NamespacedKey | undefined;
  readonly limit: number;
}

export interface PublicKnowledgeDiscoveryReader {
  listPublishedEntities(
    input: ListPublishedKnowledgeDiscoveryEntitiesInput,
  ): Promise<readonly PublicKnowledgeEntity[]>;
}
