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
  throw new Error('DATABASE_URL is required for Media Thumbnail API integration tests.');
}

const SOURCE_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAIAAAC6s0uzAAAF+klEQVR42u3VMQ0AAAgEsReBCPwHgbiApUkV3HKZLgDgWCQAAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAANWAQAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAMWAUAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYADBgADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAwYAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYADBgADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAwYAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYADBgADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAwYAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYADBgADBgADBgCQDAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAwIABwIABwIABAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAcCAAQADBgADBgAMGAAMGAAwYAAwYADAgAHAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAwIABwIABwIABAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAcCAAQADBgADBgAMGAAMGAAwYAAwYADAgAHAgAHAgAEAAwYAAwYADBgADBgAMGAAMGAAwIABwIABwIABAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAcCAAQADBgADBgAMGAAMGAAwYAAwYADAgAHAgAHAgFUAAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAMGAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgADBgAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYAAwYADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAANWAQAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgAMGAAMGAAMGAAwYAAwYADAgAHAgAEAAwYAAwYADBgADBgADBgAMGAAMGAAwIABwIABAAMGAAMGAAwYAAwYAAwYADBgADBgAMCAAcCAAQADBgADBgAMGAD+LZBvQez5jtmRAAAAAElFTkSuQmCC',
  'base64',
);

function readPngDimensions(content: Buffer): {
  readonly width: number;
  readonly height: number;
} {
  const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  if (content.length < 24 || !content.subarray(0, 8).equals(pngSignature)) {
    throw new Error('Expected PNG thumbnail bytes.');
  }

  return {
    width: content.readUInt32BE(16),
    height: content.readUInt32BE(20),
  };
}

describe('Media Thumbnail API', () => {
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
    const content = options.content ?? SOURCE_PNG;
    const storageReference = `test/media-thumbnail/${id}/original`;
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
    storageRoot = await mkdtemp(join(tmpdir(), 'ai-world-media-thumbnail-'));

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

  it('synchronously generates and delivers a 320px PNG thumbnail for an ACTIVE image Asset', async () => {
    const id = await createAssetFixture();

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/thumbnail`)
      .expect('Content-Type', 'image/png')
      .expect(200);

    const body = Buffer.from(response.body);
    const dimensions = readPngDimensions(body);

    expect(dimensions).toEqual({
      width: 320,
      height: 240,
    });
    expect(Number(response.headers['content-length'])).toBe(body.byteLength);
    expect(response.headers).not.toHaveProperty('x-storage-reference');
  });

  it('returns the Media thumbnail not-found contract for an unknown Asset', async () => {
    const response = await request(app.getHttpServer())
      .get(`/media/assets/${randomUUID()}/thumbnail`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.thumbnail.not_found');
  });

  it('does not generate thumbnails for ARCHIVED Assets', async () => {
    const id = await createAssetFixture({
      lifecycle: 'ARCHIVED',
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/thumbnail`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.thumbnail.not_found');
  });

  it('does not claim thumbnail support for non-image Assets', async () => {
    const id = await createAssetFixture({
      assetType: 'VIDEO',
      mimeType: 'video/mp4',
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/thumbnail`)
      .expect(404);

    expect(response.body.error.code).toBe('media.asset.thumbnail.not_found');
  });

  it('rejects malformed Asset identifiers before thumbnail lookup', async () => {
    const response = await request(app.getHttpServer())
      .get('/media/assets/not-a-resource-id/thumbnail')
      .expect(400);

    expect(response.body.error.code).toBe('media.asset.thumbnail.invalid_asset_id');
  });

  it('fails safely when thumbnail source bytes conflict with canonical size metadata', async () => {
    const id = await createAssetFixture({
      sizeBytes: SOURCE_PNG.byteLength + 1,
    });

    const response = await request(app.getHttpServer())
      .get(`/media/assets/${id}/thumbnail`)
      .expect(500);

    expect(response.body.error.code).toBe('http.internal_server_error');
    expect(response.body.error.message).toBe('Internal server error.');
  });
});
