import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { KnowledgeResource, KnowledgeResourceLifecycle } from './knowledge-resource';

export interface CreateKnowledgeResourceRecordInput {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly resourceType: NamespacedKey;
  readonly lifecycle: KnowledgeResourceLifecycle;
}

export interface UpdateKnowledgeResourceTypeRecordInput {
  readonly id: ResourceId;
  readonly resourceType: NamespacedKey;
}

export interface KnowledgeResourceWriter {
  create(input: CreateKnowledgeResourceRecordInput): Promise<KnowledgeResource>;

  updateResourceType(
    input: UpdateKnowledgeResourceTypeRecordInput,
  ): Promise<KnowledgeResource | null>;
}
