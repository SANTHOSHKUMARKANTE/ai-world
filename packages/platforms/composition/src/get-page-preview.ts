import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { KnowledgeResourceReader } from '@ai-world/platform-knowledge';
import type { MediaAssetReferenceResolver } from '@ai-world/platform-media';

import type { BlockReader } from './block-reader';
import {
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  type PageCompositionItem,
} from './page-composition';
import type { PageCompositionStore } from './page-composition-store';
import { toPagePreviewPage, type PagePreview, type PagePreviewItem } from './page-preview';
import type { Page } from './page';
import type { PageReader } from './page-reader';

export interface GetPagePreviewInput {
  readonly pageId: ResourceId;
}

function missingPreviewReference(kind: PageCompositionItem['reference']['kind']): TypeError {
  return new TypeError(`Page preview requires an available ${kind} reference.`);
}

function universeMismatch(kind: PageCompositionItem['reference']['kind']): TypeError {
  return new TypeError(`${kind} must belong to the same Universe as the previewed Page.`);
}

export class GetPagePreview {
  constructor(
    private readonly pages: PageReader,
    private readonly blocks: BlockReader,
    private readonly knowledgeResources: KnowledgeResourceReader,
    private readonly mediaAssets: MediaAssetReferenceResolver,
    private readonly compositions: PageCompositionStore,
  ) {}

  async execute(input: GetPagePreviewInput): Promise<PagePreview | null> {
    const page = await this.pages.findById({ id: input.pageId });
    if (!page) {
      return null;
    }

    const composition = await this.compositions.listItems({ pageId: page.id });
    const items: PagePreviewItem[] = [];

    for (const item of composition) {
      items.push(await this.resolveItem(page, item));
    }

    return {
      page: toPagePreviewPage(page),
      items,
    };
  }

  private async resolveItem(page: Page, item: PageCompositionItem): Promise<PagePreviewItem> {
    switch (item.reference.kind) {
      case PAGE_COMPOSITION_BLOCK_ITEM_KIND: {
        const block = await this.blocks.findById({ id: item.reference.id });
        if (!block) {
          throw missingPreviewReference(item.reference.kind);
        }
        if (block.universeKey !== page.universeKey) {
          throw universeMismatch(item.reference.kind);
        }
        return {
          position: item.position,
          kind: item.reference.kind,
          id: block.id,
          blockType: block.blockType,
          text: block.content.text,
        };
      }

      case PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND: {
        const resource = await this.knowledgeResources.findById({ id: item.reference.id });
        if (!resource) {
          throw missingPreviewReference(item.reference.kind);
        }
        if (resource.universeKey !== page.universeKey) {
          throw universeMismatch(item.reference.kind);
        }
        return {
          position: item.position,
          kind: item.reference.kind,
          id: resource.id,
          resourceType: resource.resourceType,
          lifecycle: resource.lifecycle,
        };
      }

      case PAGE_COMPOSITION_MEDIA_ITEM_KIND: {
        const asset = await this.mediaAssets.resolve({ id: item.reference.id });
        return {
          position: item.position,
          kind: item.reference.kind,
          id: asset.id,
        };
      }
    }
  }
}
