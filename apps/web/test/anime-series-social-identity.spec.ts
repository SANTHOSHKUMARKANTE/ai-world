import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildAnimeSeriesMetadata,
  getAnimeSeriesMetadata,
} from '../src/anime/anime-series-metadata';
import type { PublicKnowledgeEntity } from '../src/knowledge/public-knowledge-entity-api';

const VIDEO_ID = '98600000-0000-4000-8000-000000000001';
const POSTER_ID = '98600000-0000-4000-8000-000000000002';
const IMAGE_ID = '98600000-0000-4000-8000-000000000003';

function seriesFixture(): PublicKnowledgeEntity {
  return {
    resource: {
      id: '98610000-0000-4000-8000-000000000001',
      universeKey: 'universe.anime',
      resourceType: 'anime.series',
    },
    profile: {
      slug: 'fullmetal-alchemist-brotherhood',
      displayName: 'Fullmetal Alchemist: Brotherhood',
      nativeName: '鋼の錬金術師 FULLMETAL ALCHEMIST',
      alternateNames: ['FMAB'],
      summary: 'Two brothers search for a way to restore what they lost.',
      overview: 'A published Anime Series used to prove the reusable Series social identity.',
      facts: [{ key: 'anime.format', label: 'Format', value: 'TV' }],
    },
    media: [
      {
        assetId: VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        role: 'HERO',
        playback: 'SHORT_LOOP',
        position: 0,
        altText: 'Series hero loop',
        caption: null,
        durationMs: 5000,
        posterAssetId: POSTER_ID,
      },
      {
        assetId: IMAGE_ID,
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'GALLERY',
        playback: 'STILL',
        position: 1,
        altText: 'Series gallery art',
        caption: null,
        posterAssetId: null,
      },
    ],
    relations: [],
  };
}

function characterFixture(): PublicKnowledgeEntity {
  return {
    ...seriesFixture(),
    resource: {
      id: '98610000-0000-4000-8000-000000000002',
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-04A Anime Series social identity', () => {
  it('uses the accepted Anime HERO precedence including SHORT_LOOP poster media', () => {
    const metadata = buildAnimeSeriesMetadata(
      seriesFixture(),
      'fullmetal-alchemist-brotherhood',
      'https://api.ai-world.test',
    );

    expect(metadata).toMatchObject({
      title: 'Fullmetal Alchemist: Brotherhood',
      description: 'Two brothers search for a way to restore what they lost.',
      alternates: {
        canonical: '/anime/series/fullmetal-alchemist-brotherhood',
      },
      openGraph: {
        title: 'Fullmetal Alchemist: Brotherhood',
        description: 'Two brothers search for a way to restore what they lost.',
        images: [
          {
            url: `https://api.ai-world.test/media/assets/${POSTER_ID}/thumbnail`,
            alt: 'Fullmetal Alchemist: Brotherhood artwork',
          },
        ],
      },
    });
  });

  it('loads metadata only from a public universe.anime / anime.series Entity', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(seriesFixture()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const metadata = await getAnimeSeriesMetadata(
      'fullmetal-alchemist-brotherhood',
      'https://api.ai-world.test',
    );

    expect(fetchMock).toHaveBeenCalledWith(
      new URL(
        'https://api.ai-world.test/knowledge/entities/universe.anime/fullmetal-alchemist-brotherhood',
      ),
      { cache: 'no-store' },
    );
    expect(metadata.alternates).toMatchObject({
      canonical: '/anime/series/fullmetal-alchemist-brotherhood',
    });
  });

  it('falls back safely when the public slug resolves to the wrong Anime Resource Type', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(JSON.stringify(characterFixture()), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );

    const metadata = await getAnimeSeriesMetadata(
      'fullmetal-alchemist-brotherhood',
      'https://api.ai-world.test',
    );

    expect(metadata).toMatchObject({
      title: 'Anime Series',
      description: 'Explore this published Anime Series in AI World.',
      alternates: {
        canonical: '/anime/series/fullmetal-alchemist-brotherhood',
      },
      openGraph: {
        title: 'Anime Series',
        description: 'Explore this published Anime Series in AI World.',
      },
    });
    expect(metadata.openGraph).not.toHaveProperty('images');
  });

  it('does not fabricate a social image for a Series without eligible Media', () => {
    const entity = seriesFixture();
    const metadata = buildAnimeSeriesMetadata(
      { ...entity, media: [] },
      entity.profile.slug,
      'https://api.ai-world.test',
    );

    expect(metadata.openGraph).not.toHaveProperty('images');
  });
});
