import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildPublicExperienceMetadata,
  getPublicExperienceMetadata,
  parsePublicExperienceMetadataProjection,
  publicExperienceCanonicalPath,
} from '../src/metadata/public-experience-metadata';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-05B public Experience metadata', () => {
  it('uses Page identity and the first substantive Block for query-free social metadata', () => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const imageId = '22222222-2222-4222-8222-222222222222';
    const projection = parsePublicExperienceMetadataProjection(
      {
        page: {
          id: pageId,
          universeKey: 'universe.anime',
          routePath: '/campaign/anime',
          title: '  Celestial   Journey  ',
          lifecycle: 'PUBLISHED',
        },
        items: [
          {
            position: 0,
            kind: 'MEDIA_ASSET',
            id: '77777777-7777-4777-8777-777777777777',
            assetType: 'VIDEO',
            durationMs: 5000,
          },
          {
            position: 1,
            kind: 'MEDIA_ASSET',
            id: imageId,
            assetType: 'IMAGE',
          },
          {
            position: 2,
            kind: 'BLOCK',
            id: '33333333-3333-4333-8333-333333333333',
            blockType: 'composition.block.text',
            text: '  Follow   the hero\nthrough a published story.  ',
          },
          {
            position: 3,
            kind: 'BLOCK',
            id: '44444444-4444-4444-8444-444444444444',
            blockType: 'composition.block.text',
            text: 'This later Block must not replace the first description.',
          },
        ],
      },
      pageId,
    );

    expect(projection).toEqual({
      title: 'Celestial Journey',
      description: 'Follow the hero through a published story.',
      socialImageAssetId: imageId,
    });

    const metadata = buildPublicExperienceMetadata(projection, pageId);

    expect(metadata).toMatchObject({
      title: 'Celestial Journey',
      description: 'Follow the hero through a published story.',
      alternates: {
        canonical: `/experiences/${pageId}`,
      },
      openGraph: {
        title: 'Celestial Journey',
        description: 'Follow the hero through a published story.',
        images: [
          {
            url: `/api/media/assets/${imageId}/thumbnail`,
            alt: 'Celestial Journey',
          },
        ],
      },
    });
  });

  it('falls back safely when the public projection is unavailable', async () => {
    const pageId = '44444444-4444-4444-8444-444444444444';
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'composition.public.not_found',
            message: 'The published Experience was not found.',
            status: 404,
          },
        },
        404,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    const metadata = await getPublicExperienceMetadata(pageId, 'https://api.example.test');

    expect(metadata).toMatchObject({
      title: 'Published Experience',
      description: 'Explore this published Experience in AI World.',
      alternates: {
        canonical: `/experiences/${pageId}`,
      },
      openGraph: {
        title: 'Published Experience',
        description: 'Explore this published Experience in AI World.',
      },
    });

    expect(metadata.openGraph).not.toHaveProperty('images');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      `https://api.example.test/composition/public/pages/${pageId}`,
    );
  });

  it('rejects mismatched or unpublished projection identity', () => {
    const pageId = '55555555-5555-4555-8555-555555555555';

    expect(
      parsePublicExperienceMetadataProjection(
        {
          page: {
            id: '66666666-6666-4666-8666-666666666666',
            title: 'Wrong Page',
            lifecycle: 'PUBLISHED',
          },
          items: [],
        },
        pageId,
      ),
    ).toBeNull();

    expect(
      parsePublicExperienceMetadataProjection(
        {
          page: {
            id: pageId,
            title: 'Draft Page',
            lifecycle: 'DRAFT',
          },
          items: [],
        },
        pageId,
      ),
    ).toBeNull();

    expect(publicExperienceCanonicalPath('id with/slash')).toBe('/experiences/id%20with%2Fslash');
  });
});
