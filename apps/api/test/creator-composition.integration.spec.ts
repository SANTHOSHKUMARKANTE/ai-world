import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { ADMINISTRATOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import type { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Creator Composition API integration tests.');
}

const runMarker = `api-creator-composition-${randomUUID()}`;

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

interface ActorFixture {
  readonly actorId: string;
  readonly cookiePair: string;
}

describe('Creator Composition API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const pageIds = new Set<string>();
  const blockIds = new Set<string>();
  const knowledgeIds = new Set<string>();
  const assetIds = new Set<string>();

  async function cleanupFixtures(): Promise<void> {
    if (pageIds.size > 0) {
      await database.compositionPage.deleteMany({ where: { id: { in: [...pageIds] } } });
      pageIds.clear();
    }
    if (blockIds.size > 0) {
      await database.compositionBlock.deleteMany({ where: { id: { in: [...blockIds] } } });
      blockIds.clear();
    }
    if (knowledgeIds.size > 0) {
      await database.knowledgeResource.deleteMany({ where: { id: { in: [...knowledgeIds] } } });
      knowledgeIds.clear();
    }
    if (assetIds.size > 0) {
      await database.asset.deleteMany({ where: { id: { in: [...assetIds] } } });
      assetIds.clear();
    }

    const emails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: runMarker.toLowerCase() } },
      select: { actorId: true },
    });
    const actorIds = emails.map(({ actorId }) => actorId);
    if (actorIds.length > 0) {
      await database.user.deleteMany({ where: { actorId: { in: actorIds } } });
      await database.actor.deleteMany({ where: { id: { in: actorIds } } });
    }
  }

  async function signIn(label: string): Promise<ActorFixture> {
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
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function signInAdministrator(label: string): Promise<ActorFixture> {
    const actor = await signIn(label);
    const role = await database.role.findUniqueOrThrow({
      where: { key: ADMINISTRATOR_ROLE_KEY },
      select: { id: true },
    });
    await database.actorRole.create({ data: { actorId: actor.actorId, roleId: role.id } });
    return actor;
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanupFixtures();
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

  it('requires a Session before Page creation', async () => {
    const response = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('X-Request-Id', 'composition-creator-no-session-001')
      .send({ universeKey: 'INVALID', routePath: 'INVALID', title: '' })
      .expect(401);

    expect(response.body.error).toMatchObject({
      code: 'identity.session.invalid',
      message: 'Authentication is required.',
      requestId: 'composition-creator-no-session-001',
    });
  });

  it('denies an ordinary Actor before transport or canonical validation', async () => {
    const actor = await signIn('ordinary');
    const pageCountBefore = await database.compositionPage.count();
    const response = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', actor.cookiePair)
      .send({ unexpected: true })
      .expect(403);

    expect(response.body.error).toMatchObject({
      code: 'composition.authorization.forbidden',
      message: 'You do not have permission to perform this action.',
    });
    await expect(database.compositionPage.count()).resolves.toBe(pageCountBefore);
  });

  it('allows an Administrator to create and reload an ordered multi-owner Page composition', async () => {
    const administrator = await signInAdministrator('administrator');
    const pageResponse = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', administrator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        routePath: `/creator-${randomUUID()}`,
        title: 'Creator composition proof',
      })
      .expect(201);
    const pageId = pageResponse.body.id as string;
    pageIds.add(pageId);

    const blockResponse = await request(app.getHttpServer())
      .post('/composition/blocks/text')
      .set('Cookie', administrator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        text: 'A structured creator Block.',
      })
      .expect(201);
    const blockId = blockResponse.body.id as string;
    blockIds.add(blockId);

    const knowledgeId = randomUUID();
    knowledgeIds.add(knowledgeId);
    await database.knowledgeResource.create({
      data: {
        id: knowledgeId,
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        lifecycle: 'DRAFT',
      },
    });

    const assetId = randomUUID();
    assetIds.add(assetId);
    await database.asset.create({
      data: {
        id: assetId,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        sizeBytes: 1,
        storageReference: `${runMarker}/${assetId}.png`,
        lifecycle: 'ACTIVE',
      },
    });

    const saved = await request(app.getHttpServer())
      .put(`/composition/pages/${pageId}/composition`)
      .set('Cookie', administrator.cookiePair)
      .send({
        items: [
          { kind: 'KNOWLEDGE_RESOURCE', id: knowledgeId },
          { kind: 'BLOCK', id: blockId },
          { kind: 'MEDIA_ASSET', id: assetId },
        ],
      })
      .expect(200);

    expect(saved.body).toEqual({
      pageId,
      items: [
        { position: 0, kind: 'KNOWLEDGE_RESOURCE', id: knowledgeId },
        { position: 1, kind: 'BLOCK', id: blockId },
        { position: 2, kind: 'MEDIA_ASSET', id: assetId },
      ],
    });

    await request(app.getHttpServer())
      .get(`/composition/pages/${pageId}`)
      .set('Cookie', administrator.cookiePair)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: pageId,
          universeKey: 'universe.devotional',
          title: 'Creator composition proof',
          lifecycle: 'DRAFT',
        });
      });

    await request(app.getHttpServer())
      .get(`/composition/blocks/${blockId}`)
      .set('Cookie', administrator.cookiePair)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          id: blockId,
          blockType: 'composition.block.text',
          text: 'A structured creator Block.',
        });
      });

    await request(app.getHttpServer())
      .get(`/composition/pages/${pageId}/composition`)
      .set('Cookie', administrator.cookiePair)
      .expect(200)
      .expect(saved.body);
  });

  it('returns safe validation semantics for authenticated malformed requests', async () => {
    const administrator = await signInAdministrator('invalid-request');
    const response = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', administrator.cookiePair)
      .send({ universeKey: 'universe.devotional', routePath: '/missing-title' })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: 'composition.creator.invalid_request',
      message: 'The creator Composition request is invalid.',
    });
  });

  it('rejects cross-Universe references without replacing Page composition', async () => {
    const administrator = await signInAdministrator('cross-universe');
    const page = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', administrator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        routePath: `/scope-${randomUUID()}`,
        title: 'Scope proof',
      })
      .expect(201);
    pageIds.add(page.body.id as string);

    const block = await request(app.getHttpServer())
      .post('/composition/blocks/text')
      .set('Cookie', administrator.cookiePair)
      .send({ universeKey: 'universe.anime', text: 'Anime-only Block.' })
      .expect(201);
    blockIds.add(block.body.id as string);

    const response = await request(app.getHttpServer())
      .put(`/composition/pages/${page.body.id as string}/composition`)
      .set('Cookie', administrator.cookiePair)
      .send({ items: [{ kind: 'BLOCK', id: block.body.id as string }] })
      .expect(400);

    expect(response.body.error).toMatchObject({
      code: 'composition.creator.invalid_input',
      message: 'The creator Composition input is invalid.',
    });
    await expect(
      database.compositionPageItem.count({ where: { pageId: page.body.id as string } }),
    ).resolves.toBe(0);
  });
});
