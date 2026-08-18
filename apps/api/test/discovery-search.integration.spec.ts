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
  throw new Error('DATABASE_URL is required for public Discovery Search API integration tests.');
}

const devotionalPublishedId = randomUUID();
const animePublishedId = randomUUID();
const devotionalDraftId = randomUUID();
const animeArchivedId = randomUUID();
const fixtureIds = [devotionalPublishedId, animePublishedId, devotionalDraftId, animeArchivedId];

describe('Public Discovery Search API', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  async function cleanupFixtures(): Promise<void> {
    await database.knowledgeResource.deleteMany({ where: { id: { in: fixtureIds } } });
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanupFixtures();
    await database.knowledgeResource.createMany({
      data: [
        {
          id: devotionalPublishedId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-18T09:02:00.000Z'),
        },
        {
          id: animePublishedId,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-18T09:01:00.000Z'),
        },
        {
          id: devotionalDraftId,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          lifecycle: 'DRAFT',
          createdAt: new Date('2026-08-18T09:04:00.000Z'),
        },
        {
          id: animeArchivedId,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          lifecycle: 'ARCHIVED',
          createdAt: new Date('2026-08-18T09:03:00.000Z'),
        },
      ],
    });

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register({ databaseUrl, environment: 'test', logLevel: 'fatal' })],
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

  it('serves anonymous ranked global Search while preserving published-only visibility', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({ query: 'A', offset: '0', limit: '20' })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          resourceId: animePublishedId,
          resourceType: 'anime.character',
          universeKey: 'universe.anime',
        },
        {
          resourceId: devotionalPublishedId,
          resourceType: 'devotional.temple',
          universeKey: 'universe.devotional',
        },
      ],
      pagination: { offset: 0, limit: 20 },
    });
    expect(response.text).not.toContain(devotionalDraftId);
    expect(response.text).not.toContain(animeArchivedId);
  });

  it('applies Universe scope through the same public endpoint', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({ query: '.', universeKey: 'universe.devotional' })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          resourceId: devotionalPublishedId,
          resourceType: 'devotional.temple',
          universeKey: 'universe.devotional',
        },
      ],
      pagination: { offset: 0, limit: 20 },
    });
    expect(response.text).not.toContain(animePublishedId);
  });

  it('supports exact Resource Type ANY-OF filters and pagination transport', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: '.',
        resourceType: ['devotional.temple', 'anime.character'],
        offset: '1',
        limit: '1',
      })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        {
          resourceId: animePublishedId,
          resourceType: 'anime.character',
          universeKey: 'universe.anime',
        },
      ],
      pagination: { offset: 1, limit: 1 },
    });
  });

  it.each([
    {
      label: 'invalid Universe key',
      query: { query: '.', universeKey: 'Devotional' },
    },
    {
      label: 'invalid Resource Type',
      query: { query: '.', resourceType: 'not canonical' },
    },
    {
      label: 'negative offset',
      query: { query: '.', offset: '-1' },
    },
    {
      label: 'zero limit',
      query: { query: '.', limit: '0' },
    },
    {
      label: 'unbounded public limit',
      query: { query: '.', limit: '101' },
    },
  ])('rejects $label transport input', async ({ query }) => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query(query)
      .set('X-Request-Id', 'discovery-public-invalid-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'discovery.search.invalid_request',
        message: 'The Search request is invalid.',
        status: 400,
        requestId: 'discovery-public-invalid-001',
      },
    });
  });
});
