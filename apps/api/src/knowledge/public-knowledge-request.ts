import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const publicKnowledgeListQuerySchema = z
  .object({
    universeKey: z.string(),
    resourceType: z.string().optional(),
    limit: z.coerce.number().int().optional(),
  })
  .strict();

export interface PublicKnowledgeListQuery {
  readonly universeKey: string;
  readonly resourceType?: string | undefined;
  readonly limit?: number | undefined;
}

export function parsePublicKnowledgeListQuery(input: unknown): PublicKnowledgeListQuery {
  const result = publicKnowledgeListQuerySchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'knowledge.public.invalid_request',
      kind: 'validation',
      message: 'Public Knowledge query failed transport validation.',
      publicMessage: 'The public Knowledge request is invalid.',
    });
  }

  return result.data;
}
