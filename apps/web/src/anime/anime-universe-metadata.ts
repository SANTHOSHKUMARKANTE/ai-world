import type { Metadata } from 'next';

import { resolveWebUniversePresentation } from '../universes/presentation';

export const ANIME_UNIVERSE_CANONICAL_PATH = '/anime';

export function buildAnimeUniverseMetadata(): Metadata {
  const anime = resolveWebUniversePresentation('universe.anime');

  if (!anime) {
    throw new Error('Missing Anime Universe presentation.');
  }

  const socialTitle = `${anime.label} · AI World`;

  return {
    title: anime.label,
    description: anime.description,
    alternates: {
      canonical: ANIME_UNIVERSE_CANONICAL_PATH,
    },
    openGraph: {
      type: 'website',
      siteName: 'AI World',
      title: socialTitle,
      description: anime.description,
    },
  };
}
