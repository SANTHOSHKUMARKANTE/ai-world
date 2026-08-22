import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const addFavoriteRequestSchema = z
  .object({
    resourceId: z.string(),
  })
  .strict();

export interface AddFavoriteRequest {
  readonly resourceId: string;
}

function invalidFavoriteRequest(): ApplicationError {
  return new ApplicationError({
    code: 'engagement.favorite.invalid_request',
    kind: 'validation',
    message: 'Favorite request payload failed transport validation.',
    publicMessage: 'The Favorite request is invalid.',
  });
}

export function parseAddFavoriteRequest(input: unknown): AddFavoriteRequest {
  const result = addFavoriteRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidFavoriteRequest();
  }

  return result.data;
}
