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

const VALID_AAC_LC_AUDIO = Buffer.from(
  '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',
  'base64',
);

function nonAacLcAudio(): Buffer {
  const result = Buffer.from(VALID_AAC_LC_AUDIO);
  const marker = Buffer.from([0x05, 0x80, 0x80, 0x80, 0x05]);
  const markerIndex = result.indexOf(marker);

  if (markerIndex < 0) {
    throw new Error('AAC-LC integration fixture DecoderSpecificInfo marker was not found.');
  }

  const configIndex = markerIndex + marker.byteLength;
  result[configIndex] = (5 << 3) | (result[configIndex]! & 0x07);
  return result;
}

function mp4Box(type: string, payload: Buffer): Buffer {
  const result = Buffer.alloc(8 + payload.byteLength);
  result.writeUInt32BE(result.byteLength, 0);
  result.write(type, 4, 4, 'ascii');
  payload.copy(result, 8);
  return result;
}

function shortMp4(durationMs: number): Buffer {
  const ftyp = Buffer.alloc(16);
  ftyp.write('isom', 0, 'ascii');
  ftyp.write('isom', 8, 'ascii');

  const mvhd = Buffer.alloc(20);
  mvhd.writeUInt32BE(1000, 12);
  mvhd.writeUInt32BE(durationMs, 16);

  return Buffer.concat([
    mp4Box('ftyp', ftyp),
    mp4Box('moov', Buffer.concat([mp4Box('mvhd', mvhd), mp4Box('avc1', Buffer.alloc(0))])),
  ]);
}

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

  it('stores a bounded H.264 MP4 VIDEO with canonical duration and audit metadata', async () => {
    const actor = await signInAdministrator('video-success');
    const video = shortMp4(5000);

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .attach('file', video, {
        filename: 'short-motion.mp4',
        contentType: 'video/mp4',
      })
      .expect(201);

    const id = response.body.id as string;
    createdAssetIds.add(id);

    expect(response.body).toMatchObject({
      id,
      assetType: 'VIDEO',
      technicalMetadata: {
        mimeType: 'video/mp4',
        sizeBytes: video.byteLength,
        durationMs: 5000,
      },
      lifecycle: 'ACTIVE',
    });

    const persisted = await database.asset.findUniqueOrThrow({ where: { id } });
    expect(persisted.assetType).toBe('VIDEO');
    expect(persisted.mimeType).toBe('video/mp4');
    expect(persisted.durationMs).toBe(5000);

    const auditRecord = await database.auditRecord.findFirstOrThrow({
      where: {
        actorId: actor.actorId,
        action: 'media.asset.upload',
        resourceType: 'media.asset',
        resourceId: id,
        result: 'media.asset.created',
      },
    });
    expect(auditRecord.context).toMatchObject({
      assetType: 'VIDEO',
      mimeType: 'video/mp4',
      sizeBytes: video.byteLength,
      durationMs: 5000,
      lifecycle: 'ACTIVE',
    });
    expect(JSON.stringify(auditRecord.context)).not.toContain('storageReference');

    const stored = await readFile(join(storageRoot, 'media', 'assets', id, 'original'));
    expect(stored).toEqual(video);
  });

  it('stores AAC-LC audio/mp4 as canonical AUDIO with duration and audit evidence', async () => {
    const actor = await signInAdministrator('audio-success');

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .attach('file', VALID_AAC_LC_AUDIO, {
        filename: 'rights-safe-audio.m4a',
        contentType: 'audio/mp4',
      })
      .expect(201);

    const id = response.body.id as string;
    createdAssetIds.add(id);

    expect(response.body).toMatchObject({
      id,
      assetType: 'AUDIO',
      technicalMetadata: {
        mimeType: 'audio/mp4',
        sizeBytes: VALID_AAC_LC_AUDIO.byteLength,
        durationMs: 273,
      },
      lifecycle: 'ACTIVE',
    });

    const persisted = await database.asset.findUniqueOrThrow({ where: { id } });
    expect(persisted.assetType).toBe('AUDIO');
    expect(persisted.mimeType).toBe('audio/mp4');
    expect(persisted.durationMs).toBe(273);

    const auditRecord = await database.auditRecord.findFirstOrThrow({
      where: {
        actorId: actor.actorId,
        action: 'media.asset.upload',
        resourceType: 'media.asset',
        resourceId: id,
        result: 'media.asset.created',
      },
    });
    expect(auditRecord.context).toMatchObject({
      assetType: 'AUDIO',
      mimeType: 'audio/mp4',
      sizeBytes: VALID_AAC_LC_AUDIO.byteLength,
      durationMs: 273,
      lifecycle: 'ACTIVE',
    });

    const stored = await readFile(join(storageRoot, 'media', 'assets', id, 'original'));
    expect(stored).toEqual(VALID_AAC_LC_AUDIO);
  });

  it('rejects non-AAC-LC mp4a content before persistence or Storage', async () => {
    const actor = await signInAdministrator('audio-non-lc');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .attach('file', nonAacLcAudio(), {
        filename: 'unsupported-audio.m4a',
        contentType: 'audio/mp4',
      })
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.upload.invalid_input');
    expect(await currentAssetCount()).toBe(before);
  });

  it('rejects an overlong MP4 before creating an Asset or stored object', async () => {
    const actor = await signInAdministrator('video-overlong');
    const before = await currentAssetCount();

    const response = await request(app.getHttpServer())
      .post('/media/assets')
      .set('Cookie', actor.cookiePair)
      .attach('file', shortMp4(8001), {
        filename: 'too-long.mp4',
        contentType: 'video/mp4',
      })
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.upload.invalid_input');
    expect(await currentAssetCount()).toBe(before);
  });
});
