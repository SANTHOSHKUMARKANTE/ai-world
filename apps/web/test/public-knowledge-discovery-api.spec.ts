import { afterEach, describe, expect, it, vi } from 'vitest';

import { listPublicKnowledgeDiscovery } from '../src/knowledge/public-knowledge-discovery-api';

const NARUTO_ID = '93000000-0000-4000-8000-000000000001';
const SASUKE_ID = '93000000-0000-4000-8000-000000000002';
const KAKASHI_ID = '93000000-0000-4000-8000-000000000003';
const IMAGE_ID = '94000000-0000-4000-8000-000000000001';
const VIDEO_ID = '94000000-0000-4000-8000-000000000002';
const POSTER_ID = '94000000-0000-4000-8000-000000000003';

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function validBody() {
  return {
    items: [
      {
        resourceId: NARUTO_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
        displayName: 'Naruto Uzumaki',
        summary: 'A determined shinobi.',
        updatedAt: '2026-08-25T04:00:00.000Z',
        previewMedia: {
          assetId: IMAGE_ID,
          assetType: 'IMAGE',
          mimeType: 'image/png',
          playback: 'STILL',
          posterAssetId: null,
          altText: 'Naruto Uzumaki portrait',
        },
      },
      {
        resourceId: SASUKE_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'sasuke-uchiha',
        displayName: 'Sasuke Uchiha',
        summary: 'A gifted shinobi.',
        updatedAt: '2026-08-24T03:00:00.000Z',
        previewMedia: {
          assetId: VIDEO_ID,
          assetType: 'VIDEO',
          mimeType: 'video/mp4',
          playback: 'SHORT_LOOP',
          posterAssetId: POSTER_ID,
          altText: 'Sasuke short-motion preview',
        },
      },
      {
        resourceId: KAKASHI_ID,
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'kakashi-hatake',
        displayName: 'Kakashi Hatake',
        summary: 'A veteran shinobi.',
        updatedAt: '2026-08-23T02:00:00.000Z',
        previewMedia: null,
      },
    ],
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-03A public Knowledge discovery Web decoder', () => {
  it('uses the typed same-origin query and accepts safe image, short-video and null previews', async () => {
    const fetchMock = vi.fn().mockResolvedValue(json(validBody()));
    vi.stubGlobal('fetch', fetchMock);

    const items = await listPublicKnowledgeDiscovery({
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      limit: 6,
    });

    expect(items).toHaveLength(3);
    expect(items[0]).toMatchObject({
      resourceId: NARUTO_ID,
      previewMedia: {
        assetType: 'IMAGE',
        playback: 'STILL',
        posterAssetId: null,
      },
    });
    expect(items[1]).toMatchObject({
      resourceId: SASUKE_ID,
      previewMedia: {
        assetType: 'VIDEO',
        playback: 'SHORT_LOOP',
        posterAssetId: POSTER_ID,
      },
    });
    expect(items[2]).toMatchObject({
      resourceId: KAKASHI_ID,
      previewMedia: null,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/discovery?universeKey=universe.anime&resourceType=anime.character&limit=6',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
  });

  it('rejects a malformed VIDEO preview without a poster instead of weakening the Web contract', async () => {
    const malformed = {
      items: [
        {
          resourceId: NARUTO_ID,
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          slug: 'naruto-uzumaki',
          displayName: 'Naruto Uzumaki',
          summary: 'A determined shinobi.',
          updatedAt: '2026-08-25T04:00:00.000Z',
          previewMedia: {
            assetId: VIDEO_ID,
            assetType: 'VIDEO',
            mimeType: 'video/mp4',
            playback: 'SHORT_LOOP',
            posterAssetId: null,
            altText: 'Malformed video preview',
          },
        },
      ],
    };

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(json(malformed)));

    await expect(
      listPublicKnowledgeDiscovery({
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
      }),
    ).rejects.toThrow(
      'Public Knowledge discovery response did not match the expected Web contract.',
    );
  });
});
