import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it, vi } from 'vitest';

import { PrismaKnowledgeSearch } from '../src/prisma-knowledge-search';
import type { SearchRequest } from '../src/search-contract';

function createDatabaseStub(): {
  readonly database: DatabaseClient;
  readonly findMany: ReturnType<typeof vi.fn>;
} {
  const findMany = vi.fn();

  return {
    database: {
      knowledgeResource: {
        findMany,
      },
    } as unknown as DatabaseClient,
    findMany,
  };
}

function createUniverseRequest(overrides: Partial<SearchRequest> = {}): SearchRequest {
  return {
    query: 'temple',
    scope: {
      kind: 'universe',
      universeKey: parseNamespacedKey('search.test-universe'),
    },
    filter: {
      resourceTypes: [],
    },
    pagination: {
      offset: 0,
      limit: 20,
    },
    ...overrides,
  };
}

describe('PrismaKnowledgeSearch capability boundary', () => {
  it('rejects global Search until P6-M04', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search(
        createUniverseRequest({
          scope: {
            kind: 'global',
          },
        }),
      ),
    ).rejects.toThrow('P6-M04');

    expect(findMany).not.toHaveBeenCalled();
  });

  it('rejects Resource Type filter execution until P6-M05', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search(
        createUniverseRequest({
          filter: {
            resourceTypes: [parseNamespacedKey('search.temple')],
          },
        }),
      ),
    ).rejects.toThrow('P6-M05');

    expect(findMany).not.toHaveBeenCalled();
  });

  it('returns no results for a blank query without turning it into a broad listing', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const request = createUniverseRequest({
      query: '   ',
    });

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    expect(findMany).not.toHaveBeenCalled();
  });

  it('rejects invalid pagination before querying PostgreSQL', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);

    await expect(
      search.search(
        createUniverseRequest({
          pagination: {
            offset: -1,
            limit: 0,
          },
        }),
      ),
    ).rejects.toThrow('offset');

    expect(findMany).not.toHaveBeenCalled();
  });
});
