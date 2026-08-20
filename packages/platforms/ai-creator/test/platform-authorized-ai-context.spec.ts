import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  type PublicKnowledgeResourceReader,
} from '@ai-world/platform-knowledge';
import type { SearchContract } from '@ai-world/platform-discovery';
import type { UserProfileReader } from '@ai-world/platform-user';
import { describe, expect, it } from 'vitest';

import { AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT, AUTHORIZED_AI_CONTEXT_MAX_LIMIT } from '../src';
import { PlatformAuthorizedAiContext } from '../src/infrastructure';

describe('PlatformAuthorizedAiContext', () => {
  it('uses actor-scoped User, universe-scoped Discovery, and published Knowledge contracts', async () => {
    const actorId = generateResourceId();
    const userId = generateResourceId();
    const resourceId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');
    const resourceType = parseNamespacedKey('context.temple');

    const users: UserProfileReader = {
      async findByActorId(input) {
        expect(input).toEqual({ actorId });

        return {
          id: userId,
          actorId,
          displayName: 'Creator',
          createdAt: new Date('2026-08-20T00:00:00.000Z'),
          updatedAt: new Date('2026-08-20T00:00:00.000Z'),
        };
      },
    };

    const discovery: SearchContract = {
      async search(input) {
        expect(input).toEqual({
          query: 'temple',
          scope: {
            kind: 'universe',
            universeKey,
          },
          filter: {
            resourceTypes: [resourceType],
          },
          pagination: {
            offset: 0,
            limit: AUTHORIZED_AI_CONTEXT_DEFAULT_LIMIT,
          },
        });

        return {
          items: [
            {
              resourceId,
              resourceType,
              universeKey,
            },
          ],
          pagination: input.pagination,
        };
      },
    };

    const knowledge: PublicKnowledgeResourceReader = {
      async findPublishedById(input) {
        expect(input).toEqual({ id: resourceId });

        return {
          id: resourceId,
          universeKey,
          resourceType,
          lifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
          createdAt: new Date('2026-08-20T00:00:00.000Z'),
          updatedAt: new Date('2026-08-20T00:00:00.000Z'),
        };
      },
      async listPublished() {
        throw new Error('listPublished is not part of the P7-M05 slice.');
      },
    };

    const context = new PlatformAuthorizedAiContext(users, discovery, knowledge);

    await expect(
      context.resolve({
        actorId,
        universeKey,
        query: 'temple',
        resourceTypes: [resourceType],
      }),
    ).resolves.toEqual({
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
    });
  });

  it('fails closed when Discovery returns a Resource outside the requested Universe', async () => {
    const actorId = generateResourceId();
    const userId = generateResourceId();
    const resourceId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');
    const otherUniverseKey = parseNamespacedKey('context.test-beta');
    const resourceType = parseNamespacedKey('context.temple');
    let knowledgeCalled = false;

    const users: UserProfileReader = {
      async findByActorId() {
        return {
          id: userId,
          actorId,
          displayName: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    };

    const discovery: SearchContract = {
      async search(input) {
        return {
          items: [
            {
              resourceId,
              resourceType,
              universeKey: otherUniverseKey,
            },
          ],
          pagination: input.pagination,
        };
      },
    };

    const knowledge: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        knowledgeCalled = true;
        return null;
      },
      async listPublished() {
        return [];
      },
    };

    const context = new PlatformAuthorizedAiContext(users, discovery, knowledge);

    await expect(
      context.resolve({
        actorId,
        universeKey,
        query: 'temple',
      }),
    ).rejects.toThrow('Discovery returned Knowledge outside the authorized Universe scope.');

    expect(knowledgeCalled).toBe(false);
  });

  it('fails before Discovery when the requesting User cannot be resolved', async () => {
    const actorId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');
    let discoveryCalled = false;

    const users: UserProfileReader = {
      async findByActorId() {
        return null;
      },
    };

    const discovery: SearchContract = {
      async search(input) {
        discoveryCalled = true;
        return {
          items: [],
          pagination: input.pagination,
        };
      },
    };

    const knowledge: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        return null;
      },
      async listPublished() {
        return [];
      },
    };

    const context = new PlatformAuthorizedAiContext(users, discovery, knowledge);

    await expect(
      context.resolve({
        actorId,
        universeKey,
        query: 'temple',
      }),
    ).rejects.toThrow('Authorized AI context could not resolve the requesting User.');

    expect(discoveryCalled).toBe(false);
  });

  it('rejects context limits above the bounded maximum', async () => {
    const actorId = generateResourceId();
    const userId = generateResourceId();
    const universeKey = parseNamespacedKey('context.test-alpha');

    const users: UserProfileReader = {
      async findByActorId() {
        return {
          id: userId,
          actorId,
          displayName: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      },
    };

    const discovery: SearchContract = {
      async search() {
        throw new Error('search should not execute for an invalid context limit.');
      },
    };

    const knowledge: PublicKnowledgeResourceReader = {
      async findPublishedById() {
        return null;
      },
      async listPublished() {
        return [];
      },
    };

    const context = new PlatformAuthorizedAiContext(users, discovery, knowledge);

    await expect(
      context.resolve({
        actorId,
        universeKey,
        query: 'temple',
        limit: AUTHORIZED_AI_CONTEXT_MAX_LIMIT + 1,
      }),
    ).rejects.toThrow(
      `Authorized AI context limit must be an integer between 1 and ${AUTHORIZED_AI_CONTEXT_MAX_LIMIT}.`,
    );
  });
});
