import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const createCreatorKnowledgeRequestSchema = z
  .object({
    universeKey: z.string(),
    resourceType: z.string(),
  })
  .strict();

const updateCreatorKnowledgeRequestSchema = z
  .object({
    resourceType: z.string(),
  })
  .strict();

export interface CreateCreatorKnowledgeRequest {
  readonly universeKey: string;
  readonly resourceType: string;
}

export interface UpdateCreatorKnowledgeRequest {
  readonly resourceType: string;
}

function invalidCreatorKnowledgeRequest(operation: string): ApplicationError {
  return new ApplicationError({
    code: 'knowledge.creator.invalid_request',
    kind: 'validation',
    message: `Creator Knowledge ${operation} request failed transport validation.`,
    publicMessage: 'The creator Knowledge request is invalid.',
  });
}

export function parseCreateCreatorKnowledgeRequest(input: unknown): CreateCreatorKnowledgeRequest {
  const result = createCreatorKnowledgeRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidCreatorKnowledgeRequest('creation');
  }

  return result.data;
}

export function parseUpdateCreatorKnowledgeRequest(input: unknown): UpdateCreatorKnowledgeRequest {
  const result = updateCreatorKnowledgeRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidCreatorKnowledgeRequest('update');
  }

  return result.data;
}
