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
import { allowAiGenerationPermission } from './support/allow-ai-generation-permission';

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

function config() {
  return {
    provider: 'provider.test',
    permissions: allowAiGenerationPermission,
  } as const;
}

describe('GenerateText', () => {
  it('validates before persistence, persists REQUESTED before Provider, and allowlists Provider fields', async () => {
    const actorId = generateResourceId();
    const events: string[] = [];
    let requested: Generation | undefined;
    let providerRequest: unknown;

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
        throw new Error('markFailed should not be called for a valid Provider result.');
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

    const generateText = new GenerateText(provider, writer, config());

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
    expect(Object.keys(providerRequest as object).sort()).toEqual(['input', 'instructions']);

    expect(generation).toMatchObject({
      actorId,
      status: 'SUCCEEDED',
      provider: 'provider.test',
      model: 'model.actual',
      result: {
        text: 'A concise creator draft.',
      },
    });
  });

  it('marks FAILED and rethrows a Provider failure without fabricating output', async () => {
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

    const generateText = new GenerateText(provider, writer, config());

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
      model: null,
      result: null,
    });
  });

  it('marks FAILED when a Provider returns output outside the text schema', async () => {
    const actorId = generateResourceId();
    let requested: Generation | undefined;
    let failed = false;

    const writer: GenerationWriter = {
      async createRequested(input) {
        requested = requestedGeneration(input);
        return requested;
      },
      async markSucceeded() {
        throw new Error('markSucceeded must not run for invalid output.');
      },
      async markFailed() {
        failed = true;

        if (!requested) {
          throw new Error('Requested Generation was not created.');
        }

        return {
          ...requested,
          status: GENERATION_FAILED_STATUS,
        };
      },
    };

    const provider: AiProviderPort = {
      async generateText() {
        return {
          text: '   ',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, writer, config());

    await expect(
      generateText.execute({
        actorId,
        input: 'Draft text.',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_OUTPUT',
    });

    expect(failed).toBe(true);
  });

  it('does not persist or call the Provider when safety rejects the request', async () => {
    const actorId = generateResourceId();
    let writerCalled = false;
    let providerCalled = false;

    const writer: GenerationWriter = {
      async createRequested() {
        writerCalled = true;
        throw new Error('writer should not be called');
      },
      async markSucceeded() {
        return null;
      },
      async markFailed() {
        return null;
      },
    };

    const provider: AiProviderPort = {
      async generateText() {
        providerCalled = true;
        return {
          text: 'Generated.',
          model: 'model.actual',
        };
      },
    };

    const generateText = new GenerateText(provider, writer, config());

    await expect(
      generateText.execute({
        actorId,
        input: '   ',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });

    expect(writerCalled).toBe(false);
    expect(providerCalled).toBe(false);
  });

  it('does not manufacture success when REQUESTED-to-SUCCEEDED is unavailable', async () => {
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

    const generateText = new GenerateText(provider, writer, config());

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
