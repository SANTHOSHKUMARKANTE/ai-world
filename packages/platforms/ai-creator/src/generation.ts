import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

export const GENERATION_INITIAL_STATUS = 'REQUESTED' as const;
export const GENERATION_SUCCEEDED_STATUS = 'SUCCEEDED' as const;
export const GENERATION_FAILED_STATUS = 'FAILED' as const;

export type GenerationStatus =
  | typeof GENERATION_INITIAL_STATUS
  | typeof GENERATION_SUCCEEDED_STATUS
  | typeof GENERATION_FAILED_STATUS;

export const GENERATION_PROVIDER_ERROR_FAILURE_KIND = 'PROVIDER_ERROR' as const;
export const GENERATION_INVALID_OUTPUT_FAILURE_KIND = 'INVALID_OUTPUT' as const;

export type GenerationFailureKind =
  typeof GENERATION_PROVIDER_ERROR_FAILURE_KIND | typeof GENERATION_INVALID_OUTPUT_FAILURE_KIND;

export interface GenerationRequest {
  readonly input: string;
  readonly instructions?: string;
  readonly createdAt: Date;
}

export interface GenerationResult {
  readonly text: string;
  readonly createdAt: Date;
}

export interface GenerationKnowledgeSourceContext {
  readonly id: ResourceId;
  readonly resourceType: NamespacedKey;
  readonly universeKey: NamespacedKey;
}

export interface GenerationSourceContext {
  readonly universeKey: NamespacedKey;
  readonly knowledgeResources: readonly GenerationKnowledgeSourceContext[];
}

export interface GenerationProvenance {
  readonly task: string;
  readonly sourceContext: GenerationSourceContext | null;
  readonly createdAt: Date;
}

export interface GenerationUsage {
  readonly providerLatencyMs: number;
  readonly inputTokens: number | null;
  readonly outputTokens: number | null;
  readonly totalTokens: number | null;
  readonly failureKind: GenerationFailureKind | null;
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
  readonly provenance?: GenerationProvenance | null;
  readonly usage?: GenerationUsage | null;
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
