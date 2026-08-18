import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';

import type { SearchContract, SearchRequest, SearchResultPage } from './search-contract';

function assertSupportedKnowledgeSearchRequest(input: SearchRequest): void {
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
        ...(input.scope.kind === 'universe'
          ? {
              universeKey: input.scope.universeKey,
            }
          : {}),
        lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        resourceType: {
          contains: query,
          mode: 'insensitive',
          ...(input.filter.resourceTypes.length === 0
            ? {}
            : {
                in: [...input.filter.resourceTypes],
              }),
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
