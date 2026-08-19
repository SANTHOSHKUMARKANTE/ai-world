import type { ResourceId } from '@ai-world/kernel-identifiers';

export const GENERATION_INITIAL_STATUS = 'REQUESTED' as const;
export const GENERATION_SUCCEEDED_STATUS = 'SUCCEEDED' as const;
export const GENERATION_FAILED_STATUS = 'FAILED' as const;

export type GenerationStatus =
  | typeof GENERATION_INITIAL_STATUS
  | typeof GENERATION_SUCCEEDED_STATUS
  | typeof GENERATION_FAILED_STATUS;

export interface GenerationRequest {
  readonly input: string;
  readonly instructions?: string;
  readonly createdAt: Date;
}

export interface GenerationResult {
  readonly text: string;
  readonly createdAt: Date;
}

export interface Generation {
  readonly id: ResourceId;
  readonly actorId: ResourceId;
  readonly status: GenerationStatus;
  readonly provider: string;
  readonly model: string | null;
  readonly request: GenerationRequest;
  readonly result: GenerationResult | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export function isGenerationStatus(value: unknown): value is GenerationStatus {
  return (
    value === GENERATION_INITIAL_STATUS ||
    value === GENERATION_SUCCEEDED_STATUS ||
    value === GENERATION_FAILED_STATUS
  );
}
