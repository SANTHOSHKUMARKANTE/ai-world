import { generateResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  EvaluatePermission,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
} from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import {
  ArchiveKnowledgeResource,
  ArchiveKnowledgeResourceAsActor,
  KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
  KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
  KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
  KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
  PublishKnowledgeResource,
  PublishKnowledgeResourceAsActor,
  type FindKnowledgeResourceByIdInput,
  type KnowledgeResource,
  type KnowledgeResourceLifecycleWriter,
  type KnowledgeResourceReader,
  type TransitionKnowledgeResourceLifecycleRecordInput,
} from '../src';

const EDITOR_ACTOR_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const ORDINARY_ACTOR_ID = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb';

const createdAt = new Date('2026-08-15T16:10:00.000Z');
const updatedAt = new Date('2026-08-15T16:10:00.000Z');

function makeResource(
  lifecycle: KnowledgeResource['lifecycle'] = KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
): KnowledgeResource {
  return {
    id: generateResourceId(),
    universeKey: parseNamespacedKey('knowledge.lifecycle-test'),
    resourceType: parseNamespacedKey('knowledge.lifecycle-resource'),
    lifecycle,
    createdAt,
    updatedAt,
  };
}

class FakeLifecycleRepository implements KnowledgeResourceReader, KnowledgeResourceLifecycleWriter {
  readonly transitions: TransitionKnowledgeResourceLifecycleRecordInput[] = [];

  constructor(private resource: KnowledgeResource | null) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    return this.resource?.id === input.id ? this.resource : null;
  }

  async transitionLifecycle(
    input: TransitionKnowledgeResourceLifecycleRecordInput,
  ): Promise<KnowledgeResource | null> {
    this.transitions.push(input);

    if (
      !this.resource ||
      this.resource.id !== input.id ||
      this.resource.lifecycle !== input.fromLifecycle
    ) {
      return null;
    }

    this.resource = {
      ...this.resource,
      lifecycle: input.toLifecycle,
      updatedAt: new Date('2026-08-15T16:11:00.000Z'),
    };

    return this.resource;
  }
}

class FakePermissionEvaluationReader implements PermissionEvaluationReader {
  readonly inputs: EvaluateActorPermissionInput[] = [];

  constructor(private readonly allowed: boolean) {}

  async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    this.inputs.push(input);
    return this.allowed;
  }
}

describe('Knowledge Resource lifecycle', () => {
  it('publishes only from DRAFT', async () => {
    const draft = makeResource();
    const repository = new FakeLifecycleRepository(draft);
    const publish = new PublishKnowledgeResource(repository, repository);

    const published = await publish.execute({ id: draft.id });

    expect(published.lifecycle).toBe(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);
    expect(repository.transitions).toEqual([
      {
        id: draft.id,
        fromLifecycle: KNOWLEDGE_RESOURCE_INITIAL_LIFECYCLE,
        toLifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
      },
    ]);
  });

  it('rejects publication from a non-DRAFT lifecycle', async () => {
    const published = makeResource(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);
    const repository = new FakeLifecycleRepository(published);
    const publish = new PublishKnowledgeResource(repository, repository);

    await expect(publish.execute({ id: published.id })).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
      publicMessage: 'Knowledge Resource lifecycle transition is not allowed.',
    });

    expect(repository.transitions).toHaveLength(1);
  });

  it('archives only from PUBLISHED', async () => {
    const published = makeResource(KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE);
    const repository = new FakeLifecycleRepository(published);
    const archive = new ArchiveKnowledgeResource(repository, repository);

    const archived = await archive.execute({ id: published.id });

    expect(archived.lifecycle).toBe(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);
    expect(repository.transitions).toEqual([
      {
        id: published.id,
        fromLifecycle: KNOWLEDGE_RESOURCE_PUBLISHED_LIFECYCLE,
        toLifecycle: KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE,
      },
    ]);
  });

  it('rejects archival directly from DRAFT', async () => {
    const draft = makeResource();
    const repository = new FakeLifecycleRepository(draft);
    const archive = new ArchiveKnowledgeResource(repository, repository);

    await expect(archive.execute({ id: draft.id })).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });
  });

  it('preserves canonical not-found semantics for missing lifecycle targets', async () => {
    const repository = new FakeLifecycleRepository(null);

    await expect(
      new PublishKnowledgeResource(repository, repository).execute({
        id: generateResourceId(),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });

    await expect(
      new ArchiveKnowledgeResource(repository, repository).execute({
        id: generateResourceId(),
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });
  });

  it('uses distinct Knowledge publish and archive Permission actions', async () => {
    const draft = makeResource();
    const repository = new FakeLifecycleRepository(draft);
    const permissionReader = new FakePermissionEvaluationReader(true);
    const evaluatePermission = new EvaluatePermission(permissionReader);

    const publishAsActor = new PublishKnowledgeResourceAsActor(
      evaluatePermission,
      new PublishKnowledgeResource(repository, repository),
    );

    const published = await publishAsActor.execute({
      actingActorId: EDITOR_ACTOR_ID,
      id: draft.id,
    });

    const archiveAsActor = new ArchiveKnowledgeResourceAsActor(
      evaluatePermission,
      new ArchiveKnowledgeResource(repository, repository),
    );

    await archiveAsActor.execute({
      actingActorId: EDITOR_ACTOR_ID,
      id: published.id,
    });

    expect(permissionReader.inputs).toEqual([
      {
        actorId: EDITOR_ACTOR_ID,
        permissionKey: KNOWLEDGE_RESOURCE_PUBLISH_PERMISSION_KEY,
      },
      {
        actorId: EDITOR_ACTOR_ID,
        permissionKey: KNOWLEDGE_RESOURCE_ARCHIVE_PERMISSION_KEY,
      },
    ]);
  });

  it('denies lifecycle mutation before Resource ID parsing, lookup, or persistence', async () => {
    const repository = new FakeLifecycleRepository(null);
    const permissionReader = new FakePermissionEvaluationReader(false);
    const evaluatePermission = new EvaluatePermission(permissionReader);

    const publishAsActor = new PublishKnowledgeResourceAsActor(
      evaluatePermission,
      new PublishKnowledgeResource(repository, repository),
    );

    await expect(
      publishAsActor.execute({
        actingActorId: ORDINARY_ACTOR_ID,
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
      publicMessage: 'You do not have permission to perform this action.',
    });

    const archiveAsActor = new ArchiveKnowledgeResourceAsActor(
      evaluatePermission,
      new ArchiveKnowledgeResource(repository, repository),
    );

    await expect(
      archiveAsActor.execute({
        actingActorId: ORDINARY_ACTOR_ID,
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });

    expect(repository.transitions).toEqual([]);
  });

  it('does not add reverse lifecycle transitions', async () => {
    const archived = makeResource(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);
    const repository = new FakeLifecycleRepository(archived);

    await expect(
      new PublishKnowledgeResource(repository, repository).execute({
        id: archived.id,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });

    await expect(
      new ArchiveKnowledgeResource(repository, repository).execute({
        id: archived.id,
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.lifecycle_conflict',
      kind: 'conflict',
    });

    expect(archived.lifecycle).toBe(KNOWLEDGE_RESOURCE_ARCHIVED_LIFECYCLE);
  });
});
