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
  throw new Error('DATABASE_URL is required for Knowledge Media integration tests.');
}

const runMarker = `api-knowledge-media-${randomUUID()}`;

function createFixtureEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

function getSessionCookie(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const setCookie = response.headers['set-cookie'];
  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;
  if (!header) throw new Error('Expected a Session Set-Cookie header.');
  const cookiePair = header.split(';')[0];
  if (!cookiePair) throw new Error('Expected a Session cookie pair.');
  if (!cookiePair.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }
  return cookiePair;
}

interface ActorFixture {
  readonly actorId: string;
  readonly cookiePair: string;
}

describe('Knowledge Media Placement Integration API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  const createdResourceIds = new Set<string>();
  const createdAssetIds = new Set<string>();

  async function cleanupFixtures(): Promise<void> {
    if (createdResourceIds.size > 0) {
      await database.knowledgeResource.deleteMany({
        where: { id: { in: [...createdResourceIds] } },
      });
      createdResourceIds.clear();
    }

    if (createdAssetIds.size > 0) {
      await database.asset.deleteMany({ where: { id: { in: [...createdAssetIds] } } });
      createdAssetIds.clear();
    }

    const actorEmails = await database.actorEmail.findMany({
      where: { normalizedEmail: { contains: runMarker.toLowerCase() } },
      select: { actorId: true },
    });
    const actorIds = actorEmails.map(({ actorId }) => actorId);
    if (actorIds.length === 0) return;

    await database.user.deleteMany({ where: { actorId: { in: actorIds } } });
    await database.actor.deleteMany({ where: { id: { in: actorIds } } });
  }

  async function signInFixture(label: string): Promise<ActorFixture> {
    const email = createFixtureEmail(label);
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

  async function grantKnowledgeEditorRole(actorId: string): Promise<void> {
    const role = await database.role.findUniqueOrThrow({
      where: { key: KNOWLEDGE_EDITOR_ROLE_KEY },
      select: { id: true },
    });
    await database.actorRole.create({ data: { actorId, roleId: role.id } });
  }

  async function signInKnowledgeEditor(label: string): Promise<ActorFixture> {
    const fixture = await signInFixture(label);
    await grantKnowledgeEditorRole(fixture.actorId);
    return fixture;
  }

  async function createKnowledgeResource(lifecycle: 'DRAFT' | 'PUBLISHED' = 'DRAFT') {
    const id = randomUUID();
    createdResourceIds.add(id);
    await database.knowledgeResource.create({
      data: {
        id,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        lifecycle,
      },
    });
    return id;
  }

  async function createAsset(
    input: {
      readonly assetType?: 'IMAGE' | 'VIDEO';
      readonly lifecycle?: 'ACTIVE' | 'ARCHIVED';
      readonly durationMs?: number | null;
    } = {},
  ) {
    const id = randomUUID();
    const assetType = input.assetType ?? 'IMAGE';
    const lifecycle = input.lifecycle ?? 'ACTIVE';
    createdAssetIds.add(id);

    await database.asset.create({
      data: {
        id,
        assetType,
        mimeType: assetType === 'VIDEO' ? 'video/mp4' : 'image/png',
        sizeBytes: 4,
        durationMs:
          input.durationMs === undefined ? (assetType === 'VIDEO' ? 5000 : null) : input.durationMs,
        storageReference: `test/knowledge-media/${id}/original`,
        lifecycle,
      },
    });

    return id;
  }

  beforeAll(async () => {
    database = createDatabaseClient({ connectionString: databaseUrl });
    await cleanupFixtures();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule.register({ databaseUrl, environment: 'test', logLevel: 'fatal' })],
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

  it('requires a Session before replacing Knowledge media placements', async () => {
    await request(app.getHttpServer())
      .put(`/knowledge/resources/${randomUUID()}/media`)
      .send({ placements: [] })
      .expect(401);
  });

  it('denies an ordinary Actor before canonical Knowledge or Media validation', async () => {
    const actor = await signInFixture('ordinary');

    const response = await request(app.getHttpServer())
      .put('/knowledge/resources/not-a-resource-id/media')
      .set('Cookie', actor.cookiePair)
      .send({
        placements: [
          {
            assetId: 'not-an-asset-id',
            role: 'GALLERY',
            playback: 'STILL',
            altText: 'Invalid',
          },
        ],
      })
      .expect(403);

    expect(response.body.error.code).toBe('knowledge.authorization.forbidden');
  });

  it('returns controlled Knowledge validation for a malformed Resource ID after authorization', async () => {
    const editor = await signInKnowledgeEditor('editor-invalid-resource');

    const response = await request(app.getHttpServer())
      .put('/knowledge/resources/not-a-resource-id/media')
      .set('Cookie', editor.cookiePair)
      .send({ placements: [] })
      .expect(400);

    expect(response.body.error.code).toBe('knowledge.resource.invalid_input');
  });

  it('replaces IMAGE placements in request order and keeps DRAFT compatibility reads private', async () => {
    const editor = await signInKnowledgeEditor('editor-image-order');
    const resourceId = await createKnowledgeResource('DRAFT');
    const galleryId = await createAsset();
    const heroId = await createAsset();

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId: heroId,
            role: 'HERO',
            playback: 'STILL',
            altText: ' Naruto hero portrait ',
            caption: ' Hero ',
          },
          {
            assetId: galleryId,
            role: 'GALLERY',
            playback: 'STILL',
            altText: 'Naruto gallery image',
          },
        ],
      })
      .expect(200);

    expect(response.body).toEqual({
      placements: [
        {
          assetId: heroId,
          role: 'HERO',
          playback: 'STILL',
          position: 0,
          altText: 'Naruto hero portrait',
          caption: 'Hero',
          posterAssetId: null,
        },
        {
          assetId: galleryId,
          role: 'GALLERY',
          playback: 'STILL',
          position: 1,
          altText: 'Naruto gallery image',
          caption: null,
          posterAssetId: null,
        },
      ],
    });
    expect(JSON.stringify(response.body)).not.toContain('storageReference');

    const rows = await database.knowledgeResourceAssetReference.findMany({
      where: { knowledgeResourceId: resourceId },
      orderBy: { position: 'asc' },
    });

    expect(rows).toMatchObject([
      {
        knowledgeResourceId: resourceId,
        assetId: heroId,
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Naruto hero portrait',
        caption: 'Hero',
        posterAssetId: null,
      },
      {
        knowledgeResourceId: resourceId,
        assetId: galleryId,
        role: 'GALLERY',
        playback: 'STILL',
        position: 1,
        altText: 'Naruto gallery image',
        caption: null,
        posterAssetId: null,
      },
    ]);

    await request(app.getHttpServer()).get(`/knowledge/resources/${resourceId}/assets`).expect(404);
  });

  it('keeps Resource asset-ID compatibility while Entity publishes ordered Media descriptors', async () => {
    const editor = await signInKnowledgeEditor('editor-public-order');
    const resourceId = await createKnowledgeResource('PUBLISHED');
    const firstId = await createAsset();
    const secondId = await createAsset();
    const slug = `naruto-${randomUUID()}`;

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId: secondId,
            role: 'HERO',
            playback: 'STILL',
            altText: 'Hero',
          },
          {
            assetId: firstId,
            role: 'GALLERY',
            playback: 'STILL',
            altText: 'Gallery',
          },
        ],
      })
      .expect(200);

    await database.knowledgeResourceProfile.create({
      data: {
        knowledgeResourceId: resourceId,
        routeKey: `universe.anime/${slug}`,
        slug,
        displayName: 'Naruto Uzumaki',
        summary: 'Published compatibility proof.',
        facts: [],
      },
    });

    const resourceAssets = await request(app.getHttpServer())
      .get(`/knowledge/resources/${resourceId}/assets`)
      .expect(200);
    expect(resourceAssets.body).toEqual({ assetIds: [secondId, firstId] });

    const entity = await request(app.getHttpServer())
      .get(`/knowledge/entities/universe.anime/${slug}`)
      .expect(200);
    expect(entity.body).not.toHaveProperty('assetIds');
    expect(entity.body.media.map((media: { assetId: string }) => media.assetId)).toEqual([
      secondId,
      firstId,
    ]);
    expect(entity.body.media).toMatchObject([
      {
        assetId: secondId,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Hero',
        posterAssetId: null,
      },
      {
        assetId: firstId,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'GALLERY',
        playback: 'STILL',
        position: 1,
        altText: 'Gallery',
        posterAssetId: null,
      },
    ]);
  });

  it('accepts a VIDEO SHORT_LOOP placement with an ACTIVE IMAGE poster without enabling video delivery', async () => {
    const editor = await signInKnowledgeEditor('editor-video-placement');
    const resourceId = await createKnowledgeResource();
    const videoId = await createAsset({ assetType: 'VIDEO' });
    const posterId = await createAsset({ assetType: 'IMAGE' });

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId: videoId,
            role: 'HIGHLIGHT',
            playback: 'SHORT_LOOP',
            altText: 'Naruto short motion',
            posterAssetId: posterId,
          },
        ],
      })
      .expect(200);

    expect(response.body.placements[0]).toEqual({
      assetId: videoId,
      role: 'HIGHLIGHT',
      playback: 'SHORT_LOOP',
      position: 0,
      altText: 'Naruto short motion',
      caption: null,
      posterAssetId: posterId,
    });
  });

  it('rejects an ARCHIVED primary Media Asset without persisting a placement', async () => {
    const editor = await signInKnowledgeEditor('editor-archived-primary');
    const resourceId = await createKnowledgeResource();
    const assetId = await createAsset({ lifecycle: 'ARCHIVED' });

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId,
            role: 'GALLERY',
            playback: 'STILL',
            altText: 'Archived',
          },
        ],
      })
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.reference.not_found');
    await expect(
      database.knowledgeResourceAssetReference.count({
        where: { knowledgeResourceId: resourceId },
      }),
    ).resolves.toBe(0);
  });

  it('rejects an ARCHIVED poster through the Media-owned reference contract', async () => {
    const editor = await signInKnowledgeEditor('editor-archived-poster');
    const resourceId = await createKnowledgeResource();
    const videoId = await createAsset({ assetType: 'VIDEO' });
    const posterId = await createAsset({ lifecycle: 'ARCHIVED' });

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId: videoId,
            role: 'HIGHLIGHT',
            playback: 'SHORT_LOOP',
            altText: 'Video',
            posterAssetId: posterId,
          },
        ],
      })
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.reference.not_found');
  });

  it.each([
    {
      label: 'IMAGE SHORT_LOOP',
      placement: (assetId: string) => ({
        assetId,
        role: 'GALLERY',
        playback: 'SHORT_LOOP',
        altText: 'Image',
      }),
      type: 'IMAGE' as const,
    },
    {
      label: 'VIDEO without poster',
      placement: (assetId: string) => ({
        assetId,
        role: 'HIGHLIGHT',
        playback: 'SHORT_LOOP',
        altText: 'Video',
      }),
      type: 'VIDEO' as const,
    },
    {
      label: 'blank alt text',
      placement: (assetId: string) => ({
        assetId,
        role: 'GALLERY',
        playback: 'STILL',
        altText: '   ',
      }),
      type: 'IMAGE' as const,
    },
  ])('rejects $label placement semantics', async ({ placement, type }) => {
    const editor = await signInKnowledgeEditor(`editor-invalid-${type.toLowerCase()}`);
    const resourceId = await createKnowledgeResource();
    const assetId = await createAsset({ assetType: type });

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({ placements: [placement(assetId)] })
      .expect(400);

    expect(response.body.error.code).toBe('knowledge.resource.media.invalid_placement');
  });

  it('rejects duplicate primary Asset IDs', async () => {
    const editor = await signInKnowledgeEditor('editor-duplicate');
    const resourceId = await createKnowledgeResource();
    const assetId = await createAsset();

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          { assetId, role: 'GALLERY', playback: 'STILL', altText: 'One' },
          { assetId, role: 'HIGHLIGHT', playback: 'STILL', altText: 'Two' },
        ],
      })
      .expect(400);

    expect(response.body.error.code).toBe('knowledge.resource.media.duplicate_asset');
  });

  it('rejects more than one HERO before resolving Media', async () => {
    const editor = await signInKnowledgeEditor('editor-multiple-hero');
    const resourceId = await createKnowledgeResource();

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId: randomUUID(),
            role: 'HERO',
            playback: 'STILL',
            altText: 'One',
          },
          {
            assetId: randomUUID(),
            role: 'HERO',
            playback: 'STILL',
            altText: 'Two',
          },
        ],
      })
      .expect(400);

    expect(response.body.error.code).toBe('knowledge.resource.media.multiple_hero');
  });

  it('does not retain the old creator Asset-ID-only mutation route', async () => {
    const editor = await signInKnowledgeEditor('editor-old-route');

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${randomUUID()}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [] })
      .expect(404);
  });

  it('supports clearing all Knowledge media placements', async () => {
    const editor = await signInKnowledgeEditor('editor-clear');
    const resourceId = await createKnowledgeResource();
    const assetId = await createAsset();

    await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({
        placements: [
          {
            assetId,
            role: 'GALLERY',
            playback: 'STILL',
            altText: 'Clear me',
          },
        ],
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/media`)
      .set('Cookie', editor.cookiePair)
      .send({ placements: [] })
      .expect(200);

    expect(response.body).toEqual({ placements: [] });
    await expect(
      database.knowledgeResourceAssetReference.count({
        where: { knowledgeResourceId: resourceId },
      }),
    ).resolves.toBe(0);
  });

  it('rejects a VIDEO SHORT_LOOP whose Media-owned duration is missing or overlong', async () => {
    const editor = await signInKnowledgeEditor('editor-invalid-video-duration');
    const resourceId = await createKnowledgeResource();
    const posterId = await createAsset({ assetType: 'IMAGE' });

    for (const durationMs of [null, 8001]) {
      const videoId = await createAsset({ assetType: 'VIDEO', durationMs });

      const response = await request(app.getHttpServer())
        .put(`/knowledge/resources/${resourceId}/media`)
        .set('Cookie', editor.cookiePair)
        .send({
          placements: [
            {
              assetId: videoId,
              role: 'HIGHLIGHT',
              playback: 'SHORT_LOOP',
              altText: 'Invalid duration video',
              posterAssetId: posterId,
            },
          ],
        })
        .expect(400);

      expect(response.body.error.code).toBe('knowledge.resource.media.invalid_placement');
    }
  });
});
