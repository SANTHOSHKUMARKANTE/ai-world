import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';

import {
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  isPageCompositionItemKind,
  isPageCompositionPosition,
  type PageCompositionItem,
} from './page-composition';
import type {
  ListPageCompositionItemsInput,
  PageCompositionStore,
  ReplacePageCompositionItemsInput,
} from './page-composition-store';

interface PersistedPageCompositionItem {
  readonly position: number;
  readonly itemKind: string;
  readonly blockId: string | null;
  readonly knowledgeResourceId: string | null;
  readonly assetId: string | null;
}

function mapPersistedItem(item: PersistedPageCompositionItem): PageCompositionItem {
  if (!isPageCompositionPosition(item.position) || !isPageCompositionItemKind(item.itemKind)) {
    throw new TypeError('Persisted Page composition item has invalid ordering or reference kind.');
  }

  switch (item.itemKind) {
    case PAGE_COMPOSITION_BLOCK_ITEM_KIND:
      if (!item.blockId || item.knowledgeResourceId || item.assetId) {
        throw new TypeError('Persisted Block composition item has an invalid reference shape.');
      }
      return {
        position: item.position,
        reference: { kind: item.itemKind, id: parseResourceId(item.blockId) },
      };

    case PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND:
      if (item.blockId || !item.knowledgeResourceId || item.assetId) {
        throw new TypeError('Persisted Knowledge composition item has an invalid reference shape.');
      }
      return {
        position: item.position,
        reference: { kind: item.itemKind, id: parseResourceId(item.knowledgeResourceId) },
      };

    case PAGE_COMPOSITION_MEDIA_ITEM_KIND:
      if (item.blockId || item.knowledgeResourceId || !item.assetId) {
        throw new TypeError('Persisted Media composition item has an invalid reference shape.');
      }
      return {
        position: item.position,
        reference: { kind: item.itemKind, id: parseResourceId(item.assetId) },
      };
  }
}

function persistedReference(item: PageCompositionItem): {
  readonly itemKind: string;
  readonly blockId: string | null;
  readonly knowledgeResourceId: string | null;
  readonly assetId: string | null;
} {
  switch (item.reference.kind) {
    case PAGE_COMPOSITION_BLOCK_ITEM_KIND:
      return {
        itemKind: item.reference.kind,
        blockId: item.reference.id,
        knowledgeResourceId: null,
        assetId: null,
      };

    case PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND:
      return {
        itemKind: item.reference.kind,
        blockId: null,
        knowledgeResourceId: item.reference.id,
        assetId: null,
      };

    case PAGE_COMPOSITION_MEDIA_ITEM_KIND:
      return {
        itemKind: item.reference.kind,
        blockId: null,
        knowledgeResourceId: null,
        assetId: item.reference.id,
      };
  }
}

export class PrismaPageCompositionRepository implements PageCompositionStore {
  constructor(private readonly database: DatabaseClient) {}

  async listItems(input: ListPageCompositionItemsInput): Promise<readonly PageCompositionItem[]> {
    const items = await this.database.compositionPageItem.findMany({
      where: { pageId: input.pageId },
      orderBy: { position: 'asc' },
    });

    return items.map(mapPersistedItem);
  }

  async replaceItems(
    input: ReplacePageCompositionItemsInput,
  ): Promise<readonly PageCompositionItem[] | null> {
    const items = await this.database.$transaction(async (transaction) => {
      const page = await transaction.compositionPage.updateMany({
        where: {
          id: input.pageId,
          lifecycle: 'DRAFT',
        },
        data: {
          updatedAt: new Date(),
        },
      });

      if (page.count !== 1) {
        return null;
      }

      await transaction.compositionPageItem.deleteMany({
        where: { pageId: input.pageId },
      });

      if (input.items.length > 0) {
        await transaction.compositionPageItem.createMany({
          data: input.items.map((item) => ({
            pageId: input.pageId,
            position: item.position,
            ...persistedReference(item),
          })),
        });
      }

      return transaction.compositionPageItem.findMany({
        where: { pageId: input.pageId },
        orderBy: { position: 'asc' },
      });
    });

    return items?.map(mapPersistedItem) ?? null;
  }
}
