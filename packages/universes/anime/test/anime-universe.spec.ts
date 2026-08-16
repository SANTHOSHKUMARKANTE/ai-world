import type { KnowledgeResource } from '@ai-world/platform-knowledge';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  ANIME_CHARACTER_RESOURCE_TYPE,
  ANIME_RESOURCE_TYPES,
  ANIME_SERIES_RESOURCE_TYPE,
  ANIME_UNIVERSE_DEFINITION,
  ANIME_UNIVERSE_KEY,
  type AnimeResourceType,
  type CharacterResource,
  type SeriesResource,
} from '../src';

describe('Anime reuse-test Universe v1', () => {
  it('declares the minimal Anime Universe identity and Resource Types', () => {
    expect(ANIME_UNIVERSE_DEFINITION).toEqual({
      key: 'universe.anime',
      resourceTypes: ['anime.character', 'anime.series'],
    });

    expect(ANIME_RESOURCE_TYPES).toEqual([
      ANIME_CHARACTER_RESOURCE_TYPE,
      ANIME_SERIES_RESOURCE_TYPE,
    ]);

    expect(new Set(ANIME_RESOURCE_TYPES).size).toBe(ANIME_RESOURCE_TYPES.length);
  });

  it('reuses the shared Knowledge Resource contract', () => {
    expectTypeOf<CharacterResource>().toMatchTypeOf<KnowledgeResource>();
    expectTypeOf<SeriesResource>().toMatchTypeOf<KnowledgeResource>();

    expectTypeOf<CharacterResource['universeKey']>().toEqualTypeOf<typeof ANIME_UNIVERSE_KEY>();
    expectTypeOf<SeriesResource['universeKey']>().toEqualTypeOf<typeof ANIME_UNIVERSE_KEY>();

    expectTypeOf<CharacterResource['resourceType']>().toEqualTypeOf<
      typeof ANIME_CHARACTER_RESOURCE_TYPE
    >();
    expectTypeOf<SeriesResource['resourceType']>().toEqualTypeOf<
      typeof ANIME_SERIES_RESOURCE_TYPE
    >();
  });

  it('keeps the reuse-test domain fields deliberately narrow', () => {
    expectTypeOf<CharacterResource['name']>().toEqualTypeOf<string>();
    expectTypeOf<SeriesResource['title']>().toEqualTypeOf<string>();
  });

  it('exposes a closed Anime Resource Type union', () => {
    expectTypeOf<AnimeResourceType>().toEqualTypeOf<
      typeof ANIME_CHARACTER_RESOURCE_TYPE | typeof ANIME_SERIES_RESOURCE_TYPE
    >();
  });
});
