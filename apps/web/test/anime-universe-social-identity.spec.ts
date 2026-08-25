import { describe, expect, it } from 'vitest';

import {
  ANIME_UNIVERSE_CANONICAL_PATH,
  buildAnimeUniverseMetadata,
} from '../src/anime/anime-universe-metadata';
import { resolveWebMetadataBase } from '../src/metadata/web-metadata-origin';

describe('UXP-03C Anime Universe social identity', () => {
  it('builds stable Anime canonical and Open Graph identity', () => {
    const metadata = buildAnimeUniverseMetadata();

    expect(ANIME_UNIVERSE_CANONICAL_PATH).toBe('/anime');
    expect(metadata).toMatchObject({
      title: 'Anime',
      description:
        'Explore published Anime Knowledge without leaving the shared platform or learning a new product.',
      alternates: {
        canonical: '/anime',
      },
      openGraph: {
        type: 'website',
        siteName: 'AI World',
        title: 'Anime · AI World',
        description:
          'Explore published Anime Knowledge without leaving the shared platform or learning a new product.',
      },
    });
  });

  it('accepts only a credential-free http(s) Web origin for inherited URL metadata', () => {
    expect(resolveWebMetadataBase('https://www.ai-world.test')).toEqual(
      new URL('https://www.ai-world.test'),
    );

    expect(() => resolveWebMetadataBase('https://ai-world.test/path')).toThrow(
      /AI_WORLD_WEB_ORIGIN/,
    );
    expect(() => resolveWebMetadataBase('https://ai-world.test?campaign=1')).toThrow(
      /AI_WORLD_WEB_ORIGIN/,
    );
    expect(() => resolveWebMetadataBase('ftp://ai-world.test')).toThrow(/AI_WORLD_WEB_ORIGIN/);
    expect(() => resolveWebMetadataBase('https://user:secret@ai-world.test')).toThrow(
      /AI_WORLD_WEB_ORIGIN/,
    );
  });
});
