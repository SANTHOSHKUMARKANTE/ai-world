import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { CreateKnowledgeResource } from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { ANIME_SERIES_RESOURCE_TYPE, ANIME_UNIVERSE_KEY } from '@ai-world/universe-anime';
import {
  DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
  DEVOTIONAL_UNIVERSE_KEY,
} from '@ai-world/universe-devotional';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Favorite API integration tests.');
}

const runMarker = `api-favorites-${randomUUID()}`;

function getSessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const setCookie = response.headers['set-cookie'];
  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  const cookiePair = header?.split(';')[0];

  if (!cookiePair?.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }

  return cookiePair;
}

interface SignedInFixture {
  readonly actorId: string;
  readonly userId: string;
  readonly cookiePair: string;
}

describe('P9-M01 Favorite API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  let createKnowledgeResource: CreateKnowledgeResource;
  const knowledgeResourceIds = new Set<string>();

  async function actorIds(): Promise<string[]> {
    const emails = await database.actorEmail.findMany({
      where: {
        normalizedEmail: {
          contains: runMarker.toLowerCase(),
        },
      },
      select: { actorId: true },
    });

    return emails.map(({ actorId }) => actorId);
  }

  async function cleanupFixtures(): Promise<void> {
    const actors = await actorIds();
    const users =
      actors.length === 0
        ? []
        : await database.user.findMany({
            where: { actorId: { in: actors } },
            select: { id: true },
          });
    const userIds = users.map(({ id }) => id);

    if (userIds.length > 0) {
      await database.favorite.deleteMany({ where: { userId: { in: userIds } } });
    }

    if (knowledgeResourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: { id: { in: [...knowledgeResourceIds] } },
      });
      knowledgeResourceIds.clear();
    }

    if (userIds.length > 0) {
      await database.user.deleteMany({ where: { id: { in: userIds } } });
    }

    if (actors.length > 0) {
      await database.actor.deleteMany({ where: { id: { in: actors } } });
    }
  }

  async function signInFixture(label: string): Promise<SignedInFixture> {
    const email = `${runMarker}-${label}-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';
    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({ email, password })
      .expect(201);
    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({ email, password })
      .expect(200);

    return {
      actorId: registration.body.actorId as string,
      userId: registration.body.userId as string,
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function createCrossUniverseResources(): Promise<{
    readonly devotionalResourceId: string;
    readonly animeResourceId: string;
  }> {
    const devotional = await createKnowledgeResource.execute({
      universeKey: DEVOTIONAL_UNIVERSE_KEY,
      resourceType: DEVOTIONAL_SCRIPTURE_RESOURCE_TYPE,
    });
    const anime = await createKnowledgeResource.execute({
      universeKey: ANIME_UNIVERSE_KEY,
      resourceType: ANIME_SERIES_RESOURCE_TYPE,
    });

    knowledgeResourceIds.add(devotional.id);
    knowledgeResourceIds.add(anime.id);

    return {
      devotionalResourceId: devotional.id,
      animeResourceId: anime.id,
    };
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    createKnowledgeResource = new CreateKnowledgeResource(
      new PrismaKnowledgeResourceRepository(database),
    );

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

  afterEach(cleanupFixtures);

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('requires a valid Session before Favorite transport validation', async () => {
    const response = await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('X-Request-Id', 'favorite-no-session-001')
      .send({ resourceId: 'not-a-resource-id' })
      .expect('X-Request-Id', 'favorite-no-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'favorite-no-session-001',
      },
    });
  });

  it('idempotently favorites generic Resources from Devotional and Anime', async () => {
    const fixture = await signInFixture('cross-universe');
    const { devotionalResourceId, animeResourceId } = await createCrossUniverseResources();

    const devotional = await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: devotionalResourceId })
      .expect(200);
    const duplicate = await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: devotionalResourceId })
      .expect(200);
    await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: animeResourceId })
      .expect(200);

    expect(duplicate.body).toEqual(devotional.body);
    expect(devotional.body).toMatchObject({ resourceId: devotionalResourceId });
    expect(devotional.body).not.toHaveProperty('userId');
    expect(devotional.body).not.toHaveProperty('actorId');

    const list = await request(app.getHttpServer())
      .get('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .expect(200);

    expect(
      (list.body.favorites as { resourceId: string }[]).map(({ resourceId }) => resourceId).sort(),
    ).toEqual([devotionalResourceId, animeResourceId].sort());
    expect(await database.favorite.count({ where: { userId: fixture.userId } })).toBe(2);
  });

  it('derives User ownership from the Session and isolates removal', async () => {
    const first = await signInFixture('first-user');
    const second = await signInFixture('second-user');
    const { devotionalResourceId } = await createCrossUniverseResources();

    await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', first.cookiePair)
      .send({ resourceId: devotionalResourceId })
      .expect(200);
    await request(app.getHttpServer())
      .delete(`/engagement/favorites/${devotionalResourceId}`)
      .set('Cookie', second.cookiePair)
      .expect(204);

    expect(
      await database.favorite.count({
        where: { userId: first.userId, resourceId: devotionalResourceId },
      }),
    ).toBe(1);
    expect(await database.favorite.count({ where: { userId: second.userId } })).toBe(0);

    await request(app.getHttpServer())
      .delete(`/engagement/favorites/${devotionalResourceId}`)
      .set('Cookie', first.cookiePair)
      .expect(204);
    await request(app.getHttpServer())
      .delete(`/engagement/favorites/${devotionalResourceId}`)
      .set('Cookie', first.cookiePair)
      .expect(204);

    expect(await database.favorite.count({ where: { userId: first.userId } })).toBe(0);
  });

  it('rejects invalid identifiers and client-supplied User ownership', async () => {
    const fixture = await signInFixture('invalid-input');

    const invalidId = await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'favorite-invalid-id-001')
      .send({ resourceId: 'not-a-resource-id' })
      .expect('X-Request-Id', 'favorite-invalid-id-001')
      .expect(400);

    expect(invalidId.body.error.code).toBe('engagement.favorite.invalid_input');

    const ownershipInjection = await request(app.getHttpServer())
      .post('/engagement/favorites')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'favorite-user-injection-001')
      .send({
        resourceId: randomUUID(),
        userId: randomUUID(),
      })
      .expect('X-Request-Id', 'favorite-user-injection-001')
      .expect(400);

    expect(ownershipInjection.body.error.code).toBe('engagement.favorite.invalid_request');
    expect(await database.favorite.count({ where: { userId: fixture.userId } })).toBe(0);
  });
});
