import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Page, PageLifecycle } from './page';

export interface TransitionPageLifecycleRecordInput {
  readonly id: ResourceId;
  readonly fromLifecycle: PageLifecycle;
  readonly toLifecycle: PageLifecycle;
}

export interface PageLifecycleWriter {
  transitionLifecycle(input: TransitionPageLifecycleRecordInput): Promise<Page | null>;
}
