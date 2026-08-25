import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import {
  ASSET_ARCHIVED_LIFECYCLE,
  ASSET_IMAGE_TYPE,
  ASSET_INITIAL_LIFECYCLE,
} from '@ai-world/platform-media';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for UXP-03A integration tests.');
}

const IDS = {
  naruto: '93000000-0000-4000-8000-000000000001',
  sasuke: '93000000-0000-4000-8000-000000000002',
  sakura: '93000000-0000-4000-8000-000000000003',
  draft: '93000000-0000-4000-8000-000000000004',
  archived: '93000000-0000-4000-8000-000000000005',
  series: '93000000-0000-4000-8000-000000000006',
  devotional: '93000000-0000-4000-8000-000000000007',
  orphan: '93000000-0000-4000-8000-000000000008',
  narutoImage: '94000000-0000-4000-8000-000000000001',
  archivedImage: '94000000-0000-4000-8000-000000000002',
} as const;

const RESOURCE_IDS = [
  IDS.naruto,
  IDS.sasuke,
  IDS.sakura,
  IDS.draft,
  IDS.archived,
  IDS.series,
  IDS.devotional,
  IDS.orphan,
] as const;

const ASSET_IDS = [IDS.narutoImage, IDS.archivedImage] as const;

describe('UXP-03A public Knowledge discovery', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanup(): Promise<void> {
    await database.knowledgeResource.deleteMany({
      where: { id: { in: [...RESOURCE_IDS] } },
    });
    await database.asset.deleteMany({
      where: { id: { in: [...ASSET_IDS] } },
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
        summary: `${options.displayName} discovery summary`,
        facts: [],
        updatedAt,
      },
    });
  }

  async function seed(): Promise<void> {
    await createEntity({
      id: IDS.naruto,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'PUBLISHED',
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      updatedAt: '2026-08-25T04:00:00.000Z',
    });
    await createEntity({
      id: IDS.sasuke,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'PUBLISHED',
      slug: 'sasuke-uchiha',
      displayName: 'Sasuke Uchiha',
      updatedAt: '2026-08-24T03:00:00.000Z',
    });
    await createEntity({
      id: IDS.sakura,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'PUBLISHED',
      slug: 'sakura-haruno',
      displayName: 'Sakura Haruno',
      updatedAt: '2026-08-24T03:00:00.000Z',
    });
    await createEntity({
      id: IDS.draft,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'DRAFT',
      slug: 'draft-character',
      displayName: 'Draft Character',
      updatedAt: '2026-08-25T06:00:00.000Z',
    });
    await createEntity({
      id: IDS.archived,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      lifecycle: 'ARCHIVED',
      slug: 'archived-character',
      displayName: 'Archived Character',
      updatedAt: '2026-08-25T05:00:00.000Z',
    });
    await createEntity({
      id: IDS.series,
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
      lifecycle: 'PUBLISHED',
      slug: 'naruto-series',
      displayName: 'Naruto',
      updatedAt: '2026-08-23T02:00:00.000Z',
    });
    await createEntity({
      id: IDS.devotional,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      lifecycle: 'PUBLISHED',
      slug: 'lord-shiva',
      displayName: 'Lord Shiva',
      updatedAt: '2026-08-25T02:00:00.000Z',
    });

    await database.knowledgeResource.create({
      data: {
        id: IDS.orphan,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        lifecycle: 'PUBLISHED',
        updatedAt: new Date('2026-08-25T07:00:00.000Z'),
      },
    });

    await database.asset.create({
      data: {
        id: IDS.narutoImage,
        assetType: ASSET_IMAGE_TYPE,
        mimeType: 'image/png',
        sizeBytes: 512,
        storageReference: 'uxp-03a/naruto.png',
        lifecycle: ASSET_INITIAL_LIFECYCLE,
      },
    });

    await database.asset.create({
      data: {
        id: IDS.archivedImage,
        assetType: ASSET_IMAGE_TYPE,
        mimeType: 'image/png',
        sizeBytes: 512,
        storageReference: 'uxp-03a/archived.png',
        lifecycle: ASSET_ARCHIVED_LIFECYCLE,
      },
    });

    await database.knowledgeResourceAssetReference.create({
      data: {
        knowledgeResourceId: IDS.naruto,
        assetId: IDS.archivedImage,
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Unavailable Naruto portrait',
      },
    });

    await database.knowledgeResourceAssetReference.create({
      data: {
        knowledgeResourceId: IDS.naruto,
        assetId: IDS.narutoImage,
        role: 'HERO',
        playback: 'STILL',
        position: 1,
        altText: 'Naruto Uzumaki portrait',
      },
    });

    await database.knowledgeResourceAssetReference.create({
      data: {
        knowledgeResourceId: IDS.sakura,
        assetId: IDS.archivedImage,
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Unavailable Sakura portrait',
      },
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

  it('returns published Characters in deterministic recency order with only the first eligible public preview', async () => {
    await seed();

    const response = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        limit: 20,
      })
      .expect(200);

    expect(response.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.naruto,
      IDS.sasuke,
      IDS.sakura,
    ]);

    expect(response.body.items[0]).toEqual({
      resourceId: IDS.naruto,
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      summary: 'Naruto Uzumaki discovery summary',
      updatedAt: '2026-08-25T04:00:00.000Z',
      previewMedia: {
        assetId: IDS.narutoImage,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Naruto Uzumaki portrait',
      },
    });

    expect(response.body.items[1]).toMatchObject({
      resourceId: IDS.sasuke,
      displayName: 'Sasuke Uchiha',
      previewMedia: null,
    });

    expect(response.body.items[2]).toMatchObject({
      resourceId: IDS.sakura,
      displayName: 'Sakura Haruno',
      previewMedia: null,
    });

    const hiddenResourceIds = new Set<string>([IDS.draft, IDS.archived, IDS.orphan]);

    expect(
      response.body.items.some((item: { resourceId: string }) =>
        hiddenResourceIds.has(item.resourceId),
      ),
    ).toBe(false);
  });

  it('keeps Resource Type optional, honors bounded limit/filtering, and reuses the projection for Devotional', async () => {
    await seed();

    const allAnime = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.anime',
      })
      .expect(200);

    expect(allAnime.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.naruto,
      IDS.sasuke,
      IDS.sakura,
      IDS.series,
    ]);

    const limited = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        limit: 2,
      })
      .expect(200);

    expect(limited.body.items.map((item: { resourceId: string }) => item.resourceId)).toEqual([
      IDS.naruto,
      IDS.sasuke,
    ]);

    const series = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
      })
      .expect(200);

    expect(series.body.items).toHaveLength(1);
    expect(series.body.items[0]).toMatchObject({
      resourceId: IDS.series,
      resourceType: 'anime.series',
      slug: 'naruto-series',
      displayName: 'Naruto',
      previewMedia: null,
    });

    const devotional = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
      })
      .expect(200);

    expect(devotional.body.items).toHaveLength(1);
    expect(devotional.body.items[0]).toMatchObject({
      resourceId: IDS.devotional,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      slug: 'lord-shiva',
      displayName: 'Lord Shiva',
    });

    const invalid = await request(app.getHttpServer())
      .get('/knowledge/discovery')
      .query({
        universeKey: 'universe.anime',
        limit: 51,
      })
      .expect(400);

    expect(invalid.body.error).toMatchObject({
      code: 'knowledge.public.invalid_query',
      status: 400,
    });
  });
});
