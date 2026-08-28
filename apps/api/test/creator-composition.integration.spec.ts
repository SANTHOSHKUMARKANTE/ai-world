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

  it('controls draft preview before identifier validation', async () => {
    await request(app.getHttpServer())
      .get('/composition/pages/not-a-resource-id/preview')
      .expect(401);

    const actor = await signIn('ordinary-preview');
    const response = await request(app.getHttpServer())
      .get('/composition/pages/not-a-resource-id/preview')
      .set('Cookie', actor.cookiePair)
      .expect(403);

    expect(response.body.error).toMatchObject({
      code: 'composition.preview.authorization.forbidden',
      message: 'You do not have permission to preview draft composition.',
    });
  });

  it('authorizes and enforces the Page publication lifecycle', async () => {
    await request(app.getHttpServer())
      .get('/composition/public/pages/not-a-resource-id')
      .expect(404)
      .expect(({ body }) => {
        expect(body.error).toMatchObject({
          code: 'composition.public.not_found',
          message: 'The published Experience was not found.',
        });
      });

    const ordinary = await signIn('ordinary-publisher');
    const denied = await request(app.getHttpServer())
      .post('/composition/pages/not-a-resource-id/publish')
      .set('Cookie', ordinary.cookiePair)
      .expect(403);

    expect(denied.body.error).toMatchObject({
      code: 'composition.publication.authorization.forbidden',
      message: 'You do not have permission to publish this Page.',
    });

    const archiveDenied = await request(app.getHttpServer())
      .post('/composition/pages/not-a-resource-id/archive')
      .set('Cookie', ordinary.cookiePair)
      .expect(403);
    expect(archiveDenied.body.error).toMatchObject({
      code: 'composition.publication.authorization.forbidden',
      message: 'You do not have permission to archive this Page.',
    });

    const administrator = await signInAdministrator('publication-administrator');
    const created = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', administrator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        routePath: `/publication-${randomUUID()}`,
        title: 'Publication lifecycle proof',
      })
      .expect(201);
    const pageId = created.body.id as string;
    pageIds.add(pageId);

    await request(app.getHttpServer())
      .get(`/composition/public/pages/${pageId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body.error).toMatchObject({
          code: 'composition.public.not_found',
          message: 'The published Experience was not found.',
        });
      });

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/publish`)
      .set('Cookie', administrator.cookiePair)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: pageId, lifecycle: 'PUBLISHED' });
      });

    await request(app.getHttpServer())
      .get(`/composition/public/pages/${pageId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toMatchObject({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            lifecycle: 'PUBLISHED',
          },
          items: [],
        });
      });

    const lockedEdit = await request(app.getHttpServer())
      .put(`/composition/pages/${pageId}/composition`)
      .set('Cookie', administrator.cookiePair)
      .send({ items: [] })
      .expect(409);
    expect(lockedEdit.body.error).toMatchObject({
      code: 'composition.page.lifecycle_conflict',
      message: 'Published or archived Page composition cannot be edited.',
    });

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/publish`)
      .set('Cookie', administrator.cookiePair)
      .expect(409);

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/archive`)
      .set('Cookie', administrator.cookiePair)
      .expect(201)
      .expect(({ body }) => {
        expect(body).toMatchObject({ id: pageId, lifecycle: 'ARCHIVED' });
      });

    await request(app.getHttpServer())
      .get(`/composition/public/pages/${pageId}`)
      .expect(404)
      .expect(({ body }) => {
        expect(body.error).toMatchObject({
          code: 'composition.public.not_found',
          message: 'The published Experience was not found.',
        });
      });

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/archive`)
      .set('Cookie', administrator.cookiePair)
      .expect(409);
    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/publish`)
      .set('Cookie', administrator.cookiePair)
      .expect(409);
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

    await request(app.getHttpServer())
      .post(`/composition/pages/${pageId}/publish`)
      .set('Cookie', administrator.cookiePair)
      .expect(201);

    await request(app.getHttpServer())
      .get(`/composition/public/pages/${pageId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.page).toMatchObject({
          id: pageId,
          lifecycle: 'PUBLISHED',
        });
        expect(body.items).toEqual([
          {
            position: 1,
            kind: 'BLOCK',
            id: blockId,
            blockType: 'composition.block.text',
            text: 'A structured creator Block.',
          },
          {
            position: 2,
            kind: 'MEDIA_ASSET',
            id: assetId,
            assetType: 'IMAGE',
          },
        ]);
        expect(JSON.stringify(body)).not.toContain(knowledgeId);
      });
  });

  it('allows an Administrator to resolve a saved draft preview through owner contracts', async () => {
    const administrator = await signInAdministrator('preview-administrator');
    const pageResponse = await request(app.getHttpServer())
      .post('/composition/pages')
      .set('Cookie', administrator.cookiePair)
      .send({
        universeKey: 'universe.devotional',
        routePath: `/preview-${randomUUID()}`,
        title: 'Controlled draft preview',
      })
      .expect(201);
    const pageId = pageResponse.body.id as string;
    pageIds.add(pageId);

    const blockResponse = await request(app.getHttpServer())
      .post('/composition/blocks/text')
      .set('Cookie', administrator.cookiePair)
      .send({ universeKey: 'universe.devotional', text: 'Resolved preview text.' })
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

    await request(app.getHttpServer())
      .put(`/composition/pages/${pageId}/composition`)
      .set('Cookie', administrator.cookiePair)
      .send({
        items: [
          { kind: 'BLOCK', id: blockId },
          { kind: 'KNOWLEDGE_RESOURCE', id: knowledgeId },
          { kind: 'MEDIA_ASSET', id: assetId },
        ],
      })
      .expect(200);

    await request(app.getHttpServer())
      .get(`/composition/pages/${pageId}/preview`)
      .set('Cookie', administrator.cookiePair)
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: pageResponse.body.routePath,
            title: 'Controlled draft preview',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: blockId,
              blockType: 'composition.block.text',
              text: 'Resolved preview text.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: knowledgeId,
              resourceType: 'devotional.deity',
              lifecycle: 'DRAFT',
            },
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: assetId,
              assetType: 'IMAGE',
            },
          ],
        });
      });

    await request(app.getHttpServer())
      .get(`/composition/pages/${randomUUID()}/preview`)
      .set('Cookie', administrator.cookiePair)
      .expect(404);
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
