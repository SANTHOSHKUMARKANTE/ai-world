import OpenAI from 'openai';

import type {
  AiProviderPort,
  AiProviderTextRequest,
  AiProviderTextResult,
} from '../../ai-provider-port';

export const OPENAI_INITIAL_MODEL = 'gpt-5.6-terra' as const;

export interface OpenAiProviderConfig {
  readonly apiKey: string;
}

interface OpenAiResponseRequest {
  readonly model: typeof OPENAI_INITIAL_MODEL;
  readonly input: string;
  readonly instructions?: string;
  readonly store: false;
}

interface OpenAiResponseResult {
  readonly output_text: string;
  readonly model: string;
}

type CreateOpenAiResponse = (request: OpenAiResponseRequest) => Promise<OpenAiResponseResult>;

export class OpenAiProviderAdapter implements AiProviderPort {
  constructor(private readonly createResponse: CreateOpenAiResponse) {}

  async generateText(request: AiProviderTextRequest): Promise<AiProviderTextResult> {
    const providerRequest: OpenAiResponseRequest = {
      model: OPENAI_INITIAL_MODEL,
      input: request.input,
      store: false,
      ...(request.instructions === undefined ? {} : { instructions: request.instructions }),
    };

    const response = await this.createResponse(providerRequest);

    return {
      text: response.output_text,
      model: response.model,
    };
  }
}

export function createOpenAiProviderAdapter(config: OpenAiProviderConfig): AiProviderPort {
  const apiKey = config.apiKey.trim();

  if (apiKey.length === 0) {
    throw new Error('OpenAI API key is required.');
  }

  const client = new OpenAI({ apiKey });

  return new OpenAiProviderAdapter((request) => client.responses.create(request));
}
