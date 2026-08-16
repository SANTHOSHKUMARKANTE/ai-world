import { ApplicationError } from '@ai-world/foundation-errors';
import { parseNamespacedKey, type NamespacedKey } from '@ai-world/kernel-namespace';

import {
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type KnowledgeResource,
} from './knowledge-resource';
import type { PublicKnowledgeResourceReader } from './public-knowledge-resource-reader';

export const PUBLIC_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT = 20;
export const PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT = 50;

export interface ListPublicKnowledgeResourcesInput {
  readonly universeKey: string;
  readonly resourceType?: string | undefined;
  readonly limit?: number | undefined;
}

function invalidPublicQuery(message: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.public.invalid_query',
    kind: 'validation',
    message,
    publicMessage: 'The public Knowledge query is invalid.',
  });
}

function parsePublicKey(value: string, field: string): NamespacedKey {
  try {
    return parseNamespacedKey(value);
  } catch {
    throw invalidPublicQuery(`Public Knowledge query contains an invalid ${field}.`);
  }
}

function parseLimit(value: number | undefined): number {
  if (value === undefined) {
    return PUBLIC_KNOWLEDGE_RESOURCE_DEFAULT_LIMIT;
  }

  if (!Number.isInteger(value) || value < 1 || value > PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT) {
    throw invalidPublicQuery(
      `Public Knowledge query limit must be an integer between 1 and ${PUBLIC_KNOWLEDGE_RESOURCE_MAX_LIMIT}.`,
    );
  }

  return value;
}

export class ListPublicKnowledgeResources {
  constructor(private readonly reader: PublicKnowledgeResourceReader) {}

  async execute(input: ListPublicKnowledgeResourcesInput): Promise<readonly KnowledgeResource[]> {
    const universeKey = parsePublicKey(input.universeKey, 'Universe key');
    const resourceType =
      input.resourceType === undefined
        ? undefined
        : parsePublicKey(input.resourceType, 'Resource Type');
    const limit = parseLimit(input.limit);

    const resources = await this.reader.listPublished({
      universeKey,
      ...(resourceType === undefined ? {} : { resourceType }),
      limit,
    });

    return resources
      .filter((resource) => {
        return (
          resource.lifecycle === KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE &&
          resource.universeKey === universeKey &&
          (resourceType === undefined || resource.resourceType === resourceType)
        );
      })
      .slice(0, limit);
  }
}
