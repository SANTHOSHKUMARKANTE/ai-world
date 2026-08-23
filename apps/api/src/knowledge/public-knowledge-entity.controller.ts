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
  readonly media: readonly {
    readonly assetId: string;
    readonly assetType: string;
    readonly mimeType: string;
    readonly role: string;
    readonly playback: string;
    readonly position: number;
    readonly altText: string | null;
    readonly caption: string | null;
    readonly width?: number;
    readonly height?: number;
    readonly durationMs?: number;
    readonly posterAssetId: string | null;
  }[];
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
    media: entity.media.map((media) => ({
      assetId: media.assetId,
      assetType: media.assetType,
      mimeType: media.mimeType,
      role: media.role,
      playback: media.playback,
      position: media.position,
      altText: media.altText,
      caption: media.caption,
      ...(media.width === undefined ? {} : { width: media.width }),
      ...(media.height === undefined ? {} : { height: media.height }),
      ...(media.durationMs === undefined ? {} : { durationMs: media.durationMs }),
      posterAssetId: media.posterAssetId,
    })),
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
