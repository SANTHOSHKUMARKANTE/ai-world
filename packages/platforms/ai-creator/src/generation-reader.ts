import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { Generation } from './generation';

export interface FindGenerationByIdInput {
  readonly id: ResourceId;
}

export interface GenerationReader {
  findById(input: FindGenerationByIdInput): Promise<Generation | null>;
}
