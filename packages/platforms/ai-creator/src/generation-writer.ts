import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Generation } from './generation';

export interface CreateRequestedGenerationInput {
  readonly id: ResourceId;
  readonly actorId: ResourceId;
  readonly provider: string;
  readonly input: string;
  readonly instructions?: string;
}

export interface MarkGenerationSucceededInput {
  readonly id: ResourceId;
  readonly model: string;
  readonly text: string;
}

export interface MarkGenerationFailedInput {
  readonly id: ResourceId;
}

export interface GenerationWriter {
  createRequested(input: CreateRequestedGenerationInput): Promise<Generation>;

  markSucceeded(input: MarkGenerationSucceededInput): Promise<Generation | null>;

  markFailed(input: MarkGenerationFailedInput): Promise<Generation | null>;
}
