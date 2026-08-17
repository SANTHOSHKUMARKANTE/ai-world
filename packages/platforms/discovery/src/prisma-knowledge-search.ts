import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';

import type {
  SearchContract,
  SearchRequest,
  SearchResultPage,
  UniverseSearchScope,
} from './search-contract';

interface SupportedKnowledgeSearchRequest extends SearchRequest {
  readonly scope: UniverseSearchScope;
}

function assertSupportedKnowledgeSearchRequest(
  input: SearchRequest,
): asserts input is SupportedKnowledgeSearchRequest {
  if (input.scope.kind !== 'universe') {
    throw new TypeError('Global Knowledge Search is deferred until P6-M04 Cross-Universe Search.');
  }

  if (input.filter.resourceTypes.length !== 0) {
    throw new TypeError('Discovery filter execution is deferred until P6-M05 Filters.');
  }

  if (!Number.isInteger(input.pagination.offset) || input.pagination.offset < 0) {
    throw new TypeError('Search pagination offset must be a non-negative integer.');
  }

  if (!Number.isInteger(input.pagination.limit) || input.pagination.limit < 1) {
    throw new TypeError('Search pagination limit must be a positive integer.');
  }
}

export class PrismaKnowledgeSearch implements SearchContract {
  public constructor(private readonly database: DatabaseClient) {}

  public async search(input: SearchRequest): Promise<SearchResultPage> {
    assertSupportedKnowledgeSearchRequest(input);

    const query = input.query.trim();

    if (query.length === 0) {
      return {
        items: [],
        pagination: input.pagination,
      };
    }

    const resources = await this.database.knowledgeResource.findMany({
      where: {
        universeKey: input.scope.universeKey,
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        resourceType: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        universeKey: true,
        resourceType: true,
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip: input.pagination.offset,
      take: input.pagination.limit,
    });

    return {
      items: resources.map((resource) => ({
        resourceId: parseResourceId(resource.id),
        resourceType: parseNamespacedKey(resource.resourceType),
        universeKey: parseNamespacedKey(resource.universeKey),
      })),
      pagination: input.pagination,
    };
  }
}
