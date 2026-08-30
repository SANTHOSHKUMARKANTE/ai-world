import { describe, expect, it } from 'vitest';

import { buildDevotionalDeityMetadata } from '../src/devotional/devotional-deity-metadata';
import type { PublicKnowledgeEntity } from '../src/knowledge/public-knowledge-entity-api';

const IMAGE_ID = '96900000-0000-4000-8000-000000000001';
const VIDEO_ID = '96900000-0000-4000-8000-000000000002';

function entityWithMedia(media: PublicKnowledgeEntity['media']): PublicKnowledgeEntity {
  return {
    resource: {
      id: '96910000-0000-4000-8000-000000000001',
      universeKey: 'universe.devotional',
      resourceType: 'devotional.deity',
    },
    profile: {
      slug: 'acceptance-deity',
      displayName: 'Acceptance Deity',
      nativeName: null,
      alternateNames: [],
      summary: 'A UXP-06D canonical/social acceptance fixture.',
      overview: null,
      facts: [],
    },
    media,
    relations: [],
  };
}

describe('UXP-06D Devotional Deity canonical/social acceptance gaps', () => {
  it('uses an eligible STILL IMAGE when it is the best available social image', () => {
    const metadata = buildDevotionalDeityMetadata(
      entityWithMedia([
        {
          assetId: IMAGE_ID,
          assetType: 'IMAGE',
          mimeType: 'image/png',
          role: 'HERO',
          playback: 'STILL',
          position: 0,
          altText: 'Acceptance still',
          caption: null,
          posterAssetId: null,
        },
      ]),
      'acceptance-deity',
      'https://api.ai-world.test',
    );

    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: `https://api.ai-world.test/media/assets/${IMAGE_ID}/thumbnail`,
          alt: 'Acceptance Deity artwork',
        },
      ],
    });
  });

  it('does not fabricate a social image from raw VIDEO when no eligible poster exists', () => {
    const metadata = buildDevotionalDeityMetadata(
      entityWithMedia([
        {
          assetId: VIDEO_ID,
          assetType: 'VIDEO',
          mimeType: 'video/mp4',
          role: 'HERO',
          playback: 'SHORT_LOOP',
          position: 0,
          altText: 'Raw motion without poster',
          caption: null,
          durationMs: 5000,
          posterAssetId: null,
        },
      ]),
      'acceptance-deity',
      'https://api.ai-world.test',
    );

    expect(metadata.openGraph).not.toHaveProperty('images');
  });
});
