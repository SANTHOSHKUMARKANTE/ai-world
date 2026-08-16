import {
  GetPublicKnowledgeResource,
  ListPublicKnowledgeResources,
  type KnowledgeResource,
} from '@ai-world/platform-knowledge';
import { Controller, Get, Param, Query } from '@nestjs/common';

import { parsePublicKnowledgeListQuery } from './public-knowledge-request';

export interface PublicKnowledgeResourceResponse {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface PublicKnowledgeResourceListResponse {
  readonly items: readonly PublicKnowledgeResourceResponse[];
}

function toPublicKnowledgeResourceResponse(
  resource: KnowledgeResource,
): PublicKnowledgeResourceResponse {
  return {
    id: resource.id,
    universeKey: resource.universeKey,
    resourceType: resource.resourceType,
    createdAt: resource.createdAt.toISOString(),
    updatedAt: resource.updatedAt.toISOString(),
  };
}

@Controller('knowledge/resources')
export class PublicKnowledgeController {
  public constructor(
    private readonly getPublicKnowledgeResource: GetPublicKnowledgeResource,
    private readonly listPublicKnowledgeResources: ListPublicKnowledgeResources,
  ) {}

  @Get()
  public async listResources(
    @Query() query: unknown,
  ): Promise<PublicKnowledgeResourceListResponse> {
    const request = parsePublicKnowledgeListQuery(query);
    const resources = await this.listPublicKnowledgeResources.execute(request);

    return {
      items: resources.map(toPublicKnowledgeResourceResponse),
    };
  }

  @Get(':id')
  public async getResource(@Param('id') id: string): Promise<PublicKnowledgeResourceResponse> {
    const resource = await this.getPublicKnowledgeResource.execute({ id });

    return toPublicKnowledgeResourceResponse(resource);
  }
}
