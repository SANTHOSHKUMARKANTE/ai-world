import { ApplicationError } from '@ai-world/foundation-errors';
import {
  PAGE_COMPOSITION_BLOCK_ITEM_KIND,
  PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
  PAGE_COMPOSITION_MEDIA_ITEM_KIND,
  type PageCompositionItemKind,
} from '@ai-world/platform-composition';
import { z } from 'zod';

const createPageRequestSchema = z
  .object({
    universeKey: z.string(),
    routePath: z.string(),
    title: z.string(),
  })
  .strict();

const listCreatorPagesRequestSchema = z
  .object({
    universeKey: z.string(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  })
  .strict();

const createTextBlockRequestSchema = z
  .object({
    universeKey: z.string(),
    text: z.string(),
  })
  .strict();

const compositionReferenceSchema = z
  .object({
    kind: z.enum([
      PAGE_COMPOSITION_BLOCK_ITEM_KIND,
      PAGE_COMPOSITION_KNOWLEDGE_ITEM_KIND,
      PAGE_COMPOSITION_MEDIA_ITEM_KIND,
    ]),
    id: z.string(),
  })
  .strict();

const setPageCompositionRequestSchema = z
  .object({
    items: z.array(compositionReferenceSchema),
  })
  .strict();

export interface CreateCreatorPageRequest {
  readonly universeKey: string;
  readonly routePath: string;
  readonly title: string;
}

export interface ListCreatorPagesRequest {
  readonly universeKey: string;
  readonly limit?: number;
}

export interface CreateCreatorTextBlockRequest {
  readonly universeKey: string;
  readonly text: string;
}

export interface CreatorCompositionReferenceRequest {
  readonly kind: PageCompositionItemKind;
  readonly id: string;
}

export interface SetCreatorPageCompositionRequest {
  readonly items: readonly CreatorCompositionReferenceRequest[];
}

function invalidRequest(operation: string): ApplicationError {
  return new ApplicationError({
    code: 'composition.creator.invalid_request',
    kind: 'validation',
    message: `Creator Composition ${operation} request failed transport validation.`,
    publicMessage: 'The creator Composition request is invalid.',
  });
}

export function parseCreateCreatorPageRequest(input: unknown): CreateCreatorPageRequest {
  const result = createPageRequestSchema.safeParse(input);
  if (!result.success) {
    throw invalidRequest('Page creation');
  }
  return result.data;
}

export function parseListCreatorPagesRequest(input: unknown): ListCreatorPagesRequest {
  const result = listCreatorPagesRequestSchema.safeParse(input);
  if (!result.success) {
    throw invalidRequest('Page listing');
  }
  return {
    universeKey: result.data.universeKey,
    ...(result.data.limit === undefined ? {} : { limit: result.data.limit }),
  };
}

export function parseCreateCreatorTextBlockRequest(input: unknown): CreateCreatorTextBlockRequest {
  const result = createTextBlockRequestSchema.safeParse(input);
  if (!result.success) {
    throw invalidRequest('Text Block creation');
  }
  return result.data;
}

export function parseSetCreatorPageCompositionRequest(
  input: unknown,
): SetCreatorPageCompositionRequest {
  const result = setPageCompositionRequestSchema.safeParse(input);
  if (!result.success) {
    throw invalidRequest('Page composition replacement');
  }
  return result.data;
}
