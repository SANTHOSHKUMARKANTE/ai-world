import type { ResourceId } from '@ai-world/kernel-identifiers';
import type { NamespacedKey } from '@ai-world/kernel-namespace';

import type { AuthorizedAiContext, AuthorizedAiContextPort } from './authorized-ai-context';
import type { Generation, GenerationSourceContext } from './generation';
import type { GenerateText, GenerateTextInput } from './generate-text';

export const AI_AUTHORIZED_TEXT_GENERATION_TASK = 'ai.authorized-text-generation' as const;

export interface GenerateTextWithAuthorizedContextInput {
  readonly actorId: ResourceId;
  readonly universeKey: NamespacedKey;
  readonly input: string;
  readonly instructions?: string;
  readonly task?: string;
  readonly contextQuery: string;
  readonly contextResourceTypes?: readonly NamespacedKey[];
  readonly contextLimit?: number;
}

type TextGenerator = Pick<GenerateText, 'execute'>;

function formatAuthorizedContext(context: AuthorizedAiContext): string {
  const knowledgeLines =
    context.knowledgeResources.length === 0
      ? ['- none']
      : context.knowledgeResources.map((resource) => `- ${resource.resourceType} | ${resource.id}`);

  return [
    'Authorized AI context:',
    `User display name: ${context.userDisplayName ?? '(not set)'}`,
    `Universe: ${context.universeKey}`,
    'Published Knowledge resources:',
    ...knowledgeLines,
  ].join('\n');
}

function mergeInstructions(instructions: string | undefined, authorizedContext: string): string {
  if (instructions === undefined || instructions.trim().length === 0) {
    return authorizedContext;
  }

  return `${instructions}\n\n${authorizedContext}`;
}

function toGenerationSourceContext(context: AuthorizedAiContext): GenerationSourceContext {
  return {
    universeKey: context.universeKey,
    knowledgeResources: context.knowledgeResources.map((resource) => ({
      id: resource.id,
      resourceType: resource.resourceType,
      universeKey: resource.universeKey,
    })),
  };
}

export class GenerateTextWithAuthorizedContext {
  constructor(
    private readonly context: AuthorizedAiContextPort,
    private readonly generateText: TextGenerator,
  ) {}

  async execute(input: GenerateTextWithAuthorizedContextInput): Promise<Generation> {
    const context = await this.context.resolve({
      actorId: input.actorId,
      universeKey: input.universeKey,
      query: input.contextQuery,
      ...(input.contextResourceTypes === undefined
        ? {}
        : { resourceTypes: input.contextResourceTypes }),
      ...(input.contextLimit === undefined ? {} : { limit: input.contextLimit }),
    });

    const generationInput: GenerateTextInput = {
      actorId: input.actorId,
      input: input.input,
      instructions: mergeInstructions(input.instructions, formatAuthorizedContext(context)),
      task: input.task ?? AI_AUTHORIZED_TEXT_GENERATION_TASK,
      sourceContext: toGenerationSourceContext(context),
    };

    return this.generateText.execute(generationInput);
  }
}
