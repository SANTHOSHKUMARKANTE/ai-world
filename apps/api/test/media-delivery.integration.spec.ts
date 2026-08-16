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
      readonly assetType?: 'IMAGE' | 'VIDEO';
      readonly mimeType?: string;
      readonly content?: Buffer;
      readonly sizeBytes?: number;
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

  it('does not claim delivery support for non-image Assets yet', async () => {
    const id = await createAssetFixture({
      assetType: 'VIDEO',
      mimeType: 'video/mp4',
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/content`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.delivery.not_found');
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
});
