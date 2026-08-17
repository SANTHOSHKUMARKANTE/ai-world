import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  CreateKnowledgeResourceAsActor,
  SetKnowledgeResourceAssetsAsActor,
  type KnowledgeResource,
  UpdateKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import { Body, Controller, Headers, Param, Patch, Post, Put } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import {
  parseCreateCreatorKnowledgeRequest,
  parseSetCreatorKnowledgeAssetsRequest,
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

export interface CreatorKnowledgeResourceAssetsResponse {
  readonly assetIds: readonly string[];
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

@Controller('knowledge/resources')
export class CreatorKnowledgeController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly createKnowledgeResourceAsActor: CreateKnowledgeResourceAsActor,
    private readonly updateKnowledgeResourceAsActor: UpdateKnowledgeResourceAsActor,
    private readonly setKnowledgeResourceAssetsAsActor: SetKnowledgeResourceAssetsAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActingActorId(cookieHeader: string | undefined): Promise<string> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);

    const session = await this.validateSession.execute({
      token: sessionToken,
    });

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

  @Put(':id/assets')
  public async setResourceAssets(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CreatorKnowledgeResourceAssetsResponse> {
    const actingActorId = await this.requireActingActorId(cookieHeader);
    const request = parseSetCreatorKnowledgeAssetsRequest(body);
    const assetIds = await this.setKnowledgeResourceAssetsAsActor.execute({
      actingActorId,
      id,
      assetIds: request.assetIds,
    });
    return { assetIds };
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
