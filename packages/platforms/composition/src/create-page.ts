import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import {
  PAGE_INITIAL_LIFECYCLE,
  parsePagePresentationTitle,
  parsePageRoutePath,
  type Page,
  type PagePresentationMetadata,
  type PageRouteMetadata,
} from './page';
import type { PageWriter } from './page-writer';

export interface CreatePageInput {
  readonly universeKey: NamespacedKey;
  readonly route: PageRouteMetadata;
  readonly presentation: PagePresentationMetadata;
}

export class CreatePage {
  constructor(private readonly writer: PageWriter) {}

  async execute(input: CreatePageInput): Promise<Page> {
    const universeKey = parseNamespacedKey(input.universeKey);
    const routePath = parsePageRoutePath(input.route.path);
    const title = parsePagePresentationTitle(input.presentation.title);

    return this.writer.create({
      id: generateResourceId(),
      universeKey,
      routePath,
      title,
      lifecycle: PAGE_INITIAL_LIFECYCLE,
    });
  }
}
