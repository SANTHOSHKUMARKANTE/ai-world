import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { KnowledgeResource, KnowledgeResourceLifecycle } from './knowledge-resource';

export interface TransitionKnowledgeResourceLifecycleRecordInput {
  readonly id: ResourceId;
  readonly fromLifecycle: KnowledgeResourceLifecycle;
  readonly toLifecycle: KnowledgeResourceLifecycle;
}

export interface KnowledgeResourceLifecycleWriter {
  transitionLifecycle(
    input: TransitionKnowledgeResourceLifecycleRecordInput,
  ): Promise<KnowledgeResource | null>;
}
