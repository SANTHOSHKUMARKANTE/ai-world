import { randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { KNOWLEDGE_EDITOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Knowledge Entity API integration tests.');
}

const runMarker = `api-knowledge-entity-${randomUUID()}`;

function getSessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const setCookie = response.headers['set-cookie'];
  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;

  if (!header) {
    throw new Error('Expected a Session Set-Cookie header.');
  }

  const cookiePair = header.split(';')[0];
  if (!cookiePair?.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error('Expected the opaque Session cookie.');
  }

  return cookiePair;
}

describe('Knowledge Entity API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const resourceIds = new Set<string>();
  const assetIds = new Set<string>();

  async function cleanup(): Promise<void> {
    if (resourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: {
          id: {
            in: [...resourceIds],
          },
        },
      });
      resourceIds.clear();
    }

    if (assetIds.size > 0) {
      await database.asset.deleteMany({
        where: {
          id: {
            in: [...assetIds],
          },
        },
      });
      assetIds.clear();
    }

    const actorEmails = await database.actorEmail.findMany({
      where: {
        normalizedEmail: {
          contains: runMarker.toLowerCase(),
        },
      },
      select: {
        actorId: true,
      },
    });
    const actorIds = actorEmails.map(({ actorId }) => actorId);

    if (actorIds.length > 0) {
      await database.user.deleteMany({
        where: {
          actorId: {
            in: actorIds,
          },
        },
      });
      await database.actor.deleteMany({
        where: {
          id: {
            in: actorIds,
          },
        },
      });
    }
  }

  async function createResource(
    lifecycle: 'DRAFT' | 'PUBLISHED',
    resourceType = 'devotional.deity',
  ): Promise<string> {
    const id = randomUUID();
    resourceIds.add(id);
    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: 'universe.devotional',
        resourceType,
        lifecycle,
      },
    });
    return id;
  }

  async function createAsset(
    assetType: 'IMAGE' | 'VIDEO',
    lifecycle: 'ACTIVE' | 'ARCHIVED' = 'ACTIVE',
  ): Promise<string> {
    const id = randomUUID();
    assetIds.add(id);
    await database.asset.create({
      data: {
        id,
        assetType,
        mimeType: assetType === 'VIDEO' ? 'video/mp4' : 'image/png',
        sizeBytes: 1234,
        durationMs: assetType === 'VIDEO' ? 5000 : null,
        storageReference: `private/provider/${id}/original`,
        lifecycle,
      },
    });
    return id;
  }

  async function signInKnowledgeEditor(): Promise<string> {
    const email = `${runMarker}-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';

    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({ email, password })
      .expect(201);

    const role = await database.role.findUniqueOrThrow({
      where: {
        key: KNOWLEDGE_EDITOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    await database.actorRole.create({
      data: {
        actorId: registration.body.actorId as string,
        roleId: role.id,
      },
    });

    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({ email, password })
      .expect(200);

    return getSessionCookie(authentication);
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

  it('projects ordered public-safe media, filters unavailable Assets and selects semantic related previews', async () => {
    const shivaId = await createResource('PUBLISHED');
    const parvatiId = await createResource('PUBLISHED');
    const draftTargetId = await createResource('DRAFT');
    const cookie = await signInKnowledgeEditor();

    const shivaHero = await createAsset('IMAGE');
    const shivaArchivedGallery = await createAsset('IMAGE');
    const shivaVideo = await createAsset('VIDEO');
    const shivaVideoPoster = await createAsset('IMAGE');

    const parvatiGallery = await createAsset('IMAGE');
    const parvatiHeroVideo = await createAsset('VIDEO');
    const parvatiHeroPoster = await createAsset('IMAGE');

    await database.knowledgeResourceAssetReference.createMany({
      data: [
        {
          knowledgeResourceId: shivaId,
          assetId: shivaHero,
          role: 'HERO',
          playback: 'STILL',
          position: 0,
          altText: 'Shiva hero',
          caption: 'Primary Shiva image',
        },
        {
          knowledgeResourceId: shivaId,
          assetId: shivaArchivedGallery,
          role: 'GALLERY',
          playback: 'STILL',
          position: 1,
          altText: 'Unavailable gallery image',
        },
        {
          knowledgeResourceId: shivaId,
          assetId: shivaVideo,
          role: 'HIGHLIGHT',
          playback: 'SHORT_LOOP',
          position: 2,
          altText: 'Shiva short motion',
          caption: 'Motion highlight',
          posterAssetId: shivaVideoPoster,
        },
        {
          knowledgeResourceId: parvatiId,
          assetId: parvatiGallery,
          role: 'GALLERY',
          playback: 'STILL',
          position: 0,
          altText: 'Parvati gallery',
        },
        {
          knowledgeResourceId: parvatiId,
          assetId: parvatiHeroVideo,
          role: 'HERO',
          playback: 'SHORT_LOOP',
          position: 1,
          altText: 'Parvati hero motion',
          posterAssetId: parvatiHeroPoster,
        },
      ],
    });

    await database.asset.update({
      where: { id: shivaArchivedGallery },
      data: { lifecycle: 'ARCHIVED' },
    });

    await database.knowledgeResourceProfile.createMany({
      data: [
        {
          knowledgeResourceId: parvatiId,
          routeKey: 'universe.devotional/parvati',
          slug: 'parvati',
          displayName: 'Parvati',
          summary: 'Consort of Shiva.',
          facts: [],
        },
        {
          knowledgeResourceId: draftTargetId,
          routeKey: 'universe.devotional/draft-related',
          slug: 'draft-related',
          displayName: 'Draft Related',
          summary: 'Must not be public.',
          facts: [],
        },
      ],
    });

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${shivaId}/entity`)
      .set('Cookie', cookie)
      .send({
        profile: {
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary: 'The Supreme Yogi and a central deity of the Devotional Universe.',
          facts: [
            {
              key: 'devotional.mantra',
              label: 'Mantra',
              value: 'Om Namah Shivaya',
            },
          ],
        },
        relations: [
          {
            targetResourceId: parvatiId,
            sectionKey: 'entity.family',
            relationshipType: 'devotional.consort',
            position: 0,
          },
          {
            targetResourceId: draftTargetId,
            sectionKey: 'entity.family',
            relationshipType: 'devotional.association',
            position: 1,
          },
        ],
      })
      .expect(200);

    const publicResponse = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.devotional/shiva')
      .expect(200);

    expect(publicResponse.body).not.toHaveProperty('assetIds');
    expect(publicResponse.body.media).toEqual([
      {
        assetId: shivaHero,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Shiva hero',
        caption: 'Primary Shiva image',
        posterAssetId: null,
      },
      {
        assetId: shivaVideo,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        role: 'HIGHLIGHT',
        playback: 'SHORT_LOOP',
        position: 2,
        altText: 'Shiva short motion',
        caption: 'Motion highlight',
        durationMs: 5000,
        posterAssetId: shivaVideoPoster,
      },
    ]);

    const serialized = JSON.stringify(publicResponse.body);
    expect(serialized).not.toContain('storageReference');
    expect(serialized).not.toContain('private/provider/');
    expect(serialized).not.toContain('sizeBytes');

    expect(publicResponse.body.relations).toHaveLength(1);
    expect(publicResponse.body.relations[0]).toMatchObject({
      sectionKey: 'entity.family',
      relationshipType: 'devotional.consort',
      target: {
        id: parvatiId,
        slug: 'parvati',
        displayName: 'Parvati',
        previewAssetId: parvatiHeroPoster,
      },
    });
  });

  it('keeps an unpublished root Entity opaque', async () => {
    const shivaId = await createResource('DRAFT');

    await database.knowledgeResourceProfile.create({
      data: {
        knowledgeResourceId: shivaId,
        routeKey: 'universe.devotional/shiva-draft',
        slug: 'shiva-draft',
        displayName: 'Draft Shiva',
        summary: 'Not public.',
        facts: [],
      },
    });

    const response = await request(app.getHttpServer())
      .get('/knowledge/entities/universe.devotional/shiva-draft')
      .set('X-Request-Id', 'knowledge-entity-draft-001')
      .expect(404);

    expect(response.body).toEqual({
      error: {
        code: 'knowledge.entity.public_not_found',
        message: 'Knowledge Entity not found.',
        status: 404,
        requestId: 'knowledge-entity-draft-001',
      },
    });
  });
});
