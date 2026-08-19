import { describe, expect, it } from 'vitest';

import {
  OPENAI_INITIAL_MODEL,
  OpenAiProviderAdapter,
  createOpenAiProviderAdapter,
} from '../src/infrastructure/openai/openai-provider-adapter';

describe('OpenAiProviderAdapter', () => {
  it('maps the AI World text contract to the OpenAI Responses API boundary', async () => {
    const providerRequests: unknown[] = [];

    const adapter = new OpenAiProviderAdapter(async (request) => {
      providerRequests.push(request);

      return {
        output_text: 'A concise AI World draft.',
        model: 'gpt-5.6-terra',
      };
    });

    const result = await adapter.generateText({
      instructions: 'Write one concise sentence.',
      input: 'Describe AI World.',
    });

    expect(providerRequests).toEqual([
      {
        model: OPENAI_INITIAL_MODEL,
        input: 'Describe AI World.',
        instructions: 'Write one concise sentence.',
        store: false,
      },
    ]);

    expect(result).toEqual({
      text: 'A concise AI World draft.',
      model: 'gpt-5.6-terra',
    });
  });

  it('omits Provider instructions when the AI World request does not supply them', async () => {
    const providerRequests: unknown[] = [];

    const adapter = new OpenAiProviderAdapter(async (request) => {
      providerRequests.push(request);

      return {
        output_text: 'Generated text.',
        model: 'gpt-5.6-terra',
      };
    });

    await adapter.generateText({
      input: 'Generate text.',
    });

    expect(providerRequests).toEqual([
      {
        model: OPENAI_INITIAL_MODEL,
        input: 'Generate text.',
        store: false,
      },
    ]);
  });

  it('rejects an empty API credential before creating a Provider client', () => {
    expect(() =>
      createOpenAiProviderAdapter({
        apiKey: '   ',
      }),
    ).toThrow('OpenAI API key is required.');
  });
});
