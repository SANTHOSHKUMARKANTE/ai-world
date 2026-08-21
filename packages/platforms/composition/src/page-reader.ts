import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { Page } from './page';

export interface FindPageByIdInput {
  readonly id: ResourceId;
}

export interface FindPageByRouteInput {
  readonly universeKey: NamespacedKey;
  readonly routePath: string;
}

export interface PageReader {
  findById(input: FindPageByIdInput): Promise<Page | null>;

  findByRoute(input: FindPageByRouteInput): Promise<Page | null>;
}
