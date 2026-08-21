import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { PageCompositionItem } from './page-composition';

export interface ListPageCompositionItemsInput {
  readonly pageId: ResourceId;
}

export interface ReplacePageCompositionItemsInput {
  readonly pageId: ResourceId;
  readonly items: readonly PageCompositionItem[];
}

export interface PageCompositionStore {
  listItems(input: ListPageCompositionItemsInput): Promise<readonly PageCompositionItem[]>;

  replaceItems(input: ReplacePageCompositionItemsInput): Promise<readonly PageCompositionItem[]>;
}
