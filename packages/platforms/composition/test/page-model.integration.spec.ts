import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { CreatePage, GetPage } from '../src';
import { PrismaPageRepository } from '../src/infrastructure';

function requireDatabaseUrl(): string {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for Page persistence integration tests.');
  }

  return databaseUrl;
}

describe('Page persistence', () => {
  let database: DatabaseClient;
  let repository: PrismaPageRepository;
  let createPage: CreatePage;

  const universeKeys = ['universe.page-model-devotional', 'universe.page-model-anime'];

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });

    repository = new PrismaPageRepository(database);
    createPage = new CreatePage(repository);
  });

  async function cleanup(): Promise<void> {
    await database.compositionPage.deleteMany({
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

  it('persists and reloads a canonical Universe-scoped DRAFT Page', async () => {
    await database.$transaction(
      async (transaction) => {
        const transactionRepository = new PrismaPageRepository(transaction);
        const transactionCreatePage = new CreatePage(transactionRepository);
        const transactionGetPage = new GetPage(transactionRepository);
        const knowledgeCountBefore = await transaction.knowledgeResource.count();
        const assetCountBefore = await transaction.asset.count();

        const created = await transactionCreatePage.execute({
          universeKey: 'universe.page-model-devotional',
          route: { path: '/home' },
          presentation: { title: 'Devotional Home' },
        });

        expect(created).toMatchObject({
          universeKey: 'universe.page-model-devotional',
          route: { path: '/home' },
          presentation: { title: 'Devotional Home' },
          lifecycle: 'DRAFT',
        });

        const byId = await transactionGetPage.execute({ id: created.id });
        expect(byId).toEqual(created);

        const byRoute = await transactionRepository.findByRoute({
          universeKey: 'universe.page-model-devotional',
          routePath: '/home',
        });
        expect(byRoute).toEqual(created);

        expect(await transaction.knowledgeResource.count()).toBe(knowledgeCountBefore);
        expect(await transaction.asset.count()).toBe(assetCountBefore);
      },
      { isolationLevel: 'RepeatableRead' },
    );
  });

  it('makes route identity unique inside a Universe while allowing reuse across Universes', async () => {
    await createPage.execute({
      universeKey: 'universe.page-model-devotional',
      route: { path: '/home' },
      presentation: { title: 'Devotional Home' },
    });

    await createPage.execute({
      universeKey: 'universe.page-model-anime',
      route: { path: '/home' },
      presentation: { title: 'Anime Home' },
    });

    await expect(
      createPage.execute({
        universeKey: 'universe.page-model-devotional',
        route: { path: '/home' },
        presentation: { title: 'Duplicate Devotional Home' },
      }),
    ).rejects.toBeTruthy();

    const pages = await database.compositionPage.findMany({
      where: {
        routePath: '/home',
        universeKey: { in: universeKeys },
      },
      orderBy: { universeKey: 'asc' },
    });

    expect(pages).toHaveLength(2);
    expect(pages.map((page) => page.universeKey)).toEqual([
      'universe.page-model-anime',
      'universe.page-model-devotional',
    ]);
    expect(pages.every((page) => page.lifecycle === 'DRAFT')).toBe(true);
  });
});
