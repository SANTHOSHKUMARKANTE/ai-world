import { parseResourceId, type ResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  EvaluatePermission,
  type EvaluateActorPermissionInput,
  type PermissionEvaluationReader,
} from '@ai-world/platform-identity-access';
import { describe, expect, it } from 'vitest';

import { GetKnowledgeResourceMedia } from '../src/get-knowledge-resource-media';
import { GetKnowledgeResourceMediaAsActor } from '../src/get-knowledge-resource-media-as-actor';
import { KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY } from '../src/knowledge-authorization-policy';
import type { KnowledgeResource } from '../src/knowledge-resource';
import type { KnowledgeResourceMediaPlacement } from '../src/knowledge-resource-media-placement';
import type {
  KnowledgeResourceMediaPlacementReader,
  ListKnowledgeResourceMediaPlacementsInput,
} from '../src/knowledge-resource-media-placement-reader';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from '../src/knowledge-resource-reader';

const RESOURCE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const ASSET_ID = parseResourceId('22222222-2222-4222-8222-222222222222');

function resource(): KnowledgeResource {
  const now = new Date('2026-08-23T00:00:00.000Z');
  return {
    id: RESOURCE_ID,
    universeKey: parseNamespacedKey('universe.anime'),
    resourceType: parseNamespacedKey('anime.character'),
    lifecycle: 'DRAFT',
    createdAt: now,
    updatedAt: now,
  };
}

const PLACEMENTS: readonly KnowledgeResourceMediaPlacement[] = [
  {
    assetId: ASSET_ID,
    role: 'HERO',
    playback: 'STILL',
    position: 0,
    altText: 'Naruto hero',
    caption: null,
    posterAssetId: null,
  },
];

class RecordingResourceReader implements KnowledgeResourceReader {
  public readonly ids: ResourceId[] = [];

  public constructor(private readonly value: KnowledgeResource | null) {}

  public async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    this.ids.push(input.id);
    return this.value;
  }
}

class RecordingPlacementReader implements KnowledgeResourceMediaPlacementReader {
  public readonly inputs: ListKnowledgeResourceMediaPlacementsInput[] = [];

  public async listMediaPlacements(
    input: ListKnowledgeResourceMediaPlacementsInput,
  ): Promise<readonly KnowledgeResourceMediaPlacement[]> {
    this.inputs.push(input);
    return PLACEMENTS;
  }
}

class FakePermissionReader implements PermissionEvaluationReader {
  public readonly inputs: EvaluateActorPermissionInput[] = [];

  public constructor(private readonly allowed: boolean) {}

  public async hasPermission(input: EvaluateActorPermissionInput): Promise<boolean> {
    this.inputs.push(input);
    return this.allowed;
  }
}

describe('GetKnowledgeResourceMedia', () => {
  it('returns ordered creator placements only after the Knowledge Resource exists', async () => {
    const resources = new RecordingResourceReader(resource());
    const placements = new RecordingPlacementReader();
    const get = new GetKnowledgeResourceMedia(resources, placements);

    await expect(get.execute({ id: RESOURCE_ID })).resolves.toEqual(PLACEMENTS);
    expect(resources.ids).toEqual([RESOURCE_ID]);
    expect(placements.inputs).toEqual([{ knowledgeResourceId: RESOURCE_ID }]);
  });

  it('preserves canonical not-found behavior without reading placement state', async () => {
    const placements = new RecordingPlacementReader();
    const get = new GetKnowledgeResourceMedia(new RecordingResourceReader(null), placements);

    await expect(get.execute({ id: RESOURCE_ID })).rejects.toMatchObject({
      code: 'knowledge.resource.not_found',
      kind: 'not_found',
    });
    expect(placements.inputs).toEqual([]);
  });
});

describe('GetKnowledgeResourceMediaAsActor', () => {
  it('uses the accepted Knowledge update permission for creator media management', async () => {
    const permission = new FakePermissionReader(true);
    const placements = new RecordingPlacementReader();
    const useCase = new GetKnowledgeResourceMediaAsActor(
      new EvaluatePermission(permission),
      new GetKnowledgeResourceMedia(new RecordingResourceReader(resource()), placements),
    );

    await expect(
      useCase.execute({
        actingActorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        id: RESOURCE_ID,
      }),
    ).resolves.toEqual(PLACEMENTS);

    expect(permission.inputs).toEqual([
      {
        actorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        permissionKey: KNOWLEDGE_RESOURCE_UPDATE_PERMISSION_KEY,
      },
    ]);
  });

  it('denies before Resource ID validation or placement access', async () => {
    const permission = new FakePermissionReader(false);
    const placements = new RecordingPlacementReader();
    const useCase = new GetKnowledgeResourceMediaAsActor(
      new EvaluatePermission(permission),
      new GetKnowledgeResourceMedia(new RecordingResourceReader(resource()), placements),
    );

    await expect(
      useCase.execute({
        actingActorId: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.authorization.forbidden',
      kind: 'forbidden',
    });
    expect(placements.inputs).toEqual([]);
  });

  it('returns controlled Resource ID validation after authorization succeeds', async () => {
    const useCase = new GetKnowledgeResourceMediaAsActor(
      new EvaluatePermission(new FakePermissionReader(true)),
      new GetKnowledgeResourceMedia(
        new RecordingResourceReader(resource()),
        new RecordingPlacementReader(),
      ),
    );

    await expect(
      useCase.execute({
        actingActorId: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
        id: 'not-a-resource-id',
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.resource.invalid_input',
      kind: 'validation',
      publicMessage: 'The Knowledge Resource input is invalid.',
    });
  });
});
