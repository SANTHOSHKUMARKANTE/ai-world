import { GetPublicKnowledgeEntity, type PublicKnowledgeEntity } from '@ai-world/platform-knowledge';
import { Controller, Get, Param } from '@nestjs/common';

export interface PublicKnowledgeEntityResponse {
  readonly resource: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
  };
  readonly profile: {
    readonly slug: string;
    readonly displayName: string;
    readonly summary: string;
    readonly facts: readonly {
      readonly key: string;
      readonly label: string;
      readonly value: string;
    }[];
  };
  readonly assetIds: readonly string[];
  readonly relations: readonly {
    readonly sectionKey: string;
    readonly relationshipType: string;
    readonly position: number;
    readonly target: {
      readonly id: string;
      readonly universeKey: string;
      readonly resourceType: string;
      readonly slug: string;
      readonly displayName: string;
      readonly summary: string;
      readonly previewAssetId: string | null;
    };
  }[];
}

function toResponse(entity: PublicKnowledgeEntity): PublicKnowledgeEntityResponse {
  return {
    resource: {
      id: entity.resource.id,
      universeKey: entity.resource.universeKey,
      resourceType: entity.resource.resourceType,
    },
    profile: {
      slug: entity.profile.slug,
      displayName: entity.profile.displayName,
      summary: entity.profile.summary,
      facts: entity.profile.facts,
    },
    assetIds: entity.assetIds,
    relations: entity.relations.map((relation) => ({
      sectionKey: relation.sectionKey,
      relationshipType: relation.relationshipType,
      position: relation.position,
      target: {
        id: relation.target.resource.id,
        universeKey: relation.target.resource.universeKey,
        resourceType: relation.target.resource.resourceType,
        slug: relation.target.profile.slug,
        displayName: relation.target.profile.displayName,
        summary: relation.target.profile.summary,
        previewAssetId: relation.target.previewAssetId,
      },
    })),
  };
}

@Controller('knowledge/entities')
export class PublicKnowledgeEntityController {
  public constructor(private readonly getPublicKnowledgeEntity: GetPublicKnowledgeEntity) {}

  @Get(':universeKey/:slug')
  public async getEntity(
    @Param('universeKey') universeKey: string,
    @Param('slug') slug: string,
  ): Promise<PublicKnowledgeEntityResponse> {
    return toResponse(
      await this.getPublicKnowledgeEntity.execute({
        universeKey,
        slug,
      }),
    );
  }
}
