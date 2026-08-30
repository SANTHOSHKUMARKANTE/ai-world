import type { Metadata } from 'next';

import { resolveWebUniversePresentation } from '../universes/presentation';

export const DEVOTIONAL_UNIVERSE_CANONICAL_PATH = '/devotional';

export function buildDevotionalUniverseMetadata(): Metadata {
  const devotional = resolveWebUniversePresentation('universe.devotional');

  if (!devotional) {
    throw new Error('Missing Devotional Universe presentation.');
  }

  const socialTitle = `${devotional.label} · AI World`;

  return {
    title: devotional.label,
    description: devotional.description,
    alternates: {
      canonical: DEVOTIONAL_UNIVERSE_CANONICAL_PATH,
    },
    openGraph: {
      type: 'website',
      siteName: 'AI World',
      title: socialTitle,
      description: devotional.description,
    },
  };
}
