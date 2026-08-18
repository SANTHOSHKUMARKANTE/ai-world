import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';
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
  it('executes global Search without adding a Universe predicate', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const request = createUniverseRequest({
      scope: {
        kind: 'global',
      },
    });

    findMany.mockResolvedValue([]);

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    expect(findMany).toHaveBeenCalledWith({
      where: {
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        resourceType: {
          contains: 'temple',
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        universeKey: true,
        resourceType: true,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: 0,
      take: 20,
    });
  });

  it('executes exact Resource Type filters as an any-of constraint alongside Universe scope', async () => {
    const { database, findMany } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const templeType = parseNamespacedKey('search.temple');
    const deityType = parseNamespacedKey('search.deity');
    const request = createUniverseRequest({
      query: '.',
      filter: {
        resourceTypes: [templeType, deityType],
      },
    });

    findMany.mockResolvedValue([]);

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    expect(findMany).toHaveBeenCalledWith({
      where: {
        universeKey: parseNamespacedKey('search.test-universe'),
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        resourceType: {
          contains: '.',
          mode: 'insensitive',
          in: [templeType, deityType],
        },
      },
      select: {
        id: true,
        universeKey: true,
        resourceType: true,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: 0,
      take: 20,
    });
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
