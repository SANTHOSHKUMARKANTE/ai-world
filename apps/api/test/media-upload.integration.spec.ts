import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { ADMINISTRATOR_ROLE_KEY } from '@ai-world/platform-identity-access';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Media Upload API integration tests.');
}

const runMarker = `api-media-upload-${randomUUID()}`;

const VALID_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl9sAAAAASUVORK5CYII=',
  'base64',
);

function createFixtureEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

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
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }

  return cookiePair;
}

interface ActorFixture {
  readonly actorId: string;
  readonly cookiePair: string;
}

describe('Media Upload API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  let storageRoot: string;
  const createdAssetIds = new Set<string>();

  async function cleanupFixtures(): Promise<void> {
    if (createdAssetIds.size > 0) {
      await database.auditRecord.deleteMany({
        where: {
          resourceId: {
            in: [...createdAssetIds],
          },
          resourceType: 'media.asset',
        },
      });

      await database.asset.deleteMany({
        where: {
          id: {
            in: [...createdAssetIds],
          },
        },
      });

      createdAssetIds.clear();
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

    await rm(storageRoot, {
      recursive: true,
      force: true,
    });
  }

  async function signInFixture(label: string): Promise<ActorFixture> {
    const email = createFixtureEmail(label);
    const password = 'correct horse battery staple';

    const registration = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    const authentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password,
      })
      .expect(200);

    return {
      actorId: registration.body.actorId as string,
      cookiePair: getSessionCookie(authentication),
    };
  }

  async function grantAdministratorRole(actorId: string): Promise<void> {
    const role = await database.role.findUniqueOrThrow({
      where: {
        key: ADMINISTRATOR_ROLE_KEY,
      },
      select: {
        id: true,
      },
    });

    await database.actorRole.create({
      data: {
        actorId,
        roleId: role.id,
      },
    });
  }

  async function signInAdministrator(label: string): Promise<ActorFixture> {
    const fixture = await signInFixture(label);
    await grantAdministratorRole(fixture.actorId);
    return fixture;
  }

  async function currentAssetCount(): Promise<number> {
    return database.asset.count({
      where: {
        storageReference: {
          startsWith: 'media/assets/',
        },
      },
    });
  }

  beforeAll(async () => {
    storageRoot = await mkdtemp(join(tmpdir(), 'ai-world-media-upload-'));

    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    await cleanupFixtures();

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
          storageRootDirectory: storageRoot,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await cleanupFixtures();
  });

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('requires a Session before upload', async () => {
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('X-Request-Id', 'media-upload-no-session-001')
      .attach('file', VALID_PNG, {
        filename: 'pixel.png',
        contentType: 'image/png',
      })
      .expect('X-Request-Id', 'media-upload-no-session-001')
      .expect(401);

    expect(response.body.error.code).toBe('identity.session.invalid');
    expect(await currentAssetCount()).toBe(before);
  });

  it('rejects an unauthenticated request before multipart boundary parsing', async () => {
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('X-Request-Id', 'media-upload-malformed-no-session-001')
      .set('Content-Type', 'multipart/form-data')
      .send('not-a-valid-multipart-body')
      .expect('X-Request-Id', 'media-upload-malformed-no-session-001')
      .expect(401);

    expect(response.body.error.code).toBe('identity.session.invalid');
    expect(await currentAssetCount()).toBe(before);
  });

  it('rejects an ordinary Actor before multipart boundary parsing', async () => {
    const actor = await signInFixture('malformed-ordinary');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .set('X-Request-Id', 'media-upload-malformed-forbidden-001')
      .set('Content-Type', 'multipart/form-data')
      .send('not-a-valid-multipart-body')
      .expect('X-Request-Id', 'media-upload-malformed-forbidden-001')
      .expect(403);

    expect(response.body.error.code).toBe('media.authorization.forbidden');
    expect(await currentAssetCount()).toBe(before);
  });

  it('denies an ordinary Actor before Media upload validation', async () => {
    const actor = await signInFixture('ordinary');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .set('X-Request-Id', 'media-upload-forbidden-001')
      .attach('file', Buffer.from('not-an-image'), {
        filename: 'invalid.txt',
        contentType: 'text/plain',
      })
      .expect('X-Request-Id', 'media-upload-forbidden-001')
      .expect(403);

    expect(response.body.error.code).toBe('media.authorization.forbidden');
    expect(await currentAssetCount()).toBe(before);
  });

  it('rejects MIME/signature mismatch without creating an Asset', async () => {
    const actor = await signInAdministrator('mismatch');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .set('X-Request-Id', 'media-upload-mismatch-001')
      .attach('file', VALID_PNG, {
        filename: 'pixel.jpg',
        contentType: 'image/jpeg',
      })
      .expect('X-Request-Id', 'media-upload-mismatch-001')
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.upload.invalid_input');
    expect(await currentAssetCount()).toBe(before);
  });

  it('requires one multipart file', async () => {
    const actor = await signInAdministrator('missing-file');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .set('X-Request-Id', 'media-upload-missing-file-001')
      .expect('X-Request-Id', 'media-upload-missing-file-001')
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.upload.invalid_input');
    expect(await currentAssetCount()).toBe(before);
  });

  it('stores a valid image and creates the canonical Asset record', async () => {
    const actor = await signInAdministrator('success');

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .set('X-Request-Id', 'media-upload-success-001')
      .attach('file', VALID_PNG, {
        filename: 'pixel.png',
        contentType: 'image/png',
      })
      .expect('X-Request-Id', 'media-upload-success-001')
      .expect(201);

    const id = response.body.id as string;
    createdAssetIds.add(id);

    expect(response.body).toMatchObject({
      id,
      assetType: 'IMAGE',
      technicalMetadata: {
        mimeType: 'image/png',
        sizeBytes: VALID_PNG.byteLength,
      },
      lifecycle: 'ACTIVE',
    });

    expect(response.body.storageReference).toBeUndefined();

    const persisted = await database.asset.findUniqueOrThrow({
      where: {
        id,
      },
    });

    expect(persisted.assetType).toBe('IMAGE');
    expect(persisted.mimeType).toBe('image/png');
    expect(persisted.sizeBytes).toBe(VALID_PNG.byteLength);
    expect(persisted.lifecycle).toBe('ACTIVE');
    expect(persisted.storageReference).toBe(`media/assets/${id}/original`);

    const auditRecord = await database.auditRecord.findFirstOrThrow({
      where: {
        actorId: actor.actorId,
        action: 'media.asset.upload',
        resourceType: 'media.asset',
        resourceId: id,
        result: 'media.asset.created',
      },
    });

    expect(auditRecord.context).toEqual({
      assetType: 'IMAGE',
      mimeType: 'image/png',
      sizeBytes: VALID_PNG.byteLength,
      lifecycle: 'ACTIVE',
    });
    expect(JSON.stringify(auditRecord.context)).not.toContain('storageReference');

    const stored = await readFile(join(storageRoot, 'media', 'assets', id, 'original'));

    expect(stored).toEqual(VALID_PNG);
  });
});
