import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';
import { describe, expect, it, vi } from 'vitest';

import { PrismaKnowledgeSearch } from '../src/prisma-knowledge-search';
import type { SearchRequest } from '../src/search-contract';

function createDatabaseStub(): {
  readonly database: DatabaseClient;
  readonly queryRaw: ReturnType<typeof vi.fn>;
} {
  const queryRaw = vi.fn();

  return {
    database: {
      $queryRaw: queryRaw,
    } as unknown as DatabaseClient,
    queryRaw,
  };
}

function readRawQueryCall(queryRaw: ReturnType<typeof vi.fn>): {
  readonly sql: string;
  readonly values: readonly unknown[];
} {
  const call = queryRaw.mock.calls.at(0);

  if (!call) {
    throw new Error('Expected a PostgreSQL query call.');
  }

  const [template, ...values] = call;

  return {
    sql: (template as TemplateStringsArray).join(' ? ').replace(/\s+/g, ' ').trim(),
    values,
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
  it('executes parameterized global PostgreSQL Search with understandable ranking', async () => {
    const { database, queryRaw } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const request = createUniverseRequest({
      scope: {
        kind: 'global',
      },
    });

    queryRaw.mockResolvedValue([]);

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    expect(queryRaw).toHaveBeenCalledTimes(1);

    const { sql, values } = readRawQueryCall(queryRaw);

    expect(sql).toContain('FROM knowledge_resources AS resources');
    expect(sql).toContain('LEFT JOIN knowledge_resource_profiles AS profiles');
    expect(sql).toContain('strpos(lower(resources.resource_type), lower( ? )) > 0');
    expect(sql).toContain("resources.resource_type = ANY(string_to_array( ? , ','))");
    expect(sql).toContain('WHEN lower(resources.resource_type) = lower( ? ) THEN 0');
    expect(sql).toContain(
      "WHEN lower(split_part(resources.resource_type, '.', -1)) = lower( ? ) THEN 1",
    );
    expect(sql).toContain(
      "WHEN starts_with(lower(split_part(resources.resource_type, '.', -1)), lower( ? )) THEN 2",
    );
    expect(sql).toContain('WHEN starts_with(lower(resources.resource_type), lower( ? )) THEN 3');
    expect(sql).toContain('resources.created_at DESC');
    expect(sql).toContain('resources.id ASC');

    expect(values).toEqual([
      null,
      null,
      KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      'temple',
      0,
      '',
      'temple',
      'temple',
      'temple',
      'temple',
      0,
      20,
    ]);
  });

  it('parameterizes exact Resource Type filters alongside Universe scope', async () => {
    const { database, queryRaw } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const universeKey = parseNamespacedKey('search.test-universe');
    const templeType = parseNamespacedKey('search.temple');
    const deityType = parseNamespacedKey('search.deity');
    const request = createUniverseRequest({
      query: '.',
      filter: {
        resourceTypes: [templeType, deityType],
      },
    });

    queryRaw.mockResolvedValue([]);

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    const { sql, values } = readRawQueryCall(queryRaw);

    expect(sql).toContain('resources.universe_key = ?');
    expect(sql).toContain("resources.resource_type = ANY(string_to_array( ? , ','))");
    expect(values).toEqual([
      universeKey,
      universeKey,
      KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      '.',
      2,
      'search.temple,search.deity',
      '.',
      '.',
      '.',
      '.',
      0,
      20,
    ]);
  });

  it('returns public profile identity when available and preserves a profileless fallback', async () => {
    const { database, queryRaw } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const request = createUniverseRequest();

    queryRaw.mockResolvedValue([
      {
        id: '11111111-1111-4111-8111-111111111111',
        universeKey: 'universe.devotional',
        resourceType: 'devotional.deity',
        slug: 'shiva',
        displayName: 'Lord Shiva',
        summary: 'The auspicious one.',
      },
      {
        id: '22222222-2222-4222-8222-222222222222',
        universeKey: 'universe.devotional',
        resourceType: 'devotional.temple',
        slug: null,
        displayName: null,
        summary: null,
      },
    ]);

    await expect(search.search(request)).resolves.toEqual({
      items: [
        {
          resourceId: '11111111-1111-4111-8111-111111111111',
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary: 'The auspicious one.',
        },
        {
          resourceId: '22222222-2222-4222-8222-222222222222',
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
        },
      ],
      pagination: request.pagination,
    });
  });

  it('returns no results for a blank query without turning it into a broad listing', async () => {
    const { database, queryRaw } = createDatabaseStub();
    const search = new PrismaKnowledgeSearch(database);
    const request = createUniverseRequest({
      query: '   ',
    });

    await expect(search.search(request)).resolves.toEqual({
      items: [],
      pagination: request.pagination,
    });

    expect(queryRaw).not.toHaveBeenCalled();
  });

  it('rejects invalid pagination before querying PostgreSQL', async () => {
    const { database, queryRaw } = createDatabaseStub();
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

    expect(queryRaw).not.toHaveBeenCalled();
  });
});
