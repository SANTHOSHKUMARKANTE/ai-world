import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeResource } from './knowledge-resource';

export interface FindPublishedKnowledgeResourceByIdInput {
  readonly id: ResourceId;
}

export interface ListPublishedKnowledgeResourcesInput {
  readonly universeKey: NamespacedKey;
  readonly resourceType?: NamespacedKey;
  readonly limit: number;
}

export interface PublicKnowledgeResourceReader {
  findPublishedById(
    input: FindPublishedKnowledgeResourceByIdInput,
  ): Promise<KnowledgeResource | null>;

  listPublished(input: ListPublishedKnowledgeResourcesInput): Promise<readonly KnowledgeResource[]>;
}
