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
  throw new Error('DATABASE_URL is required for Phase 6 Discovery Security integration tests.');
}

const alphaPublishedId = randomUUID();
const betaPublishedId = randomUUID();
const alphaInitialId = randomUUID();
const alphaDraftId = randomUUID();
const betaArchivedId = randomUUID();
const fixtureIds = [
  alphaPublishedId,
  betaPublishedId,
  alphaInitialId,
  alphaDraftId,
  betaArchivedId,
];

const alphaUniverseKey = 'security-review.alpha';
const betaUniverseKey = 'security-review.beta';
const unknownUniverseKey = 'security-review.unknown';
const templeType = 'security-review.temple';
const characterType = 'security-review.character';

describe('Phase 6 public Discovery Security', () => {
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
          id: alphaPublishedId,
          universeKey: alphaUniverseKey,
          resourceType: templeType,
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-18T10:05:00.000Z'),
        },
        {
          id: betaPublishedId,
          universeKey: betaUniverseKey,
          resourceType: characterType,
          lifecycle: 'PUBLISHED',
          createdAt: new Date('2026-08-18T10:04:00.000Z'),
        },
        {
          id: alphaInitialId,
          universeKey: alphaUniverseKey,
          resourceType: templeType,
          lifecycle: 'INITIAL',
          createdAt: new Date('2026-08-18T10:08:00.000Z'),
        },
        {
          id: alphaDraftId,
          universeKey: alphaUniverseKey,
          resourceType: templeType,
          lifecycle: 'DRAFT',
          createdAt: new Date('2026-08-18T10:07:00.000Z'),
        },
        {
          id: betaArchivedId,
          universeKey: betaUniverseKey,
          resourceType: characterType,
          lifecycle: 'ARCHIVED',
          createdAt: new Date('2026-08-18T10:06:00.000Z'),
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

  it('exposes only PUBLISHED resources through anonymous global Search and minimizes result data', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: 'security-review',
        resourceType: [templeType, characterType],
        offset: '0',
        limit: '20',
      })
      .expect(200);

    expect(response.body).toEqual({
      items: [
        { resourceId: alphaPublishedId, resourceType: templeType, universeKey: alphaUniverseKey },
        { resourceId: betaPublishedId, resourceType: characterType, universeKey: betaUniverseKey },
      ],
      pagination: { offset: 0, limit: 20 },
    });
    expect(response.text).not.toContain(alphaInitialId);
    expect(response.text).not.toContain(alphaDraftId);
    expect(response.text).not.toContain(betaArchivedId);
    for (const item of response.body.items as Array<Record<string, unknown>>) {
      expect(Object.keys(item).sort()).toEqual(
        ['resourceId', 'resourceType', 'universeKey'].sort(),
      );
      expect(item).not.toHaveProperty('lifecycle');
      expect(item).not.toHaveProperty('createdAt');
      expect(item).not.toHaveProperty('updatedAt');
    }
  });

  it('does not allow Universe scope to fall back or be bypassed by a cross-Universe filter', async () => {
    const scoped = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: 'security-review',
        universeKey: alphaUniverseKey,
        resourceType: [templeType, characterType],
      })
      .expect(200);
    expect(scoped.body.items).toEqual([
      { resourceId: alphaPublishedId, resourceType: templeType, universeKey: alphaUniverseKey },
    ]);
    expect(scoped.text).not.toContain(betaPublishedId);

    const crossUniverseFilter = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: 'security-review',
        universeKey: alphaUniverseKey,
        resourceType: characterType,
      })
      .expect(200);
    expect(crossUniverseFilter.body.items).toEqual([]);

    const unknownScope = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: 'security-review',
        universeKey: unknownUniverseKey,
        resourceType: [templeType, characterType],
      })
      .expect(200);
    expect(unknownScope.body.items).toEqual([]);
  });

  it.each([
    { label: 'INITIAL', id: alphaInitialId },
    { label: 'DRAFT', id: alphaDraftId },
    { label: 'ARCHIVED', id: betaArchivedId },
  ])(
    'does not expose a $label resource through direct public Resource navigation',
    async ({ id }) => {
      const response = await request(app.getHttpServer())
        .get(`/knowledge/resources/${id}`)
        .expect(404);
      expect(response.body.error).toMatchObject({
        code: 'knowledge.public.resource_not_found',
        message: 'Knowledge Resource not found.',
        status: 404,
      });
    },
  );

  it('keeps a PUBLISHED Search result reachable through the public Resource route', async () => {
    const response = await request(app.getHttpServer())
      .get(`/knowledge/resources/${alphaPublishedId}`)
      .expect(200);
    expect(response.body).toMatchObject({
      id: alphaPublishedId,
      universeKey: alphaUniverseKey,
      resourceType: templeType,
    });
    expect(response.body).not.toHaveProperty('lifecycle');
  });

  it('treats SQL-like query input literally instead of broadening Search', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({ query: "' OR 1=1 --", resourceType: [templeType, characterType] })
      .expect(200);
    expect(response.body).toEqual({ items: [], pagination: { offset: 0, limit: 20 } });
  });

  it('rejects caller-controlled visibility selectors instead of allowing hidden-resource opt-in', async () => {
    const response = await request(app.getHttpServer())
      .get('/discovery/search')
      .query({
        query: 'security-review',
        resourceType: [templeType, characterType],
        includeHidden: 'true',
      })
      .set('X-Request-Id', 'discovery-security-hidden-selector-001')
      .expect(400);
    expect(response.body).toEqual({
      error: {
        code: 'discovery.search.invalid_request',
        message: 'The Search request is invalid.',
        status: 400,
        requestId: 'discovery-security-hidden-selector-001',
      },
    });
  });
});
