import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import {
  GetPagePreview,
  PAGE_PUBLISHED_LIFECYCLE,
  type PagePreview,
  type PagePreviewItem,
  type PagePreviewMediaItem,
} from '@ai-world/platform-composition';
import { Controller, Get, Param } from '@nestjs/common';

export interface PublicPageExperienceResponse {
  readonly page: {
    readonly id: string;
    readonly universeKey: string;
    readonly routePath: string;
    readonly title: string;
    readonly lifecycle: 'PUBLISHED';
  };
  readonly items: readonly (
    | {
        readonly position: number;
        readonly kind: 'BLOCK';
        readonly id: string;
        readonly blockType: string;
        readonly text: string;
      }
    | {
        readonly position: number;
        readonly kind: 'KNOWLEDGE_RESOURCE';
        readonly id: string;
        readonly resourceType: string;
        readonly lifecycle: 'PUBLISHED';
      }
    | {
        readonly position: number;
        readonly kind: 'MEDIA_ASSET';
        readonly id: string;
        readonly assetType: PagePreviewMediaItem['assetType'];
        readonly durationMs?: number;
      }
  )[];
}

function missingPublishedExperience(cause?: unknown): ApplicationError {
  return new ApplicationError({
    code: 'composition.public.not_found',
    kind: 'not_found',
    message: 'A published Page Experience was not found for public Composition access.',
    publicMessage: 'The published Experience was not found.',
    cause,
  });
}

function publicItem(item: PagePreviewItem): PublicPageExperienceResponse['items'][number] | null {
  switch (item.kind) {
    case 'BLOCK':
      return {
        position: item.position,
        kind: item.kind,
        id: item.id,
        blockType: item.blockType,
        text: item.text,
      };
    case 'KNOWLEDGE_RESOURCE':
      if (item.lifecycle !== 'PUBLISHED') {
        return null;
      }
      return {
        position: item.position,
        kind: item.kind,
        id: item.id,
        resourceType: item.resourceType,
        lifecycle: 'PUBLISHED',
      };
    case 'MEDIA_ASSET':
      return {
        position: item.position,
        kind: item.kind,
        id: item.id,
        assetType: item.assetType,
        ...(item.durationMs === undefined ? {} : { durationMs: item.durationMs }),
      };
  }
}

function toPublicResponse(preview: PagePreview): PublicPageExperienceResponse {
  const items: PublicPageExperienceResponse['items'][number][] = [];

  for (const item of preview.items) {
    const visible = publicItem(item);
    if (visible) {
      items.push(visible);
    }
  }

  return {
    page: {
      id: preview.page.id,
      universeKey: preview.page.universeKey,
      routePath: preview.page.route.path,
      title: preview.page.presentation.title,
      lifecycle: 'PUBLISHED',
    },
    items,
  };
}

@Controller('composition/public')
export class PublicCompositionController {
  public constructor(private readonly getPagePreview: GetPagePreview) {}

  @Get('pages/:id')
  public async getPageExperience(@Param('id') id: string): Promise<PublicPageExperienceResponse> {
    let preview: PagePreview | null;

    try {
      preview = await this.getPagePreview.execute({
        pageId: parseResourceId(id),
      });
    } catch (error) {
      if (error instanceof TypeError) {
        throw missingPublishedExperience(error);
      }
      throw error;
    }

    if (!preview || preview.page.lifecycle !== PAGE_PUBLISHED_LIFECYCLE) {
      throw missingPublishedExperience();
    }

    return toPublicResponse(preview);
  }
}
