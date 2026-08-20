import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  GenerateTextWithAuthorizedContext,
  type AuthorizedAiContextPort,
  type GenerateTextInput,
  type Generation,
} from '../src';

describe('GenerateTextWithAuthorizedContext', () => {
  it('resolves authorized context before generation and appends it to instructions', async () => {
    const actorId = generateResourceId();
    const resourceId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');
    const resourceType = parseNamespacedKey('context.temple');
    const events: string[] = [];
    let generationInput: GenerateTextInput | undefined;

    const context: AuthorizedAiContextPort = {
      async resolve(input) {
        events.push('context');

        expect(input).toEqual({
          actorId,
          universeKey,
          query: 'temple',
          resourceTypes: [resourceType],
          limit: 3,
        });

        return {
          actorId,
          userDisplayName: 'Creator',
          universeKey,
          knowledgeResources: [
            {
              id: resourceId,
              resourceType,
              universeKey,
            },
          ],
        };
      },
    };

    const expectedGeneration = {
      id: generateResourceId(),
      actorId,
      status: 'SUCCEEDED',
      provider: 'provider.test',
      model: 'model.actual',
      request: {
        input: 'Draft a description.',
        instructions: '',
        createdAt: new Date('2026-08-20T00:00:00.000Z'),
      },
      result: {
        text: 'Generated.',
        createdAt: new Date('2026-08-20T00:00:01.000Z'),
      },
      createdAt: new Date('2026-08-20T00:00:00.000Z'),
      updatedAt: new Date('2026-08-20T00:00:01.000Z'),
    } as Generation;

    const generateText = {
      async execute(input: GenerateTextInput) {
        events.push('generate');
        generationInput = input;
        return expectedGeneration;
      },
    };

    const useCase = new GenerateTextWithAuthorizedContext(context, generateText);

    await expect(
      useCase.execute({
        actorId,
        universeKey,
        input: 'Draft a description.',
        instructions: 'Use one sentence.',
        contextQuery: 'temple',
        contextResourceTypes: [resourceType],
        contextLimit: 3,
      }),
    ).resolves.toBe(expectedGeneration);

    expect(events).toEqual(['context', 'generate']);
    expect(generationInput).toEqual({
      actorId,
      input: 'Draft a description.',
      instructions: [
        'Use one sentence.',
        '',
        'Authorized AI context:',
        'User display name: Creator',
        `Universe: ${universeKey}`,
        'Published Knowledge resources:',
        `- ${resourceType} | ${resourceId}`,
      ].join('\n'),
    });
  });

  it('uses only the authorized context block when caller instructions are blank', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');
    let generationInput: GenerateTextInput | undefined;

    const context: AuthorizedAiContextPort = {
      async resolve() {
        return {
          actorId,
          userDisplayName: null,
          universeKey,
          knowledgeResources: [],
        };
      },
    };

    const generateText = {
      async execute(input: GenerateTextInput) {
        generationInput = input;
        throw new Error('stop-after-capture');
      },
    };

    const useCase = new GenerateTextWithAuthorizedContext(context, generateText);

    await expect(
      useCase.execute({
        actorId,
        universeKey,
        input: 'Draft.',
        instructions: '   ',
        contextQuery: 'temple',
      }),
    ).rejects.toThrow('stop-after-capture');

    expect(generationInput?.instructions).toBe(
      [
        'Authorized AI context:',
        'User display name: (not set)',
        `Universe: ${universeKey}`,
        'Published Knowledge resources:',
        '- none',
      ].join('\n'),
    );
  });
});
