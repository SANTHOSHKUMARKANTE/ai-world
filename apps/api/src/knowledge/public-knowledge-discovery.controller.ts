import {
  ListPublicKnowledgeDiscovery,
  type PublicKnowledgeDiscoveryItem,
} from '@ai-world/platform-knowledge';
import { Controller, Get, Query } from '@nestjs/common';

import { parsePublicKnowledgeListQuery } from './public-knowledge-request';

export interface PublicKnowledgeDiscoveryPreviewResponse {
  readonly assetId: string;
  readonly assetType: string;
  readonly mimeType: string;
  readonly playback: string;
  readonly posterAssetId: string | null;
  readonly altText: string | null;
}

export interface PublicKnowledgeDiscoveryItemResponse {
  readonly resourceId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly updatedAt: string;
  readonly previewMedia: PublicKnowledgeDiscoveryPreviewResponse | null;
}

export interface PublicKnowledgeDiscoveryResponse {
  readonly items: readonly PublicKnowledgeDiscoveryItemResponse[];
}

function toResponse(item: PublicKnowledgeDiscoveryItem): PublicKnowledgeDiscoveryItemResponse {
  return {
    resourceId: item.resourceId,
    universeKey: item.universeKey,
    resourceType: item.resourceType,
    slug: item.slug,
    displayName: item.displayName,
    summary: item.summary,
    updatedAt: item.updatedAt.toISOString(),
    previewMedia:
      item.previewMedia === null
        ? null
        : {
            assetId: item.previewMedia.assetId,
            assetType: item.previewMedia.assetType,
            mimeType: item.previewMedia.mimeType,
            playback: item.previewMedia.playback,
            posterAssetId: item.previewMedia.posterAssetId,
            altText: item.previewMedia.altText,
          },
  };
}

@Controller('knowledge/discovery')
export class PublicKnowledgeDiscoveryController {
  public constructor(private readonly listPublicKnowledgeDiscovery: ListPublicKnowledgeDiscovery) {}

  @Get()
  public async list(@Query() query: unknown): Promise<PublicKnowledgeDiscoveryResponse> {
    const request = parsePublicKnowledgeListQuery(query);
    const items = await this.listPublicKnowledgeDiscovery.execute(request);

    return {
      items: items.map(toResponse),
    };
  }
}
