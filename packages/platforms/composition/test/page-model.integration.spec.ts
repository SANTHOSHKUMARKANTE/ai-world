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
  let getPage: GetPage;

  const universeKeys = ['universe.page-model-devotional', 'universe.page-model-anime'];

  beforeAll(() => {
    database = createDatabaseClient({
      connectionString: requireDatabaseUrl(),
    });

    repository = new PrismaPageRepository(database);
    createPage = new CreatePage(repository);
    getPage = new GetPage(repository);
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
    const knowledgeCountBefore = await database.knowledgeResource.count();
    const assetCountBefore = await database.asset.count();

    const created = await createPage.execute({
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

    const byId = await getPage.execute({ id: created.id });
    expect(byId).toEqual(created);

    const byRoute = await repository.findByRoute({
      universeKey: 'universe.page-model-devotional',
      routePath: '/home',
    });
    expect(byRoute).toEqual(created);

    expect(await database.knowledgeResource.count()).toBe(knowledgeCountBefore);
    expect(await database.asset.count()).toBe(assetCountBefore);
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
