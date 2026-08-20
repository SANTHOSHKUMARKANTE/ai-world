import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import {
  AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT,
  AUTHORIZED_AI_CONTEXT_MAX_LIMIT,
  type AuthorizedAiContextPort,
} from './authorized-ai-context';
import type { AiTool } from './ai-tool';

export const AI_SEARCH_KNOWLEDGE_TOOL_NAME = 'ai.search-knowledge' as const;
export const AI_SEARCH_KNOWLEDGE_TOOL_EFFECT = 'READ_ONLY' as const;

export const AI_SEARCH_KNOWLEDGE_TOOL_QUERY_MAX_LENGTH = 500;
export const AI_SEARCH_KNOWLEDGE_TOOL_MAX_RESOURCE_TYPES = 10;
export const AI_SEARCH_KNOWLEDGE_TOOL_DEFAULT_LIMIT = AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT;
export const AI_SEARCH_KNOWLEDGE_TOOL_MAX_LIMIT = AUTHORIZED_AI_CONTEXT_MAX_LIMIT;

export type SearchKnowledgeToolErrorCode = 'INVALID_INPUT' | 'INVALID_AUTHORIZED_RESULT';

export class SearchKnowledgeToolError extends Error {
  constructor(
    readonly code: SearchKnowledgeToolErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'SearchKnowledgeToolError';
  }
}

export interface SearchKnowledgeToolInput {
  readonly actorId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly query: string;
  readonly resourceTypes?: readonly NamespacedKey[];
  readonly limit?: number;
}

export interface SearchKnowledgeToolItem {
  readonly resourceId: ResourceId;
  readonly resourceType: NamespacedKey;
  readonly universeKey: NamespacedKey;
}

export interface SearchKnowledgeToolResult {
  readonly toolName: typeof AI_SEARCH_KNOWLEDGE_TOOL_NAME;
  readonly effect: typeof AI_SEARCH_KNOWLEDGE_TOOL_EFFECT;
  readonly items: readonly SearchKnowledgeToolItem[];
}

function invalidInput(message: string): never {
  throw new SearchKnowledgeToolError('INVALID_INPUT', message);
}

function invalidAuthorizedResult(message: string): never {
  throw new SearchKnowledgeToolError('INVALID_AUTHORIZED_RESULT', message);
}

function resolveQuery(query: string): string {
  if (query.includes('\u0000')) {
    invalidInput('Search Knowledge Tool query must not contain NUL characters.');
  }

  const resolved = query.trim();

  if (resolved.length === 0) {
    invalidInput('Search Knowledge Tool query must not be blank.');
  }

  if (resolved.length > AI_SEARCH_KNOWLEDGE_TOOL_QUERY_MAX_LENGTH) {
    invalidInput('Search Knowledge Tool query exceeds the supported length.');
  }

  return resolved;
}

function resolveLimit(limit: number | undefined): number {
  const resolved = limit ?? AI_SEARCH_KNOWLEDGE_TOOL_DEFAULT_LIMIT;

  if (
    !Number.isInteger(resolved) ||
    resolved < 1 ||
    resolved > AI_SEARCH_KNOWLEDGE_TOOL_MAX_LIMIT
  ) {
    invalidInput(
      `Search Knowledge Tool limit must be an integer between 1 and ${AI_SEARCH_KNOWLEDGE_TOOL_MAX_LIMIT}.`,
    );
  }

  return resolved;
}

function resolveResourceTypes(
  resourceTypes: readonly NamespacedKey[] | undefined,
): readonly NamespacedKey[] {
  const resolved = resourceTypes ?? [];

  if (resolved.length > AI_SEARCH_KNOWLEDGE_TOOL_MAX_RESOURCE_TYPES) {
    invalidInput(
      `Search Knowledge Tool supports at most ${AI_SEARCH_KNOWLEDGE_TOOL_MAX_RESOURCE_TYPES} Resource types.`,
    );
  }

  if (new Set<string>(resolved).size !== resolved.length) {
    invalidInput('Search Knowledge Tool Resource type filter contains duplicates.');
  }

  return resolved;
}

export class SearchKnowledgeTool implements AiTool<
  typeof AI_SEARCH_KNOWLEDGE_TOOL_NAME,
  SearchKnowledgeToolInput,
  SearchKnowledgeToolResult
> {
  readonly name = AI_SEARCH_KNOWLEDGE_TOOL_NAME;

  constructor(private readonly authorizedContext: AuthorizedAiContextPort) {}

  async execute(input: SearchKnowledgeToolInput): Promise<SearchKnowledgeToolResult> {
    const query = resolveQuery(input.query);
    const limit = resolveLimit(input.limit);
    const resourceTypes = resolveResourceTypes(input.resourceTypes);

    const context = await this.authorizedContext.resolve({
      actorId: input.actorId,
      universeKey: input.universeKey,
      query,
      resourceTypes,
      limit,
    });

    if (
      context.actorId !== input.actorId ||
      context.universeKey !== input.universeKey ||
      context.knowledgeResources.length > limit
    ) {
      invalidAuthorizedResult(
        'Search Knowledge Tool received context outside the authorized execution scope.',
      );
    }

    const allowedResourceTypes = new Set<string>(resourceTypes);
    const seenResourceIds = new Set<string>();
    const items: SearchKnowledgeToolItem[] = [];

    for (const resource of context.knowledgeResources) {
      if (resource.universeKey !== input.universeKey) {
        invalidAuthorizedResult('Search Knowledge Tool received a cross-Universe Resource.');
      }

      if (resourceTypes.length > 0 && !allowedResourceTypes.has(resource.resourceType)) {
        invalidAuthorizedResult(
          'Search Knowledge Tool received a Resource outside its type filter.',
        );
      }

      if (seenResourceIds.has(resource.id)) {
        invalidAuthorizedResult('Search Knowledge Tool received duplicate Knowledge Resources.');
      }

      seenResourceIds.add(resource.id);
      items.push({
        resourceId: resource.id,
        resourceType: resource.resourceType,
        universeKey: resource.universeKey,
      });
    }

    return {
      toolName: AI_SEARCH_KNOWLEDGE_TOOL_NAME,
      effect: AI_SEARCH_KNOWLEDGE_TOOL_EFFECT,
      items,
    };
  }
}
