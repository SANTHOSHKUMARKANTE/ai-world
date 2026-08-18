import { ApplicationError } from '@ai-world/foundation-errors';
import type { SearchRequest } from '@ai-world/platform-discovery';
import { z } from 'zod';

const namespacedKeySchema = z
  .string()
  .max(128)
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*)+$/);

const resourceTypeQuerySchema = z.union([namespacedKeySchema, z.array(namespacedKeySchema)]);

const publicDiscoverySearchQuerySchema = z
  .object({
    query: z.string(),
    universeKey: namespacedKeySchema.optional(),
    resourceType: resourceTypeQuerySchema.optional(),
    offset: z.coerce.number().int().min(0).default(0),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  })
  .strict();

export function parsePublicDiscoverySearchQuery(input: unknown): SearchRequest {
  const result = publicDiscoverySearchQuerySchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'discovery.search.invalid_request',
      kind: 'validation',
      message: 'Public Discovery Search query failed transport validation.',
      publicMessage: 'The Search request is invalid.',
    });
  }

  const resourceTypes =
    result.data.resourceType === undefined
      ? []
      : Array.isArray(result.data.resourceType)
        ? result.data.resourceType
        : [result.data.resourceType];

  return {
    query: result.data.query,
    scope:
      result.data.universeKey === undefined
        ? { kind: 'global' }
        : { kind: 'universe', universeKey: result.data.universeKey },
    filter: { resourceTypes: [...new Set(resourceTypes)] },
    pagination: { offset: result.data.offset, limit: result.data.limit },
  };
}
