import type { SearchContract } from '@ai-world/platform-discovery';
import {
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type PublicKnowledgeResourceReader,
} from '@ai-world/platform-knowledge';
import type { UserProfileReader } from '@ai-world/platform-user';

import {
  AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT,
  AUTHORIZED_AI_CONTEXT_MAX_LIMIT,
  type AuthorizedAiContext,
  type AuthorizedAiContextPort,
  type AuthorizedAiKnowledgeResourceContext,
  type ResolveAuthorizedAiContextInput,
} from '../authorized-ai-context';

function resolveLimit(limit: number | undefined): number {
  const resolved = limit ?? AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT;

  if (!Number.isInteger(resolved) || resolved < 1 || resolved > AUTHORIZED_AI_CONTEXT_MAX_LIMIT) {
    throw new TypeError(
      `Authorized AI context limit must be an integer between 1 and ${AUTHORIZED_AI_CONTEXT_MAX_LIMIT}.`,
    );
  }

  return resolved;
}

export class PlatformAuthorizedAiContext implements AuthorizedAiContextPort {
  constructor(
    private readonly users: UserProfileReader,
    private readonly discovery: SearchContract,
    private readonly knowledge: PublicKnowledgeResourceReader,
  ) {}

  async resolve(input: ResolveAuthorizedAiContextInput): Promise<AuthorizedAiContext> {
    const user = await this.users.findByActorId({
      actorId: input.actorId,
    });

    if (!user || user.actorId !== input.actorId) {
      throw new Error('Authorized AI context could not resolve the requesting User.');
    }

    const page = await this.discovery.search({
      query: input.query,
      scope: {
        kind: 'universe',
        universeKey: input.universeKey,
      },
      filter: {
        resourceTypes: input.resourceTypes ?? [],
      },
      pagination: {
        offset: 0,
        limit: resolveLimit(input.limit),
      },
    });

    const resources: AuthorizedAiKnowledgeResourceContext[] = [];
    const seenResourceIds = new Set<string>();

    for (const result of page.items) {
      if (result.universeKey !== input.universeKey) {
        throw new Error('Discovery returned Knowledge outside the authorized Universe scope.');
      }

      if (seenResourceIds.has(result.resourceId)) {
        continue;
      }

      const resource = await this.knowledge.findPublishedById({
        id: result.resourceId,
      });

      if (!resource) {
        continue;
      }

      if (
        resource.lifecycle !== KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE ||
        resource.universeKey !== input.universeKey ||
        resource.id !== result.resourceId
      ) {
        throw new Error('Knowledge returned a Resource outside the authorized public context.');
      }

      resources.push({
        id: resource.id,
        resourceType: resource.resourceType,
        universeKey: resource.universeKey,
      });
      seenResourceIds.add(resource.id);
    }

    return {
      actorId: input.actorId,
      userDisplayName: user.displayName,
      universeKey: input.universeKey,
      knowledgeResources: resources,
    };
  }
}
