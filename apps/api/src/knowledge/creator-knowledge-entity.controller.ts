import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  ConfigureKnowledgeEntityAsActor,
  type KnowledgeEntityProfile,
} from '@ai-world/platform-knowledge';
import { Body, Controller, Headers, Param, Put } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseConfigureCreatorKnowledgeEntityRequest } from './creator-knowledge-entity-request';

export interface CreatorKnowledgeEntityProfileResponse {
  readonly resourceId: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly facts: readonly {
    readonly key: string;
    readonly label: string;
    readonly value: string;
  }[];
  readonly updatedAt: string;
}

function toResponse(profile: KnowledgeEntityProfile): CreatorKnowledgeEntityProfileResponse {
  return {
    resourceId: profile.knowledgeResourceId,
    slug: profile.slug,
    displayName: profile.displayName,
    summary: profile.summary,
    facts: profile.facts,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

@Controller('knowledge/resources')
export class CreatorKnowledgeEntityController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly configureKnowledgeEntityAsActor: ConfigureKnowledgeEntityAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Put(':id/entity')
  public async configureEntity(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CreatorKnowledgeEntityProfileResponse> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });
    const request = parseConfigureCreatorKnowledgeEntityRequest(body);

    const profile = await this.configureKnowledgeEntityAsActor.execute({
      actingActorId: session.actorId,
      id,
      profile: request.profile,
      relations: request.relations,
    });

    return toResponse(profile);
  }
}
