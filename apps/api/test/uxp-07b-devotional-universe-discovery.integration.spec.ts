import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for UXP-07B integration tests.');
}

const IDS = {
  vishnu: 'a8000000-0000-4000-8000-000000000001',
  lakshmi: 'a8000000-0000-4000-8000-000000000002',
  ganesha: 'a8000000-0000-4000-8000-000000000003',
  draft: 'a8000000-0000-4000-8000-000000000004',
  archived: 'a8000000-0000-4000-8000-000000000005',
  anime: 'a8000000-0000-4000-8000-000000000006',
} as const;

const RESOURCE_IDS = Object.values(IDS);

describe('UXP-07B Devotional Universe discovery acceptance', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanup(): Promise<void> {
    await database.knowledgeResource.deleteMany({
      where: { id: { in: [...RESOURCE_IDS] } },
    });
  }

  async function createEntity(options: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    readonly slug: string;
    readonly displayName: string;
    readonly updatedAt: string;
  }): Promise<void> {
    const updatedAt = new Date(options.updatedAt);

    await database.knowledgeResource.create({
      data: {
        id: options.id,
        universeKey: options.universeKey,
        resourceType: options.resourceType,
        lifecycle: options.lifecycle,
        updatedAt,
      },
    });

    await database.knowledgeResourceProfile.create({
      data: {
        knowledgeResourceId: options.id,
        routeKey: `${options.universeKey}/${options.slug}`,
        slug: options.slug,
        displayName: options.displayName,
        summary: `${options.displayName} acceptance summary`,
        facts: [],
        updatedAt,
      },
    });
  }

  async function seed(): Promise<void> {
    await createEntity({
      id: IDS.vishnu,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'PUBLISHED',
      slug: 'vishnu',
      displayName: 'Lord Vishnu',
      updatedAt: '2026-08-30T09:00:00.000Z',
    });
    await createEntity({
      id: IDS.lakshmi,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'PUBLISHED',
      slug: 'lakshmi',
      displayName: 'Goddess Lakshmi',
      updatedAt: '2026-08-30T08:00:00.000Z',
    });
    await createEntity({
      id: IDS.ganesha,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'PUBLISHED',
      slug: 'ganesha',
      displayName: 'Lord Ganesha',
      updatedAt: '2026-08-30T07:00:00.000Z',
    });
    await createEntity({
      id: IDS.draft,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'DRAFT',
      slug: 'draft-deity',
      displayName: 'Draft Deity',
      updatedAt: '2026-08-30T11:00:00.000Z',
    });
    await createEntity({
      id: IDS.archived,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'ARCHIVED',
      slug: 'archived-deity',
      displayName: 'Archived Deity',
      updatedAt: '2026-08-30T10:00:00.000Z',
    });
    await createEntity({
      id: IDS.anime,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'PUBLISHED',
      slug: 'acceptance-anime-character',
      displayName: 'Acceptance Anime Character',
      updatedAt: '2026-08-30T12:00:00.000Z',
    });
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanup();

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());
    await app.init();
  });

  afterEach(cleanup);

  afterAll(async () => {
    await cleanup();
    await app.close();
    await database.$disconnect();
  });

  it('returns only published devotional.deity resources in deterministic recency order and honors the landing limit', async () => {
    await seed();

    const full = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: 6,
      })
      .expect(200);

    expect(full.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.vishnu,
      IDS.lakshmi,
      IDS.ganesha,
    ]);

    expect(full.body.items).toEqual([
      expect.objectContaining({
        resourceId: IDS.vishnu,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'vishnu',
        displayName: 'Lord Vishnu',
      }),
      expect.objectContaining({
        resourceId: IDS.lakshmi,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'lakshmi',
        displayName: 'Goddess Lakshmi',
      }),
      expect.objectContaining({
        resourceId: IDS.ganesha,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'ganesha',
        displayName: 'Lord Ganesha',
      }),
    ]);

    const limited = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: 2,
      })
      .expect(200);

    expect(limited.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.vishnu,
      IDS.lakshmi,
    ]);
  });

  it('keeps a newer DRAFT Deity hidden from the public Devotional landing projection', async () => {
    await seed();

    const response = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: 6,
      })
      .expect(200);

    expect(
      response.body.items.some((item: { resourceId: string }) => item.resourceId === IDS.draft),
    ).toBe(false);
    expect(response.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.vishnu,
      IDS.lakshmi,
      IDS.ganesha,
    ]);
  });

  it('keeps a newer ARCHIVED Deity and another Universe out of the public Devotional landing projection', async () => {
    await seed();

    const response = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: 6,
      })
      .expect(200);

    const ids = response.body.items.map((item: { resourceId: string }) => item.resourceId);

    expect(ids).not.toContain(IDS.archived);
    expect(ids).not.toContain(IDS.anime);
    expect(ids).toEqual([IDS.vishnu, IDS.lakshmi, IDS.ganesha]);
  });
});
