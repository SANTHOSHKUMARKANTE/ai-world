import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  ArchiveKnowledgeResourceAsActor,
  CreateKnowledgeResourceAsActor,
  GetKnowledgeResourceMediaAsActor,
  PublishKnowledgeResourceAsActor,
  SetKnowledgeResourceMediaAsActor,
  type KnowledgeResource,
  type KnowledgeResourceMediaPlacement,
  UpdateKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import { Body, Controller, Get, Headers, Param, Patch, Post, Put } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import {
  parseCreateCreatorKnowledgeRequest,
  parseSetCreatorKnowledgeMediaRequest,
  parseUpdateCreatorKnowledgeRequest,
} from './creator-knowledge-request';

export interface CreatorKnowledgeResourceResponse {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly lifecycle: KnowledgeResource['lifecycle'];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreatorKnowledgeMediaPlacementResponse {
  readonly assetId: string;
  readonly role: string;
  readonly playback: string;
  readonly position: number;
  readonly altText: string | null;
  readonly caption: string | null;
  readonly posterAssetId: string | null;
}

export interface CreatorKnowledgeResourceMediaResponse {
  readonly placements: readonly CreatorKnowledgeMediaPlacementResponse[];
}

function toCreatorKnowledgeResourceResponse(
  resource: KnowledgeResource,
): CreatorKnowledgeResourceResponse {
  return {
    id: resource.id,
    universeKey: resource.universeKey,
    resourceType: resource.resourceType,
    lifecycle: resource.lifecycle,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

function toCreatorKnowledgeMediaPlacementResponse(
  placement: KnowledgeResourceMediaPlacement,
): CreatorKnowledgeMediaPlacementResponse {
  return {
    assetId: placement.assetId,
    role: placement.role,
    playback: placement.playback,
    position: placement.position,
    altText: placement.altText,
    caption: placement.caption,
    posterAssetId: placement.posterAssetId,
  };
}

@Controller('knowledge/resources')
export class CreatorKnowledgeController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly createKnowledgeResourceAsActor: CreateKnowledgeResourceAsActor,
    private readonly getKnowledgeResourceMediaAsActor: GetKnowledgeResourceMediaAsActor,
    private readonly updateKnowledgeResourceAsActor: UpdateKnowledgeResourceAsActor,
    private readonly setKnowledgeResourceMediaAsActor: SetKnowledgeResourceMediaAsActor,
    private readonly publishKnowledgeResourceAsActor: PublishKnowledgeResourceAsActor,
    private readonly archiveKnowledgeResourceAsActor: ArchiveKnowledgeResourceAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActingActorId(cookieHeader: string | undefined): Promise<string> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token: sessionToken });
    return session.actorId;
  }

  @Post()
  public async createResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<CreatorKnowledgeResourceResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    const request = parseCreateCreatorKnowledgeRequest(body);

    const resource = await this.createKnowledgeResourceAsActor.execute({
      actingActorId,
      universeKey: request.universeKey,
      resourceType: request.resourceType,
    });

    return toCreatorKnowledgeResourceResponse(resource);
  }

  @Post(':id/publish')
  public async publishResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorKnowledgeResourceResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    return toCreatorKnowledgeResourceResponse(
      await this.publishKnowledgeResourceAsActor.execute({ actingActorId, id }),
    );
  }

  @Post(':id/archive')
  public async archiveResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorKnowledgeResourceResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    return toCreatorKnowledgeResourceResponse(
      await this.archiveKnowledgeResourceAsActor.execute({ actingActorId, id }),
    );
  }

  @Get(':id/media')
  public async getResourceMedia(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorKnowledgeResourceMediaResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);

    const placements = await this.getKnowledgeResourceMediaAsActor.execute({
      actingActorId,
      id,
    });

    return {
      placements: placements.map(toCreatorKnowledgeMediaPlacementResponse),
    };
  }

  @Put(':id/media')
  public async setResourceMedia(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CreatorKnowledgeResourceMediaResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    const request = parseSetCreatorKnowledgeMediaRequest(body);

    const placements = await this.setKnowledgeResourceMediaAsActor.execute({
      actingActorId,
      id,
      placements: request.placements,
    });

    return {
      placements: placements.map(toCreatorKnowledgeMediaPlacementResponse),
    };
  }

  @Patch(':id')
  public async updateResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CreatorKnowledgeResourceResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    const request = parseUpdateCreatorKnowledgeRequest(body);

    const resource = await this.updateKnowledgeResourceAsActor.execute({
      actingActorId,
      id,
      resourceType: request.resourceType,
    });

    return toCreatorKnowledgeResourceResponse(resource);
  }
}
