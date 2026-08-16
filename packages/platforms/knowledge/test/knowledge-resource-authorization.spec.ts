import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  EvaluatePermission,
  KNOWLEDGE_EDITOR_ROLE_KEY,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
} from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
  KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
  UpdateKnowledgeResource,
  UpdateKnowledgeResourceAsActor,
  type CreateKnowledgeResourceRecordInput,
  type KnowledgeResource,
  type KnowledgeResourceWriter,
  type UpdateKnowledgeResourceTypeRecordInput,
} from '../src';

const EDITOR_ACTOR_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ORDINARY_ACTOR_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const createdAt = new Date('2026-08-15T12:30:00.000Z');
const updatedAt = new Date('2026-08-15T12:30:00.000Z');

class FakePermissionEvaluationReader implements PermissionEvaluationReader {
  readonly inputs: EvaluateActorPermissionInput[] = [];

  constructor(private readonly allowed: boolean) {}

  async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    this.inputs.push(input);
    return this.allowed;
  }
}

class FakeKnowledgeWriter implements KnowledgeResourceWriter {
  readonly creates: CreateKnowledgeResourceRecordInput[] = [];
  readonly updates: UpdateKnowledgeResourceTypeRecordInput[] = [];

  constructor(private readonly updateResult: KnowledgeResource | null = null) {}

  async create(input: CreateKnowledgeResourceRecordInput): Promise<KnowledgeResource> {
    this.creates.push(input);

    return {
      ...input,
      createdAt,
      updatedAt,
    };
  }

  async updateResourceType(
    input: UpdateKnowledgeResourceTypeRecordInput,
  ): Promise<KnowledgeResource | null> {
    this.updates.push(input);

    if (this.updateResult === null) {
      return null;
    }

    return {
      ...this.updateResult,
      resourceType: input.resourceType,
      updatedAt: new Date('2026-08-15T12:31:00.000Z'),
    };
  }
}

function makeResource(): KnowledgeResource {
  return {
    id: generateResourceId(),
    universeKey: parseNamespacedKey('knowledge.authorization-test'),
    resourceType: parseNamespacedKey('knowledge.authorization-resource'),
    lifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
    createdAt,
    updatedAt,
  };
}

describe('Knowledge Resource authorization', () => {
  it('defines the minimal capability-scoped authorization vocabulary', () => {
    expect(KNOWLEDGE_EDITOR_ROLE_KEY).toBe('knowledge-editor');
    expect(KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY).toBe('knowledge.resource.create');
    expect(KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY).toBe('knowledge.resource.update');
  });

  it('allows authorized creation through the canonical Knowledge owner operation', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const writer = new FakeKnowledgeWriter();

    const createAsActor = new CreateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new CreateKnowledgeResource(writer),
    );

    const created = await createAsActor.execute({
      actingActorId: EDITOR_ACTOR_ID,
      universeKey: parseNamespacedKey('knowledge.authorization-test'),
      resourceType: parseNamespacedKey('knowledge.authorization-resource'),
    });

    expect(permissionReader.inputs).toEqual([
      {
        actorId: EDITOR_ACTOR_ID,
        permissionKey: KNOWLEDGE_RESOURCE_CREATE_PERMISSION_KEY,
      },
    ]);
    expect(writer.creates).toHaveLength(1);
    expect(created.lifecycle).toBe('DRAFT');
  });

  it('denies creation before canonical input validation or persistence', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const writer = new FakeKnowledgeWriter();

    const createAsActor = new CreateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new CreateKnowledgeResource(writer),
    );

    await expect(
      createAsActor.execute({
        actingActorId: ORDINARY_ACTOR_ID,
        universeKey: 'INVALID UNIVERSE' as string,
        resourceType: 'INVALID TYPE' as string,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to perform this action.',
    });

    expect(writer.creates).toEqual([]);
  });

  it('returns controlled validation after authorized creation reaches canonical validation', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const writer = new FakeKnowledgeWriter();

    const createAsActor = new CreateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new CreateKnowledgeResource(writer),
    );

    await expect(
      createAsActor.execute({
        actingActorId: EDITOR_ACTOR_ID,
        universeKey: 'INVALID UNIVERSE' as string,
        resourceType: parseNamespacedKey('knowledge.authorization-resource'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.invalid_input',
      kind: 'validation',
      publicMessage: 'The Knowledge Resource input is invalid.',
    });

    expect(permissionReader.inputs).toHaveLength(1);
    expect(writer.creates).toEqual([]);
  });

  it('allows authorized update through the canonical Knowledge owner operation', async () => {
    const existing = makeResource();
    const permissionReader = new FakePermissionEvaluationReader(true);
    const writer = new FakeKnowledgeWriter(existing);

    const updateAsActor = new UpdateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new UpdateKnowledgeResource(writer),
    );

    const updated = await updateAsActor.execute({
      actingActorId: EDITOR_ACTOR_ID,
      id: existing.id,
      resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
    });

    expect(permissionReader.inputs).toEqual([
      {
        actorId: EDITOR_ACTOR_ID,
        permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
      },
    ]);
    expect(writer.updates).toEqual([
      {
        id: existing.id,
        resourceType: 'knowledge.authorization-resource-updated',
      },
    ]);
    expect(updated.resourceType).toBe('knowledge.authorization-resource-updated');
  });

  it('denies update before Resource validation or persistence', async () => {
    const permissionReader = new FakePermissionEvaluationReader(false);
    const writer = new FakeKnowledgeWriter();

    const updateAsActor = new UpdateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new UpdateKnowledgeResource(writer),
    );

    await expect(
      updateAsActor.execute({
        actingActorId: ORDINARY_ACTOR_ID,
        id: 'not-a-resource-id',
        resourceType: 'INVALID TYPE' as string,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    expect(writer.updates).toEqual([]);
  });

  it('returns controlled validation after authorized update reaches canonical validation', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const writer = new FakeKnowledgeWriter();

    const updateAsActor = new UpdateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new UpdateKnowledgeResource(writer),
    );

    await expect(
      updateAsActor.execute({
        actingActorId: EDITOR_ACTOR_ID,
        id: 'not-a-resource-id',
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.invalid_input',
      kind: 'validation',
      publicMessage: 'The Knowledge Resource input is invalid.',
    });

    expect(permissionReader.inputs).toHaveLength(1);
    expect(writer.updates).toEqual([]);
  });

  it('does not reclassify a downstream creation TypeError as invalid client input', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const downstreamFailure = new TypeError('simulated downstream Knowledge writer failure');

    const writer: KnowledgeResourceWriter = {
      async create() {
        throw downstreamFailure;
      },

      async updateResourceType() {
        return null;
      },
    };

    const createAsActor = new CreateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new CreateKnowledgeResource(writer),
    );

    await expect(
      createAsActor.execute({
        actingActorId: EDITOR_ACTOR_ID,
        universeKey: parseNamespacedKey('knowledge.authorization-test'),
        resourceType: parseNamespacedKey('knowledge.authorization-resource'),
      }),
    ).rejects.toBe(downstreamFailure);
  });

  it('does not reclassify a downstream update TypeError as invalid client input', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const downstreamFailure = new TypeError('simulated downstream Knowledge writer failure');

    const writer: KnowledgeResourceWriter = {
      async create(input) {
        return {
          ...input,
          createdAt,
          updatedAt,
        };
      },

      async updateResourceType() {
        throw downstreamFailure;
      },
    };

    const updateAsActor = new UpdateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new UpdateKnowledgeResource(writer),
    );

    await expect(
      updateAsActor.execute({
        actingActorId: EDITOR_ACTOR_ID,
        id: generateResourceId(),
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toBe(downstreamFailure);
  });

  it('preserves canonical not-found behavior after authorization succeeds', async () => {
    const permissionReader = new FakePermissionEvaluationReader(true);
    const writer = new FakeKnowledgeWriter();

    const updateAsActor = new UpdateKnowledgeResourceAsActor(
      new EvaluatePermission(permissionReader),
      new UpdateKnowledgeResource(writer),
    );

    await expect(
      updateAsActor.execute({
        actingActorId: EDITOR_ACTOR_ID,
        id: generateResourceId(),
        resourceType: parseNamespacedKey('knowledge.authorization-resource-updated'),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });

    expect(writer.updates).toHaveLength(1);
  });
});
