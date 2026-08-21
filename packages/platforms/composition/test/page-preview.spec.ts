import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import type { KnowledgeResourceReader } from '@ai-world/platform-knowledge';
import type { MediaAssetReferenceResolver } from '@ai-world/platform-media';
import { describe, expect, it } from 'vitest';

import {
  GetPagePreview,
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  TEXT_BLOCK_TYPE,
  type BlockReader,
  type Page,
  type PageCompositionItem,
  type PageCompositionStore,
  type PageReader,
} from '../src';

const pageId = parseResourceId('11111111-1111-4111-8111-111111111111');
const blockId = parseResourceId('22222222-2222-4222-8222-222222222222');
const knowledgeId = parseResourceId('33333333-3333-4333-8333-333333333333');
const assetId = parseResourceId('44444444-4444-4444-8444-444444444444');
const universeKey = parseNamespacedKey('universe.devotional');

const page: Page = {
  id: pageId,
  universeKey,
  route: { path: '/preview-proof' },
  presentation: { title: 'Preview proof' },
  lifecycle: 'DRAFT',
  createdAt: new Date('2026-08-21T12:00:00.000Z'),
  updatedAt: new Date('2026-08-21T12:00:00.000Z'),
};

const composition: readonly PageCompositionItem[] = [
  { position: 0, reference: { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: blockId } },
  {
    position: 1,
    reference: { kind: PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND, id: knowledgeId },
  },
  { position: 2, reference: { kind: PAGE_COMPOSITION_MEDIA_ITEM_KIND, id: assetId } },
];

function createPreview(
  options: { readonly page?: Page | null; readonly blockUniverse?: string } = {},
) {
  const pages: PageReader = {
    findById: async () => (options.page === undefined ? page : options.page),
    findByRoute: async () => null,
  };
  const blocks: BlockReader = {
    findById: async () => ({
      id: blockId,
      universeKey: parseNamespacedKey(options.blockUniverse ?? universeKey),
      blockType: TEXT_BLOCK_TYPE,
      content: { text: 'A resolved preview Block.' },
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }),
  };
  const knowledgeResources: KnowledgeResourceReader = {
    findById: async () => ({
      id: knowledgeId,
      universeKey,
      resourceType: parseNamespacedKey('devotional.deity'),
      lifecycle: 'DRAFT',
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    }),
  };
  const mediaAssets: MediaAssetReferenceResolver = {
    resolve: async () => ({ id: assetId }),
  };
  const compositions: PageCompositionStore = {
    listItems: async () => composition,
    replaceItems: async () => composition,
  };

  return new GetPagePreview(pages, blocks, knowledgeResources, mediaAssets, compositions);
}

describe('Page draft preview', () => {
  it('resolves ordered typed composition through each canonical owner contract', async () => {
    await expect(createPreview().execute({ pageId })).resolves.toEqual({
      page: {
        id: pageId,
        universeKey,
        route: { path: '/preview-proof' },
        presentation: { title: 'Preview proof' },
        lifecycle: 'DRAFT',
      },
      items: [
        {
          position: 0,
          kind: 'BLOCK',
          id: blockId,
          blockType: TEXT_BLOCK_TYPE,
          text: 'A resolved preview Block.',
        },
        {
          position: 1,
          kind: 'KNOWLEDGE_RESOURCE',
          id: knowledgeId,
          resourceType: parseNamespacedKey('devotional.deity'),
          lifecycle: 'DRAFT',
        },
        { position: 2, kind: 'MEDIA_ASSET', id: assetId },
      ],
    });
  });

  it('returns null when the Page does not exist', async () => {
    await expect(createPreview({ page: null }).execute({ pageId })).resolves.toBeNull();
  });

  it('rejects a stale cross-Universe reference instead of exposing inconsistent preview state', async () => {
    await expect(
      createPreview({ blockUniverse: 'universe.anime' }).execute({ pageId }),
    ).rejects.toThrow('BLOCK must belong to the same Universe as the previewed Page.');
  });
});
