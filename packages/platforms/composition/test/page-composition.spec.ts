import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResource,
  KnowledgeResourceReader,
} from '@ai-world/platform-knowledge';
import type {
  MediaAssetReference,
  MediaAssetReferenceResolver,
  ResolveMediaAssetReferenceInput,
} from '@ai-world/platform-media';
import { describe, expect, it } from 'vitest';

import {
  GetPageComposition,
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  SetPageComposition,
  type Block,
  type BlockReader,
  type FindBlockByIdInput,
  type FindPageByIdInput,
  type ListPageCompositionItemsInput,
  type Page,
  type PageCompositionItem,
  type PageCompositionStore,
  type PageReader,
  type ReplacePageCompositionItemsInput,
} from '../src';

const PAGE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const BLOCK_ID = parseResourceId('22222222-2222-4222-8222-222222222222');
const KNOWLEDGE_ID = parseResourceId('33333333-3333-4333-8333-333333333333');
const ASSET_ID = parseResourceId('44444444-4444-4444-8444-444444444444');
const UNIVERSE_KEY = parseNamespacedKey('universe.devotional');

function createPage(): Page {
  const now = new Date('2026-08-21T00:00:00.000Z');
  return {
    id: PAGE_ID,
    universeKey: UNIVERSE_KEY,
    route: { path: '/home' },
    presentation: { title: 'Devotional Home' },
    lifecycle: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

function createBlock(universeKey = UNIVERSE_KEY): Block {
  const now = new Date('2026-08-21T00:00:00.000Z');
  return {
    id: BLOCK_ID,
    universeKey,
    blockType: 'composition.block.text',
    content: { text: 'Welcome.' },
    createdAt: now,
    updatedAt: now,
  };
}

function createKnowledgeResource(): KnowledgeResource {
  const now = new Date('2026-08-21T00:00:00.000Z');
  return {
    id: KNOWLEDGE_ID,
    universeKey: UNIVERSE_KEY,
    resourceType: parseNamespacedKey('devotional.deity'),
    lifecycle: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

class StubPageReader implements PageReader {
  constructor(private readonly page: Page | null) {}

  async findById(input: FindPageByIdInput): Promise<Page | null> {
    return input.id === this.page?.id ? this.page : null;
  }

  async findByRoute(): Promise<Page | null> {
    return this.page;
  }
}

class RecordingBlockReader implements BlockReader {
  readonly ids: ResourceId[] = [];

  constructor(private readonly block: Block | null) {}

  async findById(input: FindBlockByIdInput): Promise<Block | null> {
    this.ids.push(input.id);
    return input.id === this.block?.id ? this.block : null;
  }
}

class RecordingKnowledgeReader implements KnowledgeResourceReader {
  readonly ids: ResourceId[] = [];

  constructor(private readonly resource: KnowledgeResource | null) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    this.ids.push(input.id);
    return input.id === this.resource?.id ? this.resource : null;
  }
}

class RecordingMediaResolver implements MediaAssetReferenceResolver {
  readonly ids: string[] = [];

  constructor(private readonly reference: MediaAssetReference | null) {}

  async resolve(input: ResolveMediaAssetReferenceInput): Promise<MediaAssetReference> {
    this.ids.push(input.id);
    if (!this.reference || input.id !== this.reference.id) {
      throw new TypeError('Media Asset reference is unavailable.');
    }
    return this.reference;
  }
}

class RecordingCompositionStore implements PageCompositionStore {
  readonly replacements: ReplacePageCompositionItemsInput[] = [];
  private items: readonly PageCompositionItem[] = [];

  async listItems(input: ListPageCompositionItemsInput): Promise<readonly PageCompositionItem[]> {
    return input.pageId === PAGE_ID ? this.items : [];
  }

  async replaceItems(
    input: ReplacePageCompositionItemsInput,
  ): Promise<readonly PageCompositionItem[]> {
    this.replacements.push(input);
    this.items = input.items;
    return this.items;
  }
}

describe('Page composition', () => {
  it('resolves and stores ordered typed references through canonical owner contracts', async () => {
    const blocks = new RecordingBlockReader(createBlock());
    const knowledge = new RecordingKnowledgeReader(createKnowledgeResource());
    const media = new RecordingMediaResolver({ id: ASSET_ID });
    const store = new RecordingCompositionStore();
    const setComposition = new SetPageComposition(
      new StubPageReader(createPage()),
      blocks,
      knowledge,
      media,
      store,
    );

    const composition = await setComposition.execute({
      pageId: PAGE_ID,
      items: [
        { kind: PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND, id: KNOWLEDGE_ID },
        { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID },
        { kind: PAGE_COMPOSITION_MEDIA_ITEM_KIND, id: ASSET_ID },
      ],
    });

    expect(composition).toEqual({
      pageId: PAGE_ID,
      items: [
        {
          position: 0,
          reference: { kind: PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND, id: KNOWLEDGE_ID },
        },
        {
          position: 1,
          reference: { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID },
        },
        {
          position: 2,
          reference: { kind: PAGE_COMPOSITION_MEDIA_ITEM_KIND, id: ASSET_ID },
        },
      ],
    });
    expect(blocks.ids).toEqual([BLOCK_ID]);
    expect(knowledge.ids).toEqual([KNOWLEDGE_ID]);
    expect(media.ids).toEqual([ASSET_ID]);
    expect(store.replacements).toHaveLength(1);
  });

  it('rejects a cross-Universe Block before changing Page composition', async () => {
    const store = new RecordingCompositionStore();
    const setComposition = new SetPageComposition(
      new StubPageReader(createPage()),
      new RecordingBlockReader(createBlock(parseNamespacedKey('universe.anime'))),
      new RecordingKnowledgeReader(createKnowledgeResource()),
      new RecordingMediaResolver({ id: ASSET_ID }),
      store,
    );

    await expect(
      setComposition.execute({
        pageId: PAGE_ID,
        items: [{ kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID }],
      }),
    ).rejects.toThrow('must belong to the same Universe');
    expect(store.replacements).toEqual([]);
  });

  it('does not persist a partial composition when an owner rejects a reference', async () => {
    const store = new RecordingCompositionStore();
    const setComposition = new SetPageComposition(
      new StubPageReader(createPage()),
      new RecordingBlockReader(createBlock()),
      new RecordingKnowledgeReader(createKnowledgeResource()),
      new RecordingMediaResolver(null),
      store,
    );

    await expect(
      setComposition.execute({
        pageId: PAGE_ID,
        items: [
          { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID },
          { kind: PAGE_COMPOSITION_MEDIA_ITEM_KIND, id: ASSET_ID },
        ],
      }),
    ).rejects.toThrow('Media Asset reference is unavailable');
    expect(store.replacements).toEqual([]);
  });

  it('reads the ordered composition only for an existing Page', async () => {
    const store = new RecordingCompositionStore();
    await store.replaceItems({
      pageId: PAGE_ID,
      items: [
        {
          position: 0,
          reference: { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID },
        },
      ],
    });

    const getComposition = new GetPageComposition(new StubPageReader(createPage()), store);
    await expect(getComposition.execute({ pageId: PAGE_ID })).resolves.toEqual({
      pageId: PAGE_ID,
      items: [
        {
          position: 0,
          reference: { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: BLOCK_ID },
        },
      ],
    });

    const getMissingComposition = new GetPageComposition(new StubPageReader(null), store);
    await expect(getMissingComposition.execute({ pageId: PAGE_ID })).resolves.toBeNull();
  });
});
