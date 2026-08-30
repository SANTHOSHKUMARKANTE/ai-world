import { describe, expect, it } from 'vitest';

import {
  DEVOTIONAL_UNIVERSE_CANONICAL_PATH,
  buildDevotionalUniverseMetadata,
} from '../src/devotional/devotional-universe-metadata';

describe('UXP-07A Devotional Universe social identity', () => {
  it('builds stable Devotional canonical and Open Graph identity', () => {
    const metadata = buildDevotionalUniverseMetadata();

    expect(DEVOTIONAL_UNIVERSE_CANONICAL_PATH).toBe('/devotional');
    expect(metadata).toMatchObject({
      title: 'Devotional',
      description:
        'Explore published devotional Knowledge through the same shared AI World experience.',
      alternates: {
        canonical: '/devotional',
      },
      openGraph: {
        type: 'website',
        siteName: 'AI World',
        title: 'Devotional · AI World',
        description:
          'Explore published devotional Knowledge through the same shared AI World experience.',
      },
    });
  });
});
