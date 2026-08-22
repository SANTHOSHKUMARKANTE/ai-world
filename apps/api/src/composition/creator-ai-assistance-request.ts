import { ApplicationError } from '@ai-world/foundation-errors';
import {
  AUTHORIZED_AI_CONTEXT_MAX_LIMIT,
  AI_TEXT_INPUT_MAX_LENGTH,
  AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES,
} from '@ai-world/platform-ai-creator';
import { z } from 'zod';

const suggestKnowledgeCandidateRequestSchema = z
  .object({
    universeKey: z.string(),
    request: z.string().max(AI_TEXT_INPUT_MAX_LENGTH),
    contextQuery: z.string().max(500),
    contextResourceTypes: z.array(z.string()).max(AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES).optional(),
    contextLimit: z.number().int().min(1).max(AUTHORIZED_AI_CONTEXT_MAX_LIMIT).optional(),
  })
  .strict();

export interface SuggestCreatorKnowledgeCandidateRequest {
  readonly universeKey: string;
  readonly request: string;
  readonly contextQuery: string;
  readonly contextResourceTypes?: readonly string[];
  readonly contextLimit?: number;
}

export function parseSuggestCreatorKnowledgeCandidateRequest(
  input: unknown,
): SuggestCreatorKnowledgeCandidateRequest {
  const result = suggestKnowledgeCandidateRequestSchema.safeParse(input);

  if (!result.success) {
    throw new ApplicationError({
      code: 'composition.ai_assistance.invalid_request',
      kind: 'validation',
      message: 'Creator AI-assisted Knowledge suggestion request failed transport validation.',
      publicMessage: 'The AI-assisted Knowledge suggestion request is invalid.',
    });
  }

  return {
    universeKey: result.data.universeKey,
    request: result.data.request,
    contextQuery: result.data.contextQuery,
    ...(result.data.contextResourceTypes === undefined
      ? {}
      : { contextResourceTypes: result.data.contextResourceTypes }),
    ...(result.data.contextLimit === undefined ? {} : { contextLimit: result.data.contextLimit }),
  };
}
