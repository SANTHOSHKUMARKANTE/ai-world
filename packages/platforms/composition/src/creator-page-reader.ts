import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { Page } from './page';

export interface ListCreatorPagesInput {
  readonly universeKey: NamespacedKey;
  readonly limit: number;
}

export interface CreatorPageReader {
  listForCreator(input: ListCreatorPagesInput): Promise<readonly Page[]>;
}
