import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import type { KnowledgeResourceReader } from '@ai-world/platform-knowledge';
import type { MediaAssetReferenceResolver } from '@ai-world/platform-media';

import type { BlockReader } from './block-reader';
import {
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  isPageCompositionItemKind,
  type PageComposition,
  type PageCompositionItem,
  type PageCompositionItemKind,
  type PageCompositionReference,
} from './page-composition';
import type { PageCompositionStore } from './page-composition-store';
import type { Page } from './page';
import type { PageReader } from './page-reader';

export interface PageCompositionReferenceInput {
  readonly kind: PageCompositionItemKind;
  readonly id: string;
}

export interface SetPageCompositionInput {
  readonly pageId: ResourceId;
  readonly items: readonly PageCompositionReferenceInput[];
}

function missingPage(): TypeError {
  return new TypeError('Page composition requires an existing Page.');
}

function missingBlock(): TypeError {
  return new TypeError('Page composition requires an existing Block.');
}

function missingKnowledgeResource(): TypeError {
  return new TypeError('Page composition requires an existing Knowledge Resource.');
}

function universeMismatch(kind: PageCompositionItemKind): TypeError {
  return new TypeError(`${kind} must belong to the same Universe as the composed Page.`);
}

function unsupportedReferenceKind(): TypeError {
  return new TypeError('Page composition contains an unsupported reference kind.');
}

function immutablePage(lifecycle?: Page['lifecycle']): ApplicationError {
  return new ApplicationError({
    code: 'composition.page.lifecycle_conflict',
    kind: 'conflict',
    message: lifecycle
      ? `Page composition cannot be edited from lifecycle ${lifecycle}.`
      : 'Page composition cannot be edited because the Page no longer has the DRAFT lifecycle.',
    publicMessage: 'Published or archived Page composition cannot be edited.',
  });
}

export class SetPageComposition {
  constructor(
    private readonly pages: PageReader,
    private readonly blocks: BlockReader,
    private readonly knowledgeResources: KnowledgeResourceReader,
    private readonly mediaAssets: MediaAssetReferenceResolver,
    private readonly compositions: PageCompositionStore,
  ) {}

  async execute(input: SetPageCompositionInput): Promise<PageComposition> {
    const page = await this.pages.findById({ id: input.pageId });
    if (!page) {
      throw missingPage();
    }
    if (page.lifecycle !== 'DRAFT') {
      throw immutablePage(page.lifecycle);
    }

    const items: PageCompositionItem[] = [];
    for (const [position, reference] of input.items.entries()) {
      items.push({
        position,
        reference: await this.resolveReference(page, reference),
      });
    }

    const storedItems = await this.compositions.replaceItems({
      pageId: page.id,
      items,
    });
    if (!storedItems) {
      throw immutablePage();
    }

    return { pageId: page.id, items: storedItems };
  }

  private async resolveReference(
    page: Page,
    input: PageCompositionReferenceInput,
  ): Promise<PageCompositionReference> {
    if (!isPageCompositionItemKind(input.kind)) {
      throw unsupportedReferenceKind();
    }

    switch (input.kind) {
      case PAGE_COMPOSITION_BLOCK_ITEM_KIND: {
        const id = parseResourceId(input.id);
        const block = await this.blocks.findById({ id });
        if (!block) {
          throw missingBlock();
        }
        if (block.universeKey !== page.universeKey) {
          throw universeMismatch(input.kind);
        }
        return { kind: input.kind, id: block.id };
      }

      case PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND: {
        const id = parseResourceId(input.id);
        const resource = await this.knowledgeResources.findById({ id });
        if (!resource) {
          throw missingKnowledgeResource();
        }
        if (resource.universeKey !== page.universeKey) {
          throw universeMismatch(input.kind);
        }
        return { kind: input.kind, id: resource.id };
      }

      case PAGE_COMPOSITION_MEDIA_ITEM_KIND: {
        const asset = await this.mediaAssets.resolve({ id: input.id });
        return { kind: input.kind, id: asset.id };
      }
    }
  }
}
