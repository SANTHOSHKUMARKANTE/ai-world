import { ApplicationError } from '@ai-world/foundation-errors';
import { z } from 'zod';

const createCollectionRequestSchema = z
  .object({
    name: z.string(),
  })
  .strict();

const addCollectionResourceRequestSchema = z
  .object({
    resourceId: z.string(),
  })
  .strict();

export interface CreateCollectionRequest {
  readonly name: string;
}

export interface AddCollectionResourceRequest {
  readonly resourceId: string;
}

function invalidCollectionRequest(): ApplicationError {
  return new ApplicationError({
    code: 'engagement.collection.invalid_request',
    kind: 'validation',
    message: 'Collection request payload failed transport validation.',
    publicMessage: 'The Collection request is invalid.',
  });
}

export function parseCreateCollectionRequest(input: unknown): CreateCollectionRequest {
  const result = createCollectionRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidCollectionRequest();
  }

  return result.data;
}

export function parseAddCollectionResourceRequest(input: unknown): AddCollectionResourceRequest {
  const result = addCollectionResourceRequestSchema.safeParse(input);

  if (!result.success) {
    throw invalidCollectionRequest();
  }

  return result.data;
}
