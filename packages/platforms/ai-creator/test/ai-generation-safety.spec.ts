import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import type { PermissionEvaluationReader } from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  AI_GENERATE_PERMISSION_KEY,
  AI_TEXT_INPUT_MAX_LENGTH,
  AI_TEXT_MODEL_MAX_LENGTH,
  AI_TEXT_OUTPUT_MAX_LENGTH,
  AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES,
  AI_TEXT_TOOL_ACCESS,
  AiGenerationSafety,
  AiGenerationSafetyError,
} from '../src';

function safetyWithPermission(allowed: boolean) {
  const calls: unknown[] = [];

  const permissions: PermissionEvaluationReader = {
    async hasPermission(input) {
      calls.push(input);
      return allowed;
    },
  };

  return {
    safety: new AiGenerationSafety(permissions),
    calls,
  };
}

describe('AiGenerationSafety', () => {
  it('requires the canonical ai.generate permission', async () => {
    const actorId = generateResourceId();
    const { safety, calls } = safetyWithPermission(true);

    await safety.assertRequestAllowed({
      actorId,
      input: 'Draft text.',
      task: 'ai.text-generation',
    });

    expect(calls).toEqual([
      {
        actorId,
        permissionKey: AI_GENERATE_PERMISSION_KEY,
      },
    ]);
  });

  it('fails closed when the Actor lacks permission', async () => {
    const { safety } = safetyWithPermission(false);

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: 'Draft text.',
        task: 'ai.text-generation',
      }),
    ).rejects.toMatchObject({
      name: 'AiGenerationSafetyError',
      code: 'PERMISSION_DENIED',
    });
  });

  it('rejects blank/oversized input before permission evaluation', async () => {
    const { safety, calls } = safetyWithPermission(true);

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: '   ',
        task: 'ai.text-generation',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: 'x'.repeat(AI_TEXT_INPUT_MAX_LENGTH + 1),
        task: 'ai.text-generation',
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });

    expect(calls).toEqual([]);
  });

  it('rejects credential-like sensitive data before Provider transfer', async () => {
    const { safety, calls } = safetyWithPermission(true);

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: 'Use this credential: api_key=super-secret-value-12345',
        task: 'ai.text-generation',
      }),
    ).rejects.toMatchObject({
      code: 'SENSITIVE_DATA',
    });

    expect(calls).toEqual([]);
  });

  it('rejects invalid or cross-Universe source context', async () => {
    const { safety } = safetyWithPermission(true);
    const universeKey = parseNamespacedKey('context.alpha');
    const otherUniverseKey = parseNamespacedKey('context.beta');
    const resourceType = parseNamespacedKey('context.temple');

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: 'Draft.',
        task: 'ai.text-generation',
        sourceContext: {
          universeKey,
          knowledgeResources: [
            {
              id: generateResourceId(),
              resourceType,
              universeKey: otherUniverseKey,
            },
          ],
        },
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });

    const resources = Array.from({ length: AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES + 1 }, () => ({
      id: generateResourceId(),
      resourceType,
      universeKey,
    }));

    await expect(
      safety.assertRequestAllowed({
        actorId: generateResourceId(),
        input: 'Draft.',
        task: 'ai.text-generation',
        sourceContext: {
          universeKey,
          knowledgeResources: resources,
        },
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_INPUT',
    });
  });

  it('enforces a disabled tool policy by allowlisting Provider request fields', () => {
    const { safety } = safetyWithPermission(true);

    expect(AI_TEXT_TOOL_ACCESS).toBe('DISABLED');

    const runtimeInput = {
      input: 'Draft.',
      instructions: 'Concise.',
      tools: ['unapproved.tool'],
    } as unknown as {
      readonly input: string;
      readonly instructions?: string;
    };

    const request = safety.createProviderRequest(runtimeInput);

    expect(request).toEqual({
      input: 'Draft.',
      instructions: 'Concise.',
    });
    expect('tools' in request).toBe(false);
  });

  it('validates the Provider output schema at runtime', () => {
    const { safety } = safetyWithPermission(true);

    expect(() =>
      safety.assertProviderResult({
        text: 'Valid.',
        model: 'model.actual',
      }),
    ).not.toThrow();

    for (const result of [
      null,
      {},
      { text: '', model: 'model.actual' },
      { text: 'x'.repeat(AI_TEXT_OUTPUT_MAX_LENGTH + 1), model: 'model.actual' },
      { text: 'Valid.', model: 'm'.repeat(AI_TEXT_MODEL_MAX_LENGTH + 1) },
      { text: 'Valid.', model: '' },
    ]) {
      expect(() => safety.assertProviderResult(result)).toThrow(AiGenerationSafetyError);
    }
  });
});
