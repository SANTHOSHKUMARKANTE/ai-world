import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  AI_SEARCH_KNOWLEDGE_TOOL_EFFECT,
  AI_SEARCH_KNOWLEDGE_TOOL_MAX_LIMIT,
  AI_SEARCH_KNOWLEDGE_TOOL_MAX_RESOURCE_TYPES,
  AI_SEARCH_KNOWLEDGE_TOOL_NAME,
  AI_SEARCH_KNOWLEDGE_TOOL_QUERY_MAX_LENGTH,
  SearchKnowledgeTool,
  type AuthorizedAiContext,
  type ResolveAuthorizedAiContextInput,
} from '../src';

describe('SearchKnowledgeTool', () => {
  it('executes an explicit typed read-only Tool through authorized context', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('tool.search-test');
    const resourceType = parseNamespacedKey('tool.temple');
    const resourceId = generateResourceId();
    const calls: ResolveAuthorizedAiContextInput[] = [];

    const tool = new SearchKnowledgeTool({
      async resolve(input) {
        calls.push(input);

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
    });

    const result = await tool.execute({
      actorId,
      universeKey,
      query: '  temple  ',
      resourceTypes: [resourceType],
      limit: 3,
    });

    expect(tool.name).toBe(AI_SEARCH_KNOWLEDGE_TOOL_NAME);
    expect(calls).toEqual([
      {
        actorId,
        universeKey,
        query: 'temple',
        resourceTypes: [resourceType],
        limit: 3,
      },
    ]);
    expect(result).toEqual({
      toolName: AI_SEARCH_KNOWLEDGE_TOOL_NAME,
      effect: AI_SEARCH_KNOWLEDGE_TOOL_EFFECT,
      items: [
        {
          resourceId,
          resourceType,
          universeKey,
        },
      ],
    });
  });

  it('rejects invalid bounded Tool input before authorized execution', async () => {
    let calls = 0;
    const tool = new SearchKnowledgeTool({
      async resolve(): Promise<AuthorizedAiContext> {
        calls += 1;
        throw new Error('must not execute');
      },
    });

    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('tool.search-test');
    const resourceType = parseNamespacedKey('tool.temple');

    const invalidInputs = [
      {
        actorId,
        universeKey,
        query: '   ',
      },
      {
        actorId,
        universeKey,
        query: 'x'.repeat(AI_SEARCH_KNOWLEDGE_TOOL_QUERY_MAX_LENGTH + 1),
      },
      {
        actorId,
        universeKey,
        query: 'temple',
        limit: AI_SEARCH_KNOWLEDGE_TOOL_MAX_LIMIT + 1,
      },
      {
        actorId,
        universeKey,
        query: 'temple',
        resourceTypes: [resourceType, resourceType],
      },
      {
        actorId,
        universeKey,
        query: 'temple',
        resourceTypes: Array.from(
          { length: AI_SEARCH_KNOWLEDGE_TOOL_MAX_RESOURCE_TYPES + 1 },
          (_, index) => parseNamespacedKey(`tool.type-${index}`),
        ),
      },
    ] as const;

    for (const input of invalidInputs) {
      await expect(tool.execute(input)).rejects.toMatchObject({
        name: 'SearchKnowledgeToolError',
        code: 'INVALID_INPUT',
      });
    }

    expect(calls).toBe(0);
  });

  it('fails closed when authorized context returns a cross-Universe Resource', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('tool.search-test');

    const tool = new SearchKnowledgeTool({
      async resolve() {
        return {
          actorId,
          userDisplayName: 'Creator',
          universeKey,
          knowledgeResources: [
            {
              id: generateResourceId(),
              resourceType: parseNamespacedKey('tool.temple'),
              universeKey: parseNamespacedKey('tool.other-universe'),
            },
          ],
        };
      },
    });

    await expect(
      tool.execute({
        actorId,
        universeKey,
        query: 'temple',
      }),
    ).rejects.toMatchObject({
      name: 'SearchKnowledgeToolError',
      code: 'INVALID_AUTHORIZED_RESULT',
    });
  });

  it('fails closed when authorized context exceeds the explicit Tool limit', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('tool.search-test');

    const tool = new SearchKnowledgeTool({
      async resolve() {
        return {
          actorId,
          userDisplayName: 'Creator',
          universeKey,
          knowledgeResources: [
            {
              id: generateResourceId(),
              resourceType: parseNamespacedKey('tool.temple'),
              universeKey,
            },
            {
              id: generateResourceId(),
              resourceType: parseNamespacedKey('tool.temple'),
              universeKey,
            },
          ],
        };
      },
    });

    await expect(
      tool.execute({
        actorId,
        universeKey,
        query: 'temple',
        limit: 1,
      }),
    ).rejects.toMatchObject({
      code: 'INVALID_AUTHORIZED_RESULT',
    });
  });
});
