import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export const KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE = 'DRAFT' as const;

export const KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE = 'PUBLISHED' as const;

export const KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE = 'ARCHIVED' as const;

export type KnowledgeResourceLifecycle =
  | typeof KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE
  | typeof KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE
  | typeof KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE;

export interface KnowledgeResource {
  readonly id: ResourceId;

  readonly universeKey: NamespacedKey;

  readonly resourceType: NamespacedKey;

  readonly lifecycle: KnowledgeResourceLifecycle;

  readonly createdAt: Date;

  readonly updatedAt: Date;
}

export function isKnowledgeResourceLifecycle(value: unknown): value is KnowledgeResourceLifecycle {
  return (
    value === KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE ||
    value === KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE ||
    value === KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE
  );
}
