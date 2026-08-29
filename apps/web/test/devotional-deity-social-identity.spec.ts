import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildDevotionalDeityMetadata,
  devotionalDeityCanonicalPath,
  getDevotionalDeityMetadata,
} from '../src/devotional/devotional-deity-metadata';
import type { PublicKnowledgeEntity } from '../src/knowledge/public-knowledge-entity-api';

const VIDEO_ID = '96100000-0000-4000-8000-000000000001';
const POSTER_ID = '96100000-0000-4000-8000-000000000002';
const IMAGE_ID = '96100000-0000-4000-8000-000000000003';

function deityFixture(): PublicKnowledgeEntity {
  return {
    resource: {
      id: '96110000-0000-4000-8000-000000000001',
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    },
    profile: {
      slug: 'shiva',
      displayName: 'Lord Shiva',
      nativeName: 'शिव',
      alternateNames: ['Mahadeva', 'Shankara'],
      summary: 'The Supreme Yogi, a timeless symbol of transformation and stillness.',
      overview:
        'Shiva is represented through many forms and stories while remaining associated with stillness, transformation and cosmic balance.',
      facts: [{ key: 'devotional.mantra', label: 'Mantra', value: 'Om Namah Shivaya' }],
    },
    media: [
      {
        assetId: VIDEO_ID,
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        role: 'HERO',
        playback: 'SHORT_LOOP',
        position: 0,
        altText: 'Shiva ambient hero',
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
        altText: 'Shiva artwork',
        caption: null,
        posterAssetId: null,
      },
    ],
    relations: [],
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-06A Devotional Deity social identity', () => {
  it('builds canonical/Open Graph identity using accepted HERO poster precedence', () => {
    const metadata = buildDevotionalDeityMetadata(
      deityFixture(),
      'shiva',
      'https://api.ai-world.test',
    );

    expect(devotionalDeityCanonicalPath('shiva')).toBe('/devotional/shiva');
    expect(metadata).toMatchObject({
      title: 'Lord Shiva',
      description: 'The Supreme Yogi, a timeless symbol of transformation and stillness.',
      alternates: {
        canonical: '/devotional/shiva',
      },
      openGraph: {
        title: 'Lord Shiva',
        description: 'The Supreme Yogi, a timeless symbol of transformation and stillness.',
        images: [
          {
            url: `https://api.ai-world.test/media/assets/${POSTER_ID}/thumbnail`,
            alt: 'Lord Shiva artwork',
          },
        ],
      },
    });
  });

  it('loads metadata only from the public universe.devotional / devotional.deity Entity', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(deityFixture()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const metadata = await getDevotionalDeityMetadata('shiva', 'https://api.ai-world.test');

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.ai-world.test/knowledge/entities/universe.devotional/shiva'),
      { cache: 'no-store' },
    );
    expect(metadata.alternates).toMatchObject({
      canonical: '/devotional/shiva',
    });
  });

  it('falls back safely when the public slug resolves to the wrong Devotional Resource Type', async () => {
    const wrongType = {
      ...deityFixture(),
      resource: {
        ...deityFixture().resource,
        resourceType: 'devotional.scripture',
      },
    };

    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        return new Response(JSON.stringify(wrongType), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }),
    );

    const metadata = await getDevotionalDeityMetadata('shiva', 'https://api.ai-world.test');

    expect(metadata).toMatchObject({
      title: 'Devotional Deity',
      description: 'Explore this published Devotional Deity in AI World.',
      alternates: {
        canonical: '/devotional/shiva',
      },
      openGraph: {
        title: 'Devotional Deity',
        description: 'Explore this published Devotional Deity in AI World.',
      },
    });
    expect(metadata.openGraph).not.toHaveProperty('images');
  });

  it('does not fabricate a social image when no eligible Deity Entity Media exists', () => {
    const entity = deityFixture();
    const metadata = buildDevotionalDeityMetadata(
      { ...entity, media: [] },
      entity.profile.slug,
      'https://api.ai-world.test',
    );

    expect(metadata.openGraph).not.toHaveProperty('images');
  });
});
