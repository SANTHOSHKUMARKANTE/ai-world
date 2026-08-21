import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { CreateKnowledgeResource } from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import {
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
  ResolveAssetReference,
} from '@ai-world/platform-media';
import { PrismaAssetRepository } from '@ai-world/platform-media/infrastructure';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import {
  CreatePage,
  CreateTextBlock,
  GetPageComposition,
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  SetPageComposition,
} from '../src';
import {
  PrismaBlockRepository,
  PrismaPageCompositionRepository,
  PrismaPageRepository,
} from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Page composition integration tests.');
  }
  return databaseUrl;
}

describe('Page composition persistence', () => {
  let database: DatabaseClient;
  let pages: PrismaPageRepository;
  let blocks: PrismaBlockRepository;
  let knowledge: PrismaKnowledgeResourceRepository;
  let assets: PrismaAssetRepository;
  let compositions: PrismaPageCompositionRepository;
  let createPage: CreatePage;
  let createBlock: CreateTextBlock;
  let createKnowledge: CreateKnowledgeResource;
  let setComposition: SetPageComposition;
  let getComposition: GetPageComposition;

  const universeKeys = ['universe.page-composition-devotional', 'universe.page-composition-anime'];
  const assetStoragePrefix = 'page-composition-proof/';

  beforeAll(() => {
    database = createDatabaseClient({ connectionString: requireDatabaseUrl() });
    pages = new PrismaPageRepository(database);
    blocks = new PrismaBlockRepository(database);
    knowledge = new PrismaKnowledgeResourceRepository(database);
    assets = new PrismaAssetRepository(database);
    compositions = new PrismaPageCompositionRepository(database);
    createPage = new CreatePage(pages);
    createBlock = new CreateTextBlock(blocks);
    createKnowledge = new CreateKnowledgeResource(knowledge);
    setComposition = new SetPageComposition(
      pages,
      blocks,
      knowledge,
      new ResolveAssetReference(assets),
      compositions,
    );
    getComposition = new GetPageComposition(pages, compositions);
  });

  async function cleanup(): Promise<void> {
    await database.compositionPage.deleteMany({
      where: { universeKey: { in: universeKeys } },
    });
    await database.compositionBlock.deleteMany({
      where: { universeKey: { in: universeKeys } },
    });
    await database.knowledgeResource.deleteMany({
      where: { universeKey: { in: universeKeys } },
    });
    await database.asset.deleteMany({
      where: { storageReference: { startsWith: assetStoragePrefix } },
    });
  }

  beforeEach(cleanup);
  afterEach(cleanup);

  afterAll(async () => {
    await database.$disconnect();
  });

  it('persists and reloads ordered Block, Knowledge, and Media references', async () => {
    const page = await createPage.execute({
      universeKey: 'universe.page-composition-devotional',
      route: { path: '/composed' },
      presentation: { title: 'Composed Devotional Page' },
    });
    const block = await createBlock.execute({
      universeKey: 'universe.page-composition-devotional',
      content: { text: 'A reusable introduction.' },
    });
    const resource = await createKnowledge.execute({
      universeKey: 'universe.page-composition-devotional',
      resourceType: 'devotional.deity',
    });
    const asset = await assets.create({
      id: generateResourceId(),
      assetType: ASSET_IMAGE_TYPE,
      technicalMetadata: { mimeType: 'image/png', sizeBytes: 128 },
      storageReference: `${assetStoragePrefix}${generateResourceId()}.png`,
      lifecycle: ASSET_INITIAL_LIFECYCLE,
    });
    const blockBefore = await blocks.findById({ id: block.id });
    const knowledgeBefore = await knowledge.findById({ id: resource.id });
    const assetBefore = await assets.findById({ id: asset.id });

    const composed = await setComposition.execute({
      pageId: page.id,
      items: [
        { kind: PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND, id: resource.id },
        { kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: block.id },
        { kind: PAGE_COMPOSITION_MEDIA_ITEM_KIND, id: asset.id },
      ],
    });

    expect(composed.items.map((item) => item.reference.kind)).toEqual([
      PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
      PAGE_COMPOSITION_BLOCK_ITEM_KIND,
      PAGE_COMPOSITION_MEDIA_ITEM_KIND,
    ]);
    await expect(getComposition.execute({ pageId: page.id })).resolves.toEqual(composed);
    await expect(blocks.findById({ id: block.id })).resolves.toEqual(blockBefore);
    await expect(knowledge.findById({ id: resource.id })).resolves.toEqual(knowledgeBefore);
    await expect(assets.findById({ id: asset.id })).resolves.toEqual(assetBefore);

    const persisted = await database.compositionPageItem.findMany({
      where: { pageId: page.id },
      orderBy: { position: 'asc' },
    });
    expect(persisted).toMatchObject([
      {
        position: 0,
        itemKind: PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
        blockId: null,
        knowledgeResourceId: resource.id,
        assetId: null,
      },
      {
        position: 1,
        itemKind: PAGE_COMPOSITION_BLOCK_ITEM_KIND,
        blockId: block.id,
        knowledgeResourceId: null,
        assetId: null,
      },
      {
        position: 2,
        itemKind: PAGE_COMPOSITION_MEDIA_ITEM_KIND,
        blockId: null,
        knowledgeResourceId: null,
        assetId: asset.id,
      },
    ]);
  });

  it('reuses a Block across Pages without transferring Block ownership', async () => {
    const firstPage = await createPage.execute({
      universeKey: 'universe.page-composition-anime',
      route: { path: '/first' },
      presentation: { title: 'First Anime Page' },
    });
    const secondPage = await createPage.execute({
      universeKey: 'universe.page-composition-anime',
      route: { path: '/second' },
      presentation: { title: 'Second Anime Page' },
    });
    const block = await createBlock.execute({
      universeKey: 'universe.page-composition-anime',
      content: { text: 'Reusable Anime presentation.' },
    });

    await setComposition.execute({
      pageId: firstPage.id,
      items: [{ kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: block.id }],
    });
    await setComposition.execute({
      pageId: secondPage.id,
      items: [{ kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: block.id }],
    });

    await expect(
      database.compositionPageItem.count({ where: { blockId: block.id } }),
    ).resolves.toBe(2);
    await expect(blocks.findById({ id: block.id })).resolves.toEqual(block);
  });

  it('rejects cross-Universe canonical references before persistence', async () => {
    const page = await createPage.execute({
      universeKey: 'universe.page-composition-devotional',
      route: { path: '/scope-proof' },
      presentation: { title: 'Scope Proof' },
    });
    const animeBlock = await createBlock.execute({
      universeKey: 'universe.page-composition-anime',
      content: { text: 'Anime-only presentation.' },
    });

    await expect(
      setComposition.execute({
        pageId: page.id,
        items: [{ kind: PAGE_COMPOSITION_BLOCK_ITEM_KIND, id: animeBlock.id }],
      }),
    ).rejects.toThrow('must belong to the same Universe');
    await expect(database.compositionPageItem.count({ where: { pageId: page.id } })).resolves.toBe(
      0,
    );
  });
});
