import type { DatabaseClient } from '@ai-world/foundation-database';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE } from '@ai-world/platform-knowledge';

import type { SearchContract, SearchRequest, SearchResultPage } from './search-contract';

interface KnowledgeSearchRow {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
}

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

    const universeKey = input.scope.kind === 'universe' ? input.scope.universeKey : null;
    const resourceTypeFilter = input.filter.resourceTypes.join(',');

    const resources = await this.database.$queryRaw<KnowledgeSearchRow[]>`
      SELECT
        id,
        universe_key AS "universeKey",
        resource_type AS "resourceType"
      FROM knowledge_resources
      WHERE
        (${universeKey}::text IS NULL OR universe_key = ${universeKey})
        AND lifecycle = ${KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE}
        AND strpos(lower(resource_type), lower(${query})) > 0
        AND (
          ${input.filter.resourceTypes.length}::int = 0
          OR resource_type = ANY(string_to_array(${resourceTypeFilter}, ','))
        )
      ORDER BY
        CASE
          WHEN lower(resource_type) = lower(${query}) THEN 0
          WHEN lower(split_part(resource_type, '.', -1)) = lower(${query}) THEN 1
          WHEN starts_with(lower(split_part(resource_type, '.', -1)), lower(${query})) THEN 2
          WHEN starts_with(lower(resource_type), lower(${query})) THEN 3
          ELSE 4
        END ASC,
        created_at DESC,
        id ASC
      OFFSET ${input.pagination.offset}
      LIMIT ${input.pagination.limit}
    `;

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
