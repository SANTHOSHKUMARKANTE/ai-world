import type { ResourceId } from '@ai-world/kernel-identifiers';

import type { AiProviderTextUsage } from './ai-provider-port';
import type { Generation, GenerationFailureKind, GenerationSourceContext } from './generation';

export interface CreateRequestedGenerationInput {
  readonly id: ResourceId;
  readonly actorId: ResourceId;
  readonly provider: string;
  readonly task: string;
  readonly sourceContext?: GenerationSourceContext;
  readonly input: string;
  readonly instructions?: string;
}

export interface MarkGenerationSucceededInput {
  readonly id: ResourceId;
  readonly model: string;
  readonly text: string;
  readonly providerLatencyMs: number;
  readonly usage?: AiProviderTextUsage;
}

export interface MarkGenerationFailedInput {
  readonly id: ResourceId;
  readonly providerLatencyMs: number;
  readonly failureKind: GenerationFailureKind;
}

export interface GenerationWriter {
  createRequested(input: CreateRequestedGenerationInput): Promise<Generation>;

  markSucceeded(input: MarkGenerationSucceededInput): Promise<Generation | null>;

  markFailed(input: MarkGenerationFailedInput): Promise<Generation | null>;
}
