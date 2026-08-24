import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const factSchema = z
  .object({
    key: z.string().min(1).max(128),
    label: z.string().min(1).max(40),
    value: z.string().min(1).max(120),
  })
  .strict();

const relationSchema = z
  .object({
    targetResourceId: z.string().uuid(),
    sectionKey: z.string().min(1).max(128),
    relationshipType: z.string().min(1).max(128),
    position: z.number().int().nonnegative(),
  })
  .strict();

const configureKnowledgeEntitySchema = z
  .object({
    profile: z
      .object({
        slug: z.string().min(1).max(96),
        displayName: z.string().min(1).max(160),
        nativeName: z.string().max(160).nullable().optional(),
        alternateNames: z.array(z.string().max(160)).max(12).optional(),
        summary: z.string().min(1).max(600),
        overview: z.string().max(6000).nullable().optional(),
        facts: z.array(factSchema).max(12),
      })
      .strict(),
    relations: z.array(relationSchema).max(120),
  })
  .strict();

export type ConfigureCreatorKnowledgeEntityRequest = z.infer<typeof configureKnowledgeEntitySchema>;

export function parseConfigureCreatorKnowledgeEntityRequest(
  input: unknown,
): ConfigureCreatorKnowledgeEntityRequest {
  const result = configureKnowledgeEntitySchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'knowledge.creator.entity_invalid_request',
      kind: 'validation',
      message: 'Creator Knowledge Entity request failed transport validation.',
      publicMessage: 'The creator Knowledge Entity request is invalid.',
    });
  }

  return result.data;
}
