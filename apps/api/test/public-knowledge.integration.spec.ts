import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for public Knowledge API integration tests.');
}

const devotionalDeityId = randomUUID();
const devotionalScriptureId = randomUUID();
const devotionalDraftTempleId = randomUUID();
const devotionalArchivedDeityId = randomUUID();
const animeCharacterId = randomUUID();

const fixtureIds = [
  devotionalDeityId,
  devotionalScriptureId,
  devotionalDraftTempleId,
  devotionalArchivedDeityId,
  animeCharacterId,
];

describe('Public Knowledge API', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupFixtures(): Promise<void> {
    await database.knowledgeResource.deleteMany({
      where: {
        id: {
          in: fixtureIds,
        },
      },
    });
  }

  beforeAll(async () => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    await cleanupFixtures();

    await database.knowledgeResource.createMany({
      data: [
        {
          id: devotionalDeityId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-16T04:10:00.000Z'),
        },
        {
          id: devotionalScriptureId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.scripture',
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-16T04:09:00.000Z'),
        },
        {
          id: devotionalDraftTempleId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          lifecycle: 'DRAFT',
          createdAt: new Date('2026-08-16T04:08:00.000Z'),
        },
        {
          id: devotionalArchivedDeityId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          lifecycle: 'ARCHIVED',
          createdAt: new Date('2026-08-16T04:07:00.000Z'),
        },
        {
          id: animeCharacterId,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-16T04:06:00.000Z'),
        },
      ],
    });

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

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('serves a published Devotional Resource publicly without a session', async () => {
    const response = await request(app.getHttpServer())
      .get(`/knowledge/resources/${devotionalDeityId}`)
      .set('X-Request-Id', 'knowledge-public-get-001')
      .expect('X-Request-Id', 'knowledge-public-get-001')
      .expect(200);

    expect(response.body).toEqual({
      id: devotionalDeityId,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });

    expect(response.body).not.toHaveProperty('lifecycle');
  });

  it.each([
    ['DRAFT', devotionalDraftTempleId],
    ['ARCHIVED', devotionalArchivedDeityId],
  ])('does not expose a %s Resource through the public read endpoint', async (_, id) => {
    const response = await request(app.getHttpServer())
      .get(`/knowledge/resources/${id}`)
      .set('X-Request-Id', `knowledge-public-hidden-${id}`)
      .expect(404);

    expect(response.body.error).toMatchObject({
      code: 'knowledge.public.resource_not_found',
      message: 'Knowledge Resource not found.',
      status: 404,
    });
  });

  it('returns a bounded published-only Devotional query in stable order', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .query({
        universeKey: 'universe.devotional',
      })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          id: devotionalDeityId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
        {
          id: devotionalScriptureId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.scripture',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });

    expect(response.text).not.toContain(devotionalDraftTempleId);
    expect(response.text).not.toContain(devotionalArchivedDeityId);
    expect(response.text).not.toContain(animeCharacterId);
    expect(response.body.items).toHaveLength(2);
  });

  it('filters the public query by Resource Type and respects the requested limit', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .query({
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        limit: '1',
      })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          id: devotionalDeityId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      ],
    });
  });

  it('requires a Universe key for a controlled public query', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .set('X-Request-Id', 'knowledge-public-missing-universe-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.public.invalid_request',
        message: 'The public Knowledge request is invalid.',
        status: 400,
        requestId: 'knowledge-public-missing-universe-001',
      },
    });
  });

  it('rejects a non-canonical public query key', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .query({
        universeKey: 'Devotional',
      })
      .set('X-Request-Id', 'knowledge-public-invalid-key-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.public.invalid_query',
        message: 'The public Knowledge query is invalid.',
        status: 400,
        requestId: 'knowledge-public-invalid-key-001',
      },
    });
  });

  it('rejects an explicitly empty Resource Type filter instead of treating it as absent', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .query({
        universeKey: 'universe.devotional',
        resourceType: '',
      })
      .set('X-Request-Id', 'knowledge-public-empty-resource-type-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.public.invalid_query',
        message: 'The public Knowledge query is invalid.',
        status: 400,
        requestId: 'knowledge-public-empty-resource-type-001',
      },
    });
  });

  it('rejects an unbounded public query limit', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources')
      .query({
        universeKey: 'universe.devotional',
        limit: '51',
      })
      .set('X-Request-Id', 'knowledge-public-invalid-limit-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.public.invalid_query',
        message: 'The public Knowledge query is invalid.',
        status: 400,
        requestId: 'knowledge-public-invalid-limit-001',
      },
    });
  });

  it('rejects a non-canonical public Resource ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/knowledge/resources/not-a-resource-id')
      .set('X-Request-Id', 'knowledge-public-invalid-id-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.public.invalid_resource_id',
        message: 'The Knowledge Resource identifier is invalid.',
        status: 400,
        requestId: 'knowledge-public-invalid-id-001',
      },
    });
  });
});
