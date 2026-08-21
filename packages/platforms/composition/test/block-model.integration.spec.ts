import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { generateResourceId } from '@ai-world/kernel-identifiers';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { CreateTextBlock, GetBlock, TEXT_BLOCK_TYPE } from '../src';
import { PrismaBlockRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Block persistence integration tests.');
  }

  return databaseUrl;
}

describe('Block persistence', () => {
  let database: DatabaseClient;
  let repository: PrismaBlockRepository;
  let createTextBlock: CreateTextBlock;
  let getBlock: GetBlock;

  const universeKeys = ['universe.block-model-devotional', 'universe.block-model-anime'];

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });

    repository = new PrismaBlockRepository(database);
    createTextBlock = new CreateTextBlock(repository);
    getBlock = new GetBlock(repository);
  });

  async function cleanup(): Promise<void> {
    await database.compositionBlock.deleteMany({
      where: {
        universeKey: { in: universeKeys },
      },
    });
  }

  beforeEach(cleanup);
  afterEach(cleanup);

  afterAll(async () => {
    await database.$disconnect();
  });

  it('persists and reloads an independent typed Text Block', async () => {
    const created = await createTextBlock.execute({
      universeKey: 'universe.block-model-devotional',
      content: { text: 'A reusable devotional introduction.' },
    });

    expect(created).toMatchObject({
      universeKey: 'universe.block-model-devotional',
      blockType: TEXT_BLOCK_TYPE,
      content: { text: 'A reusable devotional introduction.' },
    });

    await expect(getBlock.execute({ id: created.id })).resolves.toEqual(created);

    await expect(
      database.compositionPage.count({
        where: { universeKey: { in: universeKeys } },
      }),
    ).resolves.toBe(0);
    await expect(
      database.knowledgeResource.count({
        where: { universeKey: { in: universeKeys } },
      }),
    ).resolves.toBe(0);
  });

  it('allows typed Blocks to be reused independently across Universes', async () => {
    const devotional = await createTextBlock.execute({
      universeKey: 'universe.block-model-devotional',
      content: { text: 'Shared presentation text.' },
    });

    const anime = await createTextBlock.execute({
      universeKey: 'universe.block-model-anime',
      content: { text: 'Shared presentation text.' },
    });

    expect(devotional.id).not.toBe(anime.id);

    const persisted = await database.compositionBlock.findMany({
      where: {
        universeKey: { in: universeKeys },
      },
      orderBy: { universeKey: 'asc' },
    });

    expect(persisted).toHaveLength(2);
    expect(persisted.map((block) => block.blockType)).toEqual([TEXT_BLOCK_TYPE, TEXT_BLOCK_TYPE]);
    expect(persisted.map((block) => block.universeKey)).toEqual([
      'universe.block-model-anime',
      'universe.block-model-devotional',
    ]);
  });

  it('rejects an unsupported Block type at the persistence boundary', async () => {
    await expect(
      database.compositionBlock.create({
        data: {
          id: generateResourceId(),
          universeKey: 'universe.block-model-devotional',
          blockType: 'composition.block.unvalidated',
          textContent: 'Unvalidated Block content.',
        },
      }),
    ).rejects.toBeTruthy();

    await expect(
      database.compositionBlock.count({
        where: { universeKey: 'universe.block-model-devotional' },
      }),
    ).resolves.toBe(0);
  });
});
