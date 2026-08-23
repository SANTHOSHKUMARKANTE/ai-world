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

const creatorKnowledgeMediaPlacementSchema = z
  .object({
    assetId: z.string(),
    role: z.string(),
    playback: z.string(),
    altText: z.string(),
    caption: z.string().nullable().optional(),
    posterAssetId: z.string().nullable().optional(),
  })
  .strict();

const setCreatorKnowledgeMediaRequestSchema = z
  .object({
    placements: z.array(creatorKnowledgeMediaPlacementSchema),
  })
  .strict();

export interface CreateCreatorKnowledgeRequest {
  readonly universeKey: string;
  readonly resourceType: string;
}

export interface UpdateCreatorKnowledgeRequest {
  readonly resourceType: string;
}

export interface SetCreatorKnowledgeMediaPlacementRequest {
  readonly assetId: string;
  readonly role: string;
  readonly playback: string;
  readonly altText: string;
  readonly caption: string | null;
  readonly posterAssetId: string | null;
}

export interface SetCreatorKnowledgeMediaRequest {
  readonly placements: readonly SetCreatorKnowledgeMediaPlacementRequest[];
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

export function parseSetCreatorKnowledgeMediaRequest(
  input: unknown,
): SetCreatorKnowledgeMediaRequest {
  const result = setCreatorKnowledgeMediaRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidCreatorKnowledgeRequest('media-placement replacement');
  }

  return {
    placements: result.data.placements.map((placement) => ({
      assetId: placement.assetId,
      role: placement.role,
      playback: placement.playback,
      altText: placement.altText,
      caption: placement.caption ?? null,
      posterAssetId: placement.posterAssetId ?? null,
    })),
  };
}
