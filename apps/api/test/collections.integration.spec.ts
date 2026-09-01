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
  throw new Error('DATABASE_URL is required for Collection API integration tests.');
}

const runMarker = `api-collections-${randomUUID()}`;

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
  readonly userId: string;
  readonly cookiePair: string;
}

describe('P9-M02 Collection API', () => {
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
      const collectionIds = (
        await database.collection.findMany({
          where: { userId: { in: userIds } },
          select: { id: true },
        })
      ).map(({ id }) => id);

      if (collectionIds.length > 0) {
        await database.collectionResource.deleteMany({
          where: { collectionId: { in: collectionIds } },
        });
      }

      await database.collection.deleteMany({
        where: { userId: { in: userIds } },
      });
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

  it('requires Session validation before Collection transport validation', async () => {
    const response = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('X-Request-Id', 'collection-no-session-001')
      .send({ name: 42 })
      .expect('X-Request-Id', 'collection-no-session-001')
      .expect(401);

    expect(response.body.error.code).toBe('identity.session.invalid');
  });

  it('creates and lists only the acting User Collections', async () => {
    const first = await signInFixture('first');
    const second = await signInFixture('second');

    const created = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', first.cookiePair)
      .send({ name: '  Watch Later  ' })
      .expect(201);

    expect(created.body).toMatchObject({ name: 'Watch Later' });
    expect(created.body).not.toHaveProperty('userId');
    expect(created.body).not.toHaveProperty('actorId');

    await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', second.cookiePair)
      .send({ name: 'Other User' })
      .expect(201);

    const firstList = await request(app.getHttpServer())
      .get('/engagement/collections')
      .set('Cookie', first.cookiePair)
      .expect(200);

    expect(firstList.body.collections).toHaveLength(1);
    expect(firstList.body.collections[0]).toMatchObject({
      id: created.body.id,
      name: 'Watch Later',
    });

    expect(await database.collection.count({ where: { userId: first.userId } })).toBe(1);
    expect(await database.collection.count({ where: { userId: second.userId } })).toBe(1);
  });

  it('idempotently groups Devotional and Anime Resources through one generic contract', async () => {
    const fixture = await signInFixture('cross-universe');
    const collection = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', fixture.cookiePair)
      .send({ name: 'Cross Universe' })
      .expect(201);
    const { devotionalResourceId, animeResourceId } = await createCrossUniverseResources();

    const first = await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: devotionalResourceId })
      .expect(200);

    const duplicate = await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: devotionalResourceId })
      .expect(200);

    await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', fixture.cookiePair)
      .send({ resourceId: animeResourceId })
      .expect(200);

    expect(duplicate.body).toEqual(first.body);
    expect(first.body).not.toHaveProperty('userId');
    expect(first.body).not.toHaveProperty('collectionId');

    const resources = await request(app.getHttpServer())
      .get(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', fixture.cookiePair)
      .expect(200);

    expect(
      (resources.body.resources as { resourceId: string }[])
        .map(({ resourceId }) => resourceId)
        .sort(),
    ).toEqual([devotionalResourceId, animeResourceId].sort());

    expect(
      await database.collectionResource.count({
        where: { collectionId: collection.body.id as string },
      }),
    ).toBe(2);
  });

  it('prevents cross-User membership mutation and rejects ownership injection', async () => {
    const owner = await signInFixture('owner');
    const other = await signInFixture('other');

    const collection = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', owner.cookiePair)
      .send({ name: 'Private List' })
      .expect(201);

    const resourceId = randomUUID();

    await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', other.cookiePair)
      .send({ resourceId })
      .expect(400);

    const injection = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', owner.cookiePair)
      .set('X-Request-Id', 'collection-owner-injection-001')
      .send({
        name: 'Injected',
        userId: other.userId,
      })
      .expect('X-Request-Id', 'collection-owner-injection-001')
      .expect(400);

    expect(injection.body.error.code).toBe('engagement.collection.invalid_request');

    await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', owner.cookiePair)
      .send({ resourceId })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/engagement/collections/${collection.body.id}/resources/${resourceId}`)
      .set('Cookie', other.cookiePair)
      .expect(400);

    expect(
      await database.collectionResource.count({
        where: {
          collectionId: collection.body.id as string,
          resourceId,
        },
      }),
    ).toBe(1);

    await request(app.getHttpServer())
      .delete(`/engagement/collections/${collection.body.id}/resources/${resourceId}`)
      .set('Cookie', owner.cookiePair)
      .expect(204);
    await request(app.getHttpServer())
      .delete(`/engagement/collections/${collection.body.id}/resources/${resourceId}`)
      .set('Cookie', owner.cookiePair)
      .expect(204);
  });

  it('deletes only the acting User owned Collection and cascades memberships', async () => {
    const owner = await signInFixture('delete-owner');
    const other = await signInFixture('delete-other');
    const collection = await request(app.getHttpServer())
      .post('/engagement/collections')
      .set('Cookie', owner.cookiePair)
      .send({ name: 'Delete me' })
      .expect(201);
    const resourceId = randomUUID();

    await request(app.getHttpServer())
      .post(`/engagement/collections/${collection.body.id}/resources`)
      .set('Cookie', owner.cookiePair)
      .send({ resourceId })
      .expect(200);

    await request(app.getHttpServer())
      .delete(`/engagement/collections/${collection.body.id}`)
      .set('Cookie', other.cookiePair)
      .expect(204);
    expect(await database.collection.count({ where: { id: collection.body.id as string } })).toBe(
      1,
    );

    await request(app.getHttpServer())
      .delete(`/engagement/collections/${collection.body.id}`)
      .set('Cookie', owner.cookiePair)
      .expect(204);
    expect(await database.collection.count({ where: { id: collection.body.id as string } })).toBe(
      0,
    );
    expect(
      await database.collectionResource.count({
        where: { collectionId: collection.body.id as string },
      }),
    ).toBe(0);
  });
});
