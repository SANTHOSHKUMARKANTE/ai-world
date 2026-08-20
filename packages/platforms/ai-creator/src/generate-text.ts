import { generateResourceId, type ResourceId } from '@ai-world/kernel-identifiers';

import type { AiProviderPort, AiProviderTextRequest } from './ai-provider-port';
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
}

export class GenerateText {
  constructor(
    private readonly provider: AiProviderPort,
    private readonly writer: GenerationWriter,
    private readonly config: GenerateTextConfig,
  ) {}

  async execute(input: GenerateTextInput): Promise<Generation> {
    const generationId = generateResourceId();

    await this.writer.createRequested({
      id: generationId,
      actorId: input.actorId,
      provider: this.config.provider,
      task: input.task ?? AI_TEXT_GENERATION_TASK,
      ...(input.sourceContext === undefined ? {} : { sourceContext: input.sourceContext }),
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
    });

    const providerRequest: AiProviderTextRequest = {
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
    };

    let providerResult;

    try {
      providerResult = await this.provider.generateText(providerRequest);
    } catch (error) {
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
