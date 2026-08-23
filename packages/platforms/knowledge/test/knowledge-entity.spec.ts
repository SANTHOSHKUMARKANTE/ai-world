import type { ResourceId } from '@ai-world/kernel-identifiers';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import { ConfigureKnowledgeEntity } from '../src/configure-knowledge-entity';
import { GetPublicKnowledgeEntity } from '../src/get-public-knowledge-entity';
import type { KnowledgeEntityProfile, PublicKnowledgeEntity } from '../src/knowledge-entity';
import type {
  KnowledgeEntityStore,
  ReplaceKnowledgeEntityConfigurationInput,
} from '../src/knowledge-entity-store';
import type { KnowledgeResource } from '../src/knowledge-resource';
import type {
  FindKnowledgeResourceByIdInput,
  KnowledgeResourceReader,
} from '../src/knowledge-resource-reader';

const SHIVA_ID = parseResourceId('11111111-1111-4111-8111-111111111111');
const PARVATI_ID = parseResourceId('22222222-2222-4222-8222-222222222222');

function resource(
  id: ResourceId,
  lifecycle: KnowledgeResource['lifecycle'] = 'DRAFT',
): KnowledgeResource {
  return {
    id,
    universeKey: parseNamespacedKey('universe.devotional'),
    resourceType: parseNamespacedKey('devotional.deity'),
    lifecycle,
    createdAt: new Date('2026-08-23T00:00:00.000Z'),
    updatedAt: new Date('2026-08-23T00:00:00.000Z'),
  };
}

class MemoryResources implements KnowledgeResourceReader {
  public constructor(private readonly resources: Map<ResourceId, KnowledgeResource>) {}

  async findById(input: FindKnowledgeResourceByIdInput): Promise<KnowledgeResource | null> {
    return this.resources.get(input.id) ?? null;
  }
}

class MemoryEntities implements KnowledgeEntityStore {
  public routeOwner: ResourceId | null = null;
  public publicEntity: PublicKnowledgeEntity | null = null;
  public lastConfiguration: ReplaceKnowledgeEntityConfigurationInput | null = null;

  async findRouteOwner(): Promise<ResourceId | null> {
    return this.routeOwner;
  }

  async replaceConfiguration(
    input: ReplaceKnowledgeEntityConfigurationInput,
  ): Promise<KnowledgeEntityProfile> {
    this.lastConfiguration = input;
    return {
      knowledgeResourceId: input.knowledgeResourceId,
      routeKey: input.routeKey,
      slug: input.slug,
      displayName: input.displayName,
      summary: input.summary,
      facts: input.facts,
      createdAt: new Date('2026-08-23T00:00:00.000Z'),
      updatedAt: new Date('2026-08-23T00:00:00.000Z'),
    };
  }

  async findPublishedByRouteKey(): Promise<PublicKnowledgeEntity | null> {
    return this.publicEntity;
  }
}

describe('Knowledge Entity', () => {
  it('configures a reusable entity profile and typed relationships', async () => {
    const entities = new MemoryEntities();
    const useCase = new ConfigureKnowledgeEntity(
      new MemoryResources(
        new Map([
          [SHIVA_ID, resource(SHIVA_ID)],
          [PARVATI_ID, resource(PARVATI_ID)],
        ]),
      ),
      entities,
    );

    const profile = await useCase.execute({
      id: SHIVA_ID,
      profile: {
        slug: 'shiva',
        displayName: 'Lord Shiva',
        summary: 'The Supreme Yogi and a central deity of the Devotional Universe.',
        facts: [
          {
            key: 'devotional.mantra',
            label: 'Mantra',
            value: 'Om Namah Shivaya',
          },
        ],
      },
      relations: [
        {
          targetResourceId: PARVATI_ID,
          sectionKey: 'entity.family',
          relationshipType: 'devotional.consort',
          position: 0,
        },
      ],
    });

    expect(profile.routeKey).toBe('universe.devotional/shiva');
    expect(entities.lastConfiguration?.relations).toEqual([
      {
        targetResourceId: PARVATI_ID,
        sectionKey: 'entity.family',
        relationshipType: 'devotional.consort',
        position: 0,
      },
    ]);
  });

  it('rejects a route already owned by another Resource', async () => {
    const entities = new MemoryEntities();
    entities.routeOwner = PARVATI_ID;

    const useCase = new ConfigureKnowledgeEntity(
      new MemoryResources(new Map([[SHIVA_ID, resource(SHIVA_ID)]])),
      entities,
    );

    await expect(
      useCase.execute({
        id: SHIVA_ID,
        profile: {
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary: 'A reusable entity profile.',
          facts: [],
        },
        relations: [],
      }),
    ).rejects.toMatchObject({
      code: 'knowledge.entity.route_conflict',
    });
  });

  it('returns the published Entity read model supplied by the public store', async () => {
    const entities = new MemoryEntities();
    const shiva = resource(SHIVA_ID, 'PUBLISHED');
    const profile: KnowledgeEntityProfile = {
      knowledgeResourceId: SHIVA_ID,
      routeKey: 'universe.devotional/shiva',
      slug: 'shiva',
      displayName: 'Lord Shiva',
      summary: 'Published entity.',
      facts: [],
      createdAt: new Date('2026-08-23T00:00:00.000Z'),
      updatedAt: new Date('2026-08-23T00:00:00.000Z'),
    };
    entities.publicEntity = {
      resource: shiva,
      profile,
      assetIds: [],
      relations: [],
    };

    const result = await new GetPublicKnowledgeEntity(entities).execute({
      universeKey: 'universe.devotional',
      slug: 'shiva',
    });

    expect(result.profile.displayName).toBe('Lord Shiva');
  });
});
