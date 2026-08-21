import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { PageComposition } from './page-composition';
import type { PageCompositionStore } from './page-composition-store';
import type { PageReader } from './page-reader';

export interface GetPageCompositionInput {
  readonly pageId: ResourceId;
}

export class GetPageComposition {
  constructor(
    private readonly pages: PageReader,
    private readonly compositions: PageCompositionStore,
  ) {}

  async execute(input: GetPageCompositionInput): Promise<PageComposition | null> {
    const page = await this.pages.findById({ id: input.pageId });
    if (!page) {
      return null;
    }

    return {
      pageId: page.id,
      items: await this.compositions.listItems({ pageId: page.id }),
    };
  }
}
