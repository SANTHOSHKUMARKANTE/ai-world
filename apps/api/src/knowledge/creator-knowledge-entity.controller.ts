import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  ConfigureKnowledgeEntityAsActor,
  GetKnowledgeEntityAsActor,
  GetKnowledgeResource,
  type KnowledgeEntityConfiguration,
  type KnowledgeEntityProfile,
  type KnowledgeResource,
} from '@ai-world/platform-knowledge';
import { Body, Controller, Get, Headers, Param, Put } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import { parseConfigureCreatorKnowledgeEntityRequest } from './creator-knowledge-entity-request';

export interface CreatorKnowledgeEntityProfileResponse {
  readonly resourceId: string;
  readonly slug: string;
  readonly displayName: string;
  readonly nativeName: string | null;
  readonly alternateNames: readonly string[];
  readonly summary: string;
  readonly overview: string | null;
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
    nativeName: profile.nativeName,
    alternateNames: profile.alternateNames,
    summary: profile.summary,
    overview: profile.overview,
    facts: profile.facts,
    updatedAt: profile.updatedAt.toISOString(),
  };
}

export interface CreatorKnowledgeEntityConfigurationResponse extends CreatorKnowledgeEntityProfileResponse {
  readonly resource: {
    readonly id: string;
    readonly universeKey: string;
    readonly resourceType: string;
    readonly lifecycle: string;
  };
  readonly relations: readonly {
    readonly targetResourceId: string;
    readonly sectionKey: string;
    readonly relationshipType: string;
    readonly position: number;
  }[];
}

function toConfigurationResponse(
  configuration: KnowledgeEntityConfiguration,
  resource: KnowledgeResource,
): CreatorKnowledgeEntityConfigurationResponse {
  return {
    ...toResponse(configuration.profile),
    resource: {
      id: resource.id,
      universeKey: resource.universeKey,
      resourceType: resource.resourceType,
      lifecycle: resource.lifecycle,
    },
    relations: configuration.relations,
  };
}

@Controller('knowledge/resources')
export class CreatorKnowledgeEntityController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly getKnowledgeEntityAsActor: GetKnowledgeEntityAsActor,
    private readonly getKnowledgeResource: GetKnowledgeResource,
    private readonly configureKnowledgeEntityAsActor: ConfigureKnowledgeEntityAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  @Get(':id/entity')
  public async getEntityConfiguration(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorKnowledgeEntityConfigurationResponse> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });
    const configuration = await this.getKnowledgeEntityAsActor.execute({
      actingActorId: session.actorId,
      id,
    });
    const resource = await this.getKnowledgeResource.execute({
      id: configuration.profile.knowledgeResourceId,
    });
    return toConfigurationResponse(configuration, resource);
  }

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
      profile: {
        slug: request.profile.slug,
        displayName: request.profile.displayName,
        nativeName: request.profile.nativeName ?? null,
        alternateNames: request.profile.alternateNames ?? [],
        summary: request.profile.summary,
        overview: request.profile.overview ?? null,
        facts: request.profile.facts,
      },
      relations: request.relations,
    });

    return toResponse(profile);
  }
}
