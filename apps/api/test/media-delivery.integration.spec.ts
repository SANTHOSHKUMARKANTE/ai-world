import { randomUUID } from 'node:crypto';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Media Delivery API integration tests.');
}

const VALID_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Zl9sAAAAASUVORK5CYII=',
  'base64',
);

describe('Media Delivery API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  let storageRoot: string;
  const createdAssetIds = new Set<string>();

  async function cleanup(): Promise<void> {
    if (createdAssetIds.size > 0) {
      await database.asset.deleteMany({
        where: {
          id: {
            in: [...createdAssetIds],
          },
        },
      });

      createdAssetIds.clear();
    }

    await rm(storageRoot, {
      recursive: true,
      force: true,
    });
  }

  async function createAssetFixture(
    options: {
      readonly lifecycle?: 'ACTIVE' | 'ARCHIVED' | 'DELETED';
      readonly assetType?: 'IMAGE' | 'VIDEO' | 'AUDIO';
      readonly mimeType?: string;
      readonly content?: Buffer;
      readonly sizeBytes?: number;
      readonly durationMs?: number | null;
    } = {},
  ): Promise<string> {
    const id = randomUUID();
    const content = options.content ?? VALID_PNG;
    const storageReference = `test/media-delivery/${id}/original`;
    const absolutePath = join(storageRoot, ...storageReference.split('/'));

    await mkdir(dirname(absolutePath), {
      recursive: true,
    });

    await writeFile(absolutePath, content);

    await database.asset.create({
      data: {
        id,
        assetType: options.assetType ?? 'IMAGE',
        mimeType: options.mimeType ?? 'image/png',
        sizeBytes: options.sizeBytes ?? content.byteLength,
        durationMs: options.durationMs ?? null,
        storageReference,
        lifecycle: options.lifecycle ?? 'ACTIVE',
      },
    });

    createdAssetIds.add(id);

    return id;
  }

  beforeAll(async () => {
    storageRoot = await mkdtemp(join(tmpdir(), 'ai-world-media-delivery-'));

    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    await cleanup();

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
    await cleanup();
  });

  afterAll(async () => {
    await cleanup();
    await app.close();
    await database.$disconnect();
  });

  it('publicly delivers an ACTIVE initial image Asset without exposing Storage internals', async () => {
    const id = await createAssetFixture();

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .expect('Content-Type', 'image/png')
      .expect('Content-Length', String(VALID_PNG.byteLength))
      .expect(200);

    expect(Buffer.isBuffer(response.body)).toBe(true);
    expect(Buffer.from(response.body)).toEqual(VALID_PNG);
    expect(response.headers).not.toHaveProperty('x-storage-reference');
  });

  it('returns the Media not-found contract for an unknown Asset', async () => {
    const response = await request(app.getHttpServer())
      .get(`/media/assets/${randomUUID()}/content`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.delivery.not_found');
  });

  it('does not deliver an ARCHIVED Asset', async () => {
    const id = await createAssetFixture({
      lifecycle: 'ARCHIVED',
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.delivery.not_found');
  });

  it('publicly delivers an ACTIVE VIDEO as one bounded full object without Range semantics', async () => {
    const content = Buffer.from('bounded-video-content');
    const id = await createAssetFixture({
      assetType: 'VIDEO',
      mimeType: 'video/mp4',
      content,
      durationMs: 5000,
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .set('Range', 'bytes=0-3')
      .expect('Content-Type', 'video/mp4')
      .expect('Content-Length', String(content.byteLength))
      .expect(200);

    expect(Buffer.from(response.body)).toEqual(content);
    expect(response.headers['accept-ranges']).toBeUndefined();
    expect(response.headers['content-range']).toBeUndefined();
  });

  it('publicly delivers ACTIVE audio/mp4 AUDIO as one full object without Range semantics', async () => {
    const content = Buffer.from(
      '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',
      'base64',
    );
    const id = await createAssetFixture({
      assetType: 'AUDIO',
      mimeType: 'audio/mp4',
      content,
      durationMs: 273,
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .set('Range', 'bytes=0-15')
      .expect('Content-Type', 'audio/mp4')
      .expect('Content-Length', String(content.byteLength))
      .expect(200);

    expect(Buffer.from(response.body)).toEqual(content);
    expect(response.headers['accept-ranges']).toBeUndefined();
    expect(response.headers['content-range']).toBeUndefined();
  });

  it('rejects a malformed Asset identifier before delivery lookup', async () => {
    const response = await request(app.getHttpServer())
      .get('/media/assets/not-a-resource-id/content')
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.delivery.invalid_asset_id');
  });

  it('fails safely when stored bytes conflict with canonical technical metadata', async () => {
    const id = await createAssetFixture({
      sizeBytes: VALID_PNG.byteLength + 1,
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .expect(500);

    expect(response.body.error.code).toBe('http.internal_server_error');
    expect(response.body.error.message).toBe('Internal server error.');
  });

  it.each([null, 8001])(
    'does not expose unknown-duration or overlong VIDEO through bounded delivery (%s)',
    async (durationMs) => {
      const id = await createAssetFixture({
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        content: Buffer.from('not-deliverable-video'),
        durationMs,
      });

      const response = await request(app.getHttpServer())
        .get(`/media/assets/${id}/content`)
        .expect(404);

      expect(response.body.error.code).toBe('media.asset.delivery.not_found');
    },
  );
});
