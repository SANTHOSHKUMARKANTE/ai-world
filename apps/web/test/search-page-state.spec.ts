import { describe, expect, it } from 'vitest';

import { parseSearchPageState } from '../src/discovery/search-page-state';

describe('UXP-08C Search URL state', () => {
  it('accepts bounded canonical Search state and removes duplicates', () => {
    expect(
      parseSearchPageState({
        query: '  temple  ',
        universeKey: 'universe.devotional',
        resourceType: ['devotional.temple', 'devotional.temple', 'anime.character'],
        offset: '20',
      }),
    ).toEqual({
      query: 'temple',
      universeKey: 'universe.devotional',
      resourceTypes: ['devotional.temple', 'anime.character'],
      offset: 20,
    });
  });

  it('rejects unknown filters and unsafe offsets without failing the page', () => {
    expect(
      parseSearchPageState({
        query: ['character', 'ignored'],
        universeKey: 'universe.unknown',
        resourceType: ['not.canonical', 'anime.series'],
        offset: '-1',
      }),
    ).toEqual({
      query: 'character',
      universeKey: '',
      resourceTypes: ['anime.series'],
      offset: 0,
    });
  });
});
