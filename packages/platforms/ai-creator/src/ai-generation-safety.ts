import type { ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import type { PermissionEvaluationReader } from '@ai-world/platform-identity-access';

import type { AiProviderTextRequest, AiProviderTextResult } from './ai-provider-port';
import type { GenerationSourceContext } from './generation';

export const AI_GENERATE_PERMISSION_KEY = parseNamespacedKey('ai.generate');

export const AI_TEXT_INPUT_MAX_LENGTH = 20_000;
export const AI_TEXT_INSTRUCTIONS_MAX_LENGTH = 10_000;
export const AI_TEXT_OUTPUT_MAX_LENGTH = 50_000;
export const AI_TEXT_MODEL_MAX_LENGTH = 128;
export const AI_TEXT_TASK_MAX_LENGTH = 128;
export const AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES = 10;
export const AI_USAGE_TOKEN_MAX = 2_147_483_647;

export const AI_TEXT_TOOL_ACCESS = 'DISABLED' as const;

export type AiGenerationSafetyErrorCode =
  'INVALID_INPUT' | 'PERMISSION_DENIED' | 'SENSITIVE_DATA' | 'INVALID_OUTPUT';

export class AiGenerationSafetyError extends Error {
  constructor(
    readonly code: AiGenerationSafetyErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AiGenerationSafetyError';
  }
}

export interface AiGenerationSafetyRequest {
  readonly actorId: ResourceId;
  readonly input: string;
  readonly instructions?: string;
  readonly task: string;
  readonly sourceContext?: GenerationSourceContext;
}

const TASK_PATTERN = /^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/;

const DISALLOWED_SENSITIVE_PATTERNS: readonly RegExp[] = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/i,
  /\bBearer\s+[A-Za-z0-9._~+/=-]{20,}\b/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\b(?:api[_ -]?key|access[_ -]?token|password|secret)\s*[:=]\s*\S{8,}/i,
];

function fail(code: AiGenerationSafetyErrorCode, message: string): never {
  throw new AiGenerationSafetyError(code, message);
}

function assertTextLength(
  value: string,
  field: string,
  maximum: number,
  allowBlank: boolean,
): void {
  if (value.includes('\u0000')) {
    fail('INVALID_INPUT', `${field} must not contain NUL characters.`);
  }

  if (!allowBlank && value.trim().length === 0) {
    fail('INVALID_INPUT', `${field} must not be blank.`);
  }

  if (value.length > maximum) {
    fail('INVALID_INPUT', `${field} exceeds the maximum supported length.`);
  }
}

function containsDisallowedSensitiveData(value: string): boolean {
  return DISALLOWED_SENSITIVE_PATTERNS.some((pattern) => pattern.test(value));
}

function assertSourceContext(context: GenerationSourceContext | undefined): void {
  if (!context) {
    return;
  }

  if (context.knowledgeResources.length > AI_TEXT_SOURCE_CONTEXT_MAX_RESOURCES) {
    fail('INVALID_INPUT', 'AI source context exceeds the supported Resource limit.');
  }

  const seen = new Set<string>();

  for (const resource of context.knowledgeResources) {
    if (resource.universeKey !== context.universeKey) {
      fail('INVALID_INPUT', 'AI source context contains a cross-Universe Resource.');
    }

    if (seen.has(resource.id)) {
      fail('INVALID_INPUT', 'AI source context contains duplicate Knowledge Resources.');
    }

    seen.add(resource.id);
  }
}

export class AiGenerationSafety {
  constructor(private readonly permissions: PermissionEvaluationReader) {}

  async assertRequestAllowed(input: AiGenerationSafetyRequest): Promise<void> {
    assertTextLength(input.input, 'AI input', AI_TEXT_INPUT_MAX_LENGTH, false);

    if (input.instructions !== undefined) {
      assertTextLength(
        input.instructions,
        'AI instructions',
        AI_TEXT_INSTRUCTIONS_MAX_LENGTH,
        true,
      );
    }

    if (
      input.task.length === 0 ||
      input.task.length > AI_TEXT_TASK_MAX_LENGTH ||
      !TASK_PATTERN.test(input.task)
    ) {
      fail('INVALID_INPUT', 'AI task must be a bounded namespaced task identifier.');
    }

    assertSourceContext(input.sourceContext);

    const sensitiveValues = [
      input.input,
      ...(input.instructions === undefined ? [] : [input.instructions]),
    ];

    if (sensitiveValues.some(containsDisallowedSensitiveData)) {
      fail(
        'SENSITIVE_DATA',
        'AI request contains credential-like sensitive data that must not be sent to a Provider.',
      );
    }

    const permitted = await this.permissions.hasPermission({
      actorId: input.actorId,
      permissionKey: AI_GENERATE_PERMISSION_KEY,
    });

    if (!permitted) {
      fail('PERMISSION_DENIED', 'Actor is not permitted to execute AI generation.');
    }
  }

  createProviderRequest(input: {
    readonly input: string;
    readonly instructions?: string;
  }): AiProviderTextRequest {
    return {
      input: input.input,
      ...(input.instructions === undefined ? {} : { instructions: input.instructions }),
    };
  }

  assertProviderResult(result: unknown): asserts result is AiProviderTextResult {
    if (
      typeof result !== 'object' ||
      result === null ||
      !('text' in result) ||
      !('model' in result)
    ) {
      fail('INVALID_OUTPUT', 'AI Provider returned an invalid text-generation result.');
    }

    const candidate = result as {
      readonly text?: unknown;
      readonly model?: unknown;
      readonly usage?: unknown;
    };

    if (
      typeof candidate.text !== 'string' ||
      candidate.text.trim().length === 0 ||
      candidate.text.length > AI_TEXT_OUTPUT_MAX_LENGTH
    ) {
      fail('INVALID_OUTPUT', 'AI Provider returned invalid generated text.');
    }

    if (
      typeof candidate.model !== 'string' ||
      candidate.model.trim().length === 0 ||
      candidate.model.length > AI_TEXT_MODEL_MAX_LENGTH
    ) {
      fail('INVALID_OUTPUT', 'AI Provider returned an invalid model identifier.');
    }

    if (candidate.usage !== undefined) {
      if (typeof candidate.usage !== 'object' || candidate.usage === null) {
        fail('INVALID_OUTPUT', 'AI Provider returned invalid usage metadata.');
      }

      const usage = candidate.usage as {
        readonly inputTokens?: unknown;
        readonly outputTokens?: unknown;
        readonly totalTokens?: unknown;
      };

      for (const value of [usage.inputTokens, usage.outputTokens, usage.totalTokens]) {
        if (
          typeof value !== 'number' ||
          !Number.isSafeInteger(value) ||
          value < 0 ||
          value > AI_USAGE_TOKEN_MAX
        ) {
          fail('INVALID_OUTPUT', 'AI Provider returned invalid token usage.');
        }
      }
    }
  }
}
