import { generateResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import type { PermissionEvaluationReader } from '@ai-world/platform-identity-access';

import { AiGenerationSafety } from './ai-generation-safety';
import type { AiProviderPort } from './ai-provider-port';
import type { Generation, GenerationSourceContext } from './generation';
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
}

export class GenerateText {
  private readonly safety: AiGenerationSafety;

  constructor(
    private readonly provider: AiProviderPort,
    private readonly writer: GenerationWriter,
    private readonly config: GenerateTextConfig,
  ) {
    this.safety = new AiGenerationSafety(config.permissions);
  }

  private async failGeneration(generationId: ResourceId, error: unknown): Promise<never> {
    const failedGeneration = await this.writer.markFailed({
      id: generationId,
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

    let providerResult: unknown;

    try {
      providerResult = await this.provider.generateText(providerRequest);
    } catch (error) {
      return this.failGeneration(generationId, error);
    }

    try {
      this.safety.assertProviderResult(providerResult);
    } catch (error) {
      return this.failGeneration(generationId, error);
    }

    const succeededGeneration = await this.writer.markSucceeded({
      id: generationId,
      model: providerResult.model,
      text: providerResult.text,
    });

    if (!succeededGeneration) {
      throw new Error('Generation could not transition from REQUESTED to SUCCEEDED.');
    }

    return succeededGeneration;
  }
}
