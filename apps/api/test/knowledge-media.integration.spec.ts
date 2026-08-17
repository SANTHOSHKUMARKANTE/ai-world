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

describe('Knowledge Media Integration API', () => {
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
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        lifecycle,
      },
    });
    return id;
  }

  async function createAsset(lifecycle: 'ACTIVE' | 'ARCHIVED' = 'ACTIVE') {
    const id = randomUUID();
    createdAssetIds.add(id);
    await database.asset.create({
      data: {
        id,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        sizeBytes: 4,
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

  it('requires a Session before replacing Knowledge Asset references', async () => {
    await request(app.getHttpServer())
      .put(`/knowledge/resources/${randomUUID()}/assets`)
      .send({ assetIds: [] })
      .expect(401);
  });

  it('denies an ordinary Actor before canonical Knowledge or Media ID validation', async () => {
    const actor = await signInFixture('ordinary');
    const response = await request(app.getHttpServer())
      .put('/knowledge/resources/not-a-resource-id/assets')
      .set('Cookie', actor.cookiePair)
      .send({ assetIds: ['not-an-asset-id'] })
      .expect(403);
    expect(response.body.error.code).toBe('knowledge.authorization.forbidden');
  });

  it('returns controlled Knowledge validation for a malformed Resource ID after authorization', async () => {
    const editor = await signInKnowledgeEditor('editor-invalid-resource');
    const response = await request(app.getHttpServer())
      .put('/knowledge/resources/not-a-resource-id/assets')
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [] })
      .expect(400);
    expect(response.body.error.code).toBe('knowledge.resource.invalid_input');
  });

  it('stores an ACTIVE canonical Asset ID through the Media Contract and keeps DRAFT references private', async () => {
    const editor = await signInKnowledgeEditor('editor-attach');
    const resourceId = await createKnowledgeResource('DRAFT');
    const assetId = await createAsset('ACTIVE');
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [assetId] })
      .expect(200);
    expect(response.body).toEqual({ assetIds: [assetId] });
    expect(response.body).not.toHaveProperty('storageReference');
    await expect(
      database.knowledgeResourceAssetReference.findUnique({
        where: { knowledgeResourceId_assetId: { knowledgeResourceId: resourceId, assetId } },
      }),
    ).resolves.toMatchObject({ knowledgeResourceId: resourceId, assetId });
    await request(app.getHttpServer()).get(`/knowledge/resources/${resourceId}/assets`).expect(404);
  });

  it('publicly exposes only Asset IDs once the Knowledge Resource is PUBLISHED', async () => {
    const editor = await signInKnowledgeEditor('editor-public');
    const resourceId = await createKnowledgeResource('DRAFT');
    const assetId = await createAsset('ACTIVE');
    await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [assetId] })
      .expect(200);
    await database.knowledgeResource.update({
      where: { id: resourceId },
      data: { lifecycle: 'PUBLISHED' },
    });
    const response = await request(app.getHttpServer())
      .get(`/knowledge/resources/${resourceId}/assets`)
      .expect(200);
    expect(response.body).toEqual({ assetIds: [assetId] });
    expect(JSON.stringify(response.body)).not.toContain('storageReference');
    expect(JSON.stringify(response.body)).not.toContain('mimeType');
  });

  it('rejects an ARCHIVED Media Asset without persisting a Knowledge reference', async () => {
    const editor = await signInKnowledgeEditor('editor-archived');
    const resourceId = await createKnowledgeResource('DRAFT');
    const assetId = await createAsset('ARCHIVED');
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [assetId] })
      .expect(404);
    expect(response.body.error.code).toBe('media.asset.reference.not_found');
    await expect(
      database.knowledgeResourceAssetReference.count({
        where: { knowledgeResourceId: resourceId },
      }),
    ).resolves.toBe(0);
  });

  it('returns Media-owned validation for a malformed Asset ID after Knowledge authorization', async () => {
    const editor = await signInKnowledgeEditor('editor-invalid-asset');
    const resourceId = await createKnowledgeResource('DRAFT');
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: ['not-an-asset-id'] })
      .expect(400);
    expect(response.body.error.code).toBe('media.asset.reference.invalid_asset_id');
  });

  it('rejects duplicate Asset IDs instead of inventing ordering or role semantics', async () => {
    const editor = await signInKnowledgeEditor('editor-duplicate');
    const resourceId = await createKnowledgeResource('DRAFT');
    const assetId = await createAsset('ACTIVE');
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [assetId, assetId] })
      .expect(400);
    expect(response.body.error.code).toBe('knowledge.resource.assets.duplicate_asset');
  });

  it('supports clearing all Knowledge Asset references', async () => {
    const editor = await signInKnowledgeEditor('editor-clear');
    const resourceId = await createKnowledgeResource('DRAFT');
    const assetId = await createAsset('ACTIVE');
    await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [assetId] })
      .expect(200);
    const response = await request(app.getHttpServer())
      .put(`/knowledge/resources/${resourceId}/assets`)
      .set('Cookie', editor.cookiePair)
      .send({ assetIds: [] })
      .expect(200);
    expect(response.body).toEqual({ assetIds: [] });
    await expect(
      database.knowledgeResourceAssetReference.count({
        where: { knowledgeResourceId: resourceId },
      }),
    ).resolves.toBe(0);
  });
});
