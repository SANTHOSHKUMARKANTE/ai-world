import { describe, expect, it } from 'vitest';

import {
  buildGenericKnowledgeResourceMetadata,
  canonicalDestinationForEntity,
} from '../src/knowledge/generic-knowledge-resource-metadata';
import type { PublicKnowledgeEntity } from '../src/knowledge/public-knowledge-entity-api';

function entity(overrides: Partial<PublicKnowledgeEntity['resource']> = {}): PublicKnowledgeEntity {
  return {
    resource: {
      id: '11111111-1111-4111-8111-111111111111',
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
      ...overrides,
    },
    profile: {
      slug: 'kashi-vishwanath',
      displayName: 'Kashi Vishwanath Temple',
      nativeName: null,
      alternateNames: [],
      summary: 'Published sacred-place Knowledge.',
      overview: null,
      facts: [],
    },
    media: [
      {
        assetId: '22222222-2222-4222-8222-222222222222',
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Temple artwork',
        caption: null,
        posterAssetId: null,
      },
    ],
    relations: [],
  };
}

describe('generic Knowledge Resource metadata', () => {
  it('uses the truthful generic route and eligible Entity image for non-specialized Knowledge', () => {
    const value = entity();
    const metadata = buildGenericKnowledgeResourceMetadata(
      value,
      value.resource.id,
      'https://api.ai-world.test',
    );

    expect(metadata.title).toBe('Kashi Vishwanath Temple');
    expect(metadata.alternates?.canonical).toBe(
      '/knowledge/resources/11111111-1111-4111-8111-111111111111',
    );
    expect(metadata.openGraph?.images).toEqual([
      {
        url: 'https://api.ai-world.test/media/assets/22222222-2222-4222-8222-222222222222/thumbnail',
        alt: 'Kashi Vishwanath Temple artwork',
      },
    ]);
  });

  it('preserves specialized canonical precedence instead of creating a duplicate generic page', () => {
    const baseCharacter = entity({
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
    });
    const character: PublicKnowledgeEntity = {
      ...baseCharacter,
      profile: {
        ...baseCharacter.profile,
        slug: 'naruto-uzumaki',
      },
    };

    expect(canonicalDestinationForEntity(character)).toBe('/anime/characters/naruto-uzumaki');

    const metadata = buildGenericKnowledgeResourceMetadata(
      character,
      character.resource.id,
      'https://api.ai-world.test',
    );

    expect(metadata.alternates?.canonical).toBe('/anime/characters/naruto-uzumaki');
  });

  it('uses stable campaign-independent generic fallback metadata when no Entity profile exists', () => {
    const metadata = buildGenericKnowledgeResourceMetadata(
      null,
      '33333333-3333-4333-8333-333333333333',
      'https://api.ai-world.test',
    );

    expect(metadata.title).toBe('Published Knowledge');
    expect(metadata.alternates?.canonical).toBe(
      '/knowledge/resources/33333333-3333-4333-8333-333333333333',
    );
  });
});
