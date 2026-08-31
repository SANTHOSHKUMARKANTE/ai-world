import { describe, expect, it } from 'vitest';

import {
  formatPublicKnowledgeResourceType,
  resolvePublicKnowledgeDestination,
} from '../src/knowledge/public-knowledge-destination';

describe('UXP-08A public Knowledge destination resolver', () => {
  it('routes only accepted specialized Resource identities to their canonical destinations', () => {
    expect(
      resolvePublicKnowledgeDestination({
        resourceId: 'character-id',
        universeKey: 'universe.anime',
        resourceType: 'anime.character',
        slug: 'naruto-uzumaki',
      }),
    ).toBe('/anime/characters/naruto-uzumaki');

    expect(
      resolvePublicKnowledgeDestination({
        resourceId: 'series-id',
        universeKey: 'universe.anime',
        resourceType: 'anime.series',
        slug: 'naruto',
      }),
    ).toBe('/anime/series/naruto');

    expect(
      resolvePublicKnowledgeDestination({
        resourceId: 'deity-id',
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'shiva',
      }),
    ).toBe('/devotional/shiva');
  });

  it('keeps non-specialized and mismatched typed identities on the generic Knowledge fallback', () => {
    expect(
      resolvePublicKnowledgeDestination({
        resourceId: 'temple/id',
        universeKey: 'universe.devotional',
        resourceType: 'devotional.temple',
        slug: 'kashi-vishwanath',
      }),
    ).toBe('/knowledge/resources/temple%2Fid');

    expect(
      resolvePublicKnowledgeDestination({
        resourceId: 'wrong-universe-id',
        universeKey: 'universe.devotional',
        resourceType: 'anime.character',
        slug: 'not-an-anime-route',
      }),
    ).toBe('/knowledge/resources/wrong-universe-id');
  });

  it('turns raw Resource Type keys into friendly product vocabulary', () => {
    expect(formatPublicKnowledgeResourceType('anime.character')).toBe('Character');
    expect(formatPublicKnowledgeResourceType('devotional.sacred-place')).toBe('Sacred Place');
  });
});
