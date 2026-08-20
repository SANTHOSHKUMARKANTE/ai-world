import { generateResourceId } from '@ai-world/kernel-identifiers';
import { describe, expect, it } from 'vitest';

import {
  GENERATION_FAILED_STATUS,
  GENERATION_INITIAL_STATUS,
  GENERATION_SUCCEEDED_STATUS,
  GenerateText,
  type AiProviderPort,
  type CreateRequestedGenerationInput,
  type Generation,
  type GenerationWriter,
} from '../src';

function requestedGeneration(input: CreateRequestedGenerationInput): Generation {
  const now = new Date('2026-08-20T00:00:00.000Z');

  return {
    id: input.id,
    actorId: input.actorId,
    status: GENERATION_INITIAL_STATUS,
    provider: input.provider,
    model: null,
    request: {
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
      createdAt: now,
    },
    result: null,
    createdAt: now,
    updatedAt: now,
  };
}

describe('GenerateText', () => {
  it('persists REQUESTED before calling the Provider and completes with actual text/model', async () => {
    const actorId = generateResourceId();
    const events: string[] = [];
    let requested: Generation | undefined;
    let providerRequest: { readonly input: string; readonly instructions?: string } | undefined;

    const writer: GenerationWriter = {
      async createRequested(input) {
        events.push('requested');
        requested = requestedGeneration(input);
        return requested;
      },
      async markSucceeded(input) {
        events.push('succeeded');

        if (!requested) {
          throw new Error('Requested Generation was not created.');
        }

        const now = new Date('2026-08-20T00:00:01.000Z');

        return {
          ...requested,
          status: GENERATION_SUCCEEDED_STATUS,
          model: input.model,
          result: {
            text: input.text,
            createdAt: now,
          },
          updatedAt: now,
        };
      },
      async markFailed() {
        throw new Error('markFailed should not be called for a successful Provider result.');
      },
    };

    const provider: AiProviderPort = {
      async generateText(request) {
        expect(events).toEqual(['requested']);
        events.push('provider');
        providerRequest = request;

        return {
          text: 'A concise creator draft.',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, writer, {
      provider: 'provider.test',
    });

    const generation = await generateText.execute({
      actorId,
      input: 'Draft a short description.',
      instructions: 'Use one sentence.',
    });

    expect(events).toEqual(['requested', 'provider', 'succeeded']);
    expect(providerRequest).toEqual({
      input: 'Draft a short description.',
      instructions: 'Use one sentence.',
    });
    expect(generation).toMatchObject({
      actorId,
      status: 'SUCCEEDED',
      provider: 'provider.test',
      model: 'model.actual',
      request: {
        input: 'Draft a short description.',
        instructions: 'Use one sentence.',
      },
      result: {
        text: 'A concise creator draft.',
      },
    });
  });

  it('marks the Generation FAILED and rethrows the Provider failure without fabricating output', async () => {
    const actorId = generateResourceId();
    const events: string[] = [];
    const providerFailure = new Error('provider unavailable');
    let requested: Generation | undefined;
    let failedGeneration: Generation | undefined;

    const writer: GenerationWriter = {
      async createRequested(input) {
        events.push('requested');
        requested = requestedGeneration(input);
        return requested;
      },
      async markSucceeded() {
        throw new Error('markSucceeded should not be called after Provider failure.');
      },
      async markFailed() {
        events.push('failed');

        if (!requested) {
          throw new Error('Requested Generation was not created.');
        }

        failedGeneration = {
          ...requested,
          status: GENERATION_FAILED_STATUS,
          updatedAt: new Date('2026-08-20T00:00:01.000Z'),
        };

        return failedGeneration;
      },
    };

    const provider: AiProviderPort = {
      async generateText() {
        events.push('provider');
        throw providerFailure;
      },
    };

    const generateText = new GenerateText(provider, writer, {
      provider: 'provider.test',
    });

    await expect(
      generateText.execute({
        actorId,
        input: 'Draft text.',
      }),
    ).rejects.toBe(providerFailure);

    expect(events).toEqual(['requested', 'provider', 'failed']);
    expect(failedGeneration).toMatchObject({
      actorId,
      status: 'FAILED',
      provider: 'provider.test',
      model: null,
      result: null,
      request: {
        input: 'Draft text.',
      },
    });
  });

  it('does not manufacture success when the REQUESTED-to-SUCCEEDED transition is unavailable', async () => {
    const actorId = generateResourceId();
    let requested: Generation | undefined;
    let failedCalled = false;

    const writer: GenerationWriter = {
      async createRequested(input) {
        requested = requestedGeneration(input);
        return requested;
      },
      async markSucceeded() {
        return null;
      },
      async markFailed() {
        failedCalled = true;
        return null;
      },
    };

    const provider: AiProviderPort = {
      async generateText() {
        return {
          text: 'Generated text.',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, writer, {
      provider: 'provider.test',
    });

    await expect(
      generateText.execute({
        actorId,
        input: 'Draft text.',
      }),
    ).rejects.toThrow('Generation could not transition from REQUESTED to SUCCEEDED.');

    expect(requested?.status).toBe('REQUESTED');
    expect(failedCalled).toBe(false);
  });
});
