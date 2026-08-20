import { generateResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import type { PermissionEvaluationReader } from '@ai-world/platform-identity-access';

import { AiGenerationSafety } from './ai-generation-safety';
import type { AiProviderPort } from './ai-provider-port';
import {
  GENERATION_INVALID_OUTPUT_FAILURE_KIND,
  GENERATION_PROVIDER_ERROR_FAILURE_KIND,
  type Generation,
  type GenerationFailureKind,
  type GenerationSourceContext,
} from './generation';
import type { GenerationWriter } from './generation-writer';

export const AI_TEXT_GENERATION_TASK = 'ai.text-generation' as const;

export interface GenerateTextInput {
  readonly actorId: ResourceId;
  readonly input: string;
  readonly instructions?: string;
  readonly task?: string;
  readonly sourceContext?: GenerationSourceContext;
}

export interface GenerateTextConfig {
  readonly provider: string;
  readonly permissions: PermissionEvaluationReader;
  readonly nowMilliseconds?: () => number;
}

export const AI_PROVIDER_LATENCY_MAX_MS = 2_147_483_647;

function providerLatencyMilliseconds(startedAt: number, finishedAt: number): number {
  const elapsed = Math.round(finishedAt - startedAt);

  if (!Number.isFinite(elapsed)) {
    return AI_PROVIDER_LATENCY_MAX_MS;
  }

  return Math.min(AI_PROVIDER_LATENCY_MAX_MS, Math.max(0, elapsed));
}

export class GenerateText {
  private readonly safety: AiGenerationSafety;
  private readonly nowMilliseconds: () => number;

  constructor(
    private readonly provider: AiProviderPort,
    private readonly writer: GenerationWriter,
    private readonly config: GenerateTextConfig,
  ) {
    this.safety = new AiGenerationSafety(config.permissions);
    this.nowMilliseconds = config.nowMilliseconds ?? Date.now;
  }

  private async failGeneration(
    generationId: ResourceId,
    error: unknown,
    providerLatencyMs: number,
    failureKind: GenerationFailureKind,
  ): Promise<never> {
    const failedGeneration = await this.writer.markFailed({
      id: generationId,
      providerLatencyMs,
      failureKind,
    });

    if (!failedGeneration) {
      throw new Error('Generation could not transition from REQUESTED to FAILED.', {
        cause: error,
      });
    }

    throw error;
  }

  async execute(input: GenerateTextInput): Promise<Generation> {
    const task = input.task ?? AI_TEXT_GENERATION_TASK;

    await this.safety.assertRequestAllowed({
      actorId: input.actorId,
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
      task,
      ...(input.sourceContext === undefined ? {} : { sourceContext: input.sourceContext }),
    });

    const generationId = generateResourceId();

    await this.writer.createRequested({
      id: generationId,
      actorId: input.actorId,
      provider: this.config.provider,
      task,
      ...(input.sourceContext === undefined ? {} : { sourceContext: input.sourceContext }),
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
    });

    const providerRequest = this.safety.createProviderRequest({
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
    });

    const providerStartedAt = this.nowMilliseconds();
    let providerResult: unknown;

    try {
      providerResult = await this.provider.generateText(providerRequest);
    } catch (error) {
      const providerLatencyMs = providerLatencyMilliseconds(
        providerStartedAt,
        this.nowMilliseconds(),
      );

      return this.failGeneration(
        generationId,
        error,
        providerLatencyMs,
        GENERATION_PROVIDER_ERROR_FAILURE_KIND,
      );
    }

    const providerLatencyMs = providerLatencyMilliseconds(
      providerStartedAt,
      this.nowMilliseconds(),
    );

    try {
      this.safety.assertProviderResult(providerResult);
    } catch (error) {
      return this.failGeneration(
        generationId,
        error,
        providerLatencyMs,
        GENERATION_INVALID_OUTPUT_FAILURE_KIND,
      );
    }

    const succeededGeneration = await this.writer.markSucceeded({
      id: generationId,
      model: providerResult.model,
      text: providerResult.text,
      providerLatencyMs,
      ...(providerResult.usage === undefined ? {} : { usage: providerResult.usage }),
    });

    if (!succeededGeneration) {
      throw new Error('Generation could not transition from REQUESTED to SUCCEEDED.');
    }

    return succeededGeneration;
  }
}
