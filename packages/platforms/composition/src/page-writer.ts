import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { Page, PageLifecycle } from './page';

export interface CreatePageRecordInput {
  readonly id: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly routePath: string;
  readonly title: string;
  readonly lifecycle: PageLifecycle;
}

export interface PageWriter {
  create(input: CreatePageRecordInput): Promise<Page>;
}
