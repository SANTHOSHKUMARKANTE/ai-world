import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import type { SearchContract, SearchRequest, SearchResultPage } from '../src';

class RecordingSearchContract implements SearchContract {
  readonly requests: SearchRequest[] = [];

  constructor(private readonly response: SearchResultPage) {}

  async search(input: SearchRequest): Promise<SearchResultPage> {
    this.requests.push(input);
    return this.response;
  }
}

describe('Discovery Search Contract', () => {
  it('carries query, Universe scope, Resource Type filter, pagination, and normalized Resource results', async () => {
    const universeKey = parseNamespacedKey('universe.anime');
    const resourceType = parseNamespacedKey('anime.character');
    const resourceId = parseResourceId('b3b3482c-a885-4d70-9fd7-67659891c322');

    const request: SearchRequest = {
      query: 'naruto',
      scope: {
        kind: 'universe',
        universeKey,
      },
      filter: {
        resourceTypes: [resourceType],
      },
      pagination: {
        offset: 20,
        limit: 10,
      },
    };

    const response: SearchResultPage = {
      items: [
        {
          resourceId,
          universeKey,
          resourceType,
        },
      ],
      pagination: request.pagination,
    };

    const search = new RecordingSearchContract(response);

    await expect(search.search(request)).resolves.toEqual(response);
    expect(search.requests).toEqual([request]);
  });

  it('supports an unfiltered global scope without introducing ranking or provider semantics', async () => {
    const request: SearchRequest = {
      query: 'temple',
      scope: {
        kind: 'global',
      },
      filter: {
        resourceTypes: [],
      },
      pagination: {
        offset: 0,
        limit: 20,
      },
    };

    const response: SearchResultPage = {
      items: [],
      pagination: request.pagination,
    };

    const search = new RecordingSearchContract(response);

    await expect(search.search(request)).resolves.toEqual(response);
    expect(search.requests[0]?.scope).toEqual({ kind: 'global' });
  });
});
