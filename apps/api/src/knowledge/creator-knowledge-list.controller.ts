import { ValidateSession } from '@ai-world/platform-identity-access';
import { ListKnowledgeResourcesAsActor } from '@ai-world/platform-knowledge';
import { Controller, Get, Headers, Query } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseListCreatorKnowledgeRequest } from './creator-knowledge-request';
import type { CreatorKnowledgeResourceResponse } from './creator-knowledge.controller';

@Controller('knowledge/creator/resources')
export class CreatorKnowledgeListController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly listKnowledgeResourcesAsActor: ListKnowledgeResourcesAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Get()
  public async listResources(
    @Headers('cookie') cookieHeader: string | undefined,
    @Query() query: unknown,
  ): Promise<{ readonly items: readonly CreatorKnowledgeResourceResponse[] }> {
    const sessionToken = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token: sessionToken });
    const request = parseListCreatorKnowledgeRequest(query);
    const resources = await this.listKnowledgeResourcesAsActor.execute({
      actingActorId: session.actorId,
      universeKey: request.universeKey,
      ...(request.limit === undefined ? {} : { limit: request.limit }),
    });

    return {
      items: resources.map((resource) => ({
        id: resource.id,
        universeKey: resource.universeKey,
        resourceType: resource.resourceType,
        lifecycle: resource.lifecycle,
        createdAt: resource.createdAt.toISOString(),
        updatedAt: resource.updatedAt.toISOString(),
      })),
    };
  }
}
