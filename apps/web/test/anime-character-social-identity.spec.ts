import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildAnimeCharacterMetadata,
  getAnimeCharacterMetadata,
} from '../src/anime/anime-character-metadata';
import {
  parsePublicKnowledgeEntity,
  type PublicKnowledgeEntity,
} from '../src/knowledge/public-knowledge-entity-api';

function fixture(): PublicKnowledgeEntity {
  return {
    resource: {
      id: '99999999-9999-4999-8999-999999999999',
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    },
    profile: {
      slug: 'naruto-uzumaki',
      displayName: 'Naruto Uzumaki',
      nativeName: 'うずまきナルト',
      alternateNames: ['Naruto', 'Uzumaki Naruto'],
      summary: 'A determined shinobi whose ambition is to become Hokage.',
      overview: 'Naruto grows through persistence, bonds and responsibility.',
      facts: [{ key: 'anime.series', label: 'Series', value: 'Naruto' }],
    },
    media: [
      {
        assetId: '60000000-0000-4000-8000-000000000001',
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Naruto portrait',
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

describe('UXP-02B Anime Character social identity', () => {
  it('normalizes legacy Web Entity payloads while accepting the new public Character depth', () => {
    const entity = fixture();

    expect(
      parsePublicKnowledgeEntity({
        ...entity,
        profile: {
          slug: entity.profile.slug,
          displayName: entity.profile.displayName,
          summary: entity.profile.summary,
          facts: entity.profile.facts,
        },
      }),
    ).toMatchObject({
      profile: {
        nativeName: null,
        alternateNames: [],
        overview: null,
      },
    });

    expect(parsePublicKnowledgeEntity(entity)).toEqual(entity);
  });

  it('builds canonical and Open Graph metadata from the public Character only', () => {
    const metadata = buildAnimeCharacterMetadata(
      fixture(),
      'naruto-uzumaki',
      'https://api.ai-world.test',
    );

    expect(metadata).toMatchObject({
      title: 'Naruto Uzumaki',
      description: 'A determined shinobi whose ambition is to become Hokage.',
      alternates: {
        canonical: '/anime/characters/naruto-uzumaki',
      },
      openGraph: {
        title: 'Naruto Uzumaki',
        description: 'A determined shinobi whose ambition is to become Hokage.',
        images: [
          {
            url: 'https://api.ai-world.test/media/assets/60000000-0000-4000-8000-000000000001/thumbnail',
            alt: 'Naruto Uzumaki artwork',
          },
        ],
      },
    });
  });

  it('loads metadata from the public Anime Character contract and not from query context', async () => {
    const fetchMock = vi.fn(async () => {
      return new Response(JSON.stringify(fixture()), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    const metadata = await getAnimeCharacterMetadata('naruto-uzumaki', 'https://api.ai-world.test');

    expect(fetchMock).toHaveBeenCalledWith(
      new URL('https://api.ai-world.test/knowledge/entities/universe.anime/naruto-uzumaki'),
      { cache: 'no-store' },
    );
    expect(metadata.alternates).toMatchObject({
      canonical: '/anime/characters/naruto-uzumaki',
    });
  });
});
