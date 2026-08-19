import { describe, expect, it } from 'vitest';

import type { AiProviderPort, AiProviderTextRequest, AiProviderTextResult } from '../src';

function createTestProvider(): AiProviderPort {
  return {
    generateText(request: AiProviderTextRequest): Promise<AiProviderTextResult> {
      return Promise.resolve({
        text: request.input,
        model: 'test-model',
      });
    },
  };
}

describe('AiProviderPort', () => {
  it('allows a consumer to depend on the provider-neutral text contract', async () => {
    const provider = createTestProvider();

    const result = await provider.generateText({
      instructions: 'Summarize the input.',
      input: 'Canonical Knowledge remains owned by Knowledge.',
    });

    expect(result).toEqual({
      text: 'Canonical Knowledge remains owned by Knowledge.',
      model: 'test-model',
    });
  });

  it('keeps provider instructions optional at the contract boundary', async () => {
    const provider = createTestProvider();

    await expect(
      provider.generateText({
        input: 'Generate text without Provider-specific request types.',
      }),
    ).resolves.toEqual({
      text: 'Generate text without Provider-specific request types.',
      model: 'test-model',
    });
  });
});
