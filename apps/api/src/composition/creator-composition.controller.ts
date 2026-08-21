import { ApplicationError } from '@ai-world/foundation-errors';
import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import {
  AuthorizeCompositionEditing,
  CreatePage,
  CreateTextBlock,
  GetBlock,
  GetPage,
  GetPageComposition,
  SetPageComposition,
  type Block,
  type Page,
  type PageComposition,
} from '@ai-world/platform-composition';
import { ValidateSession } from '@ai-world/platform-identity-access';
import { Body, Controller, Get, Headers, Param, Post, Put } from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import {
  parseCreateCreatorPageRequest,
  parseCreateCreatorTextBlockRequest,
  parseSetCreatorPageCompositionRequest,
} from './creator-composition-request';

export interface CreatorPageResponse {
  readonly id: string;
  readonly universeKey: string;
  readonly routePath: string;
  readonly title: string;
  readonly lifecycle: Page['lifecycle'];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreatorBlockResponse {
  readonly id: string;
  readonly universeKey: string;
  readonly blockType: Block['blockType'];
  readonly text: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreatorPageCompositionResponse {
  readonly pageId: string;
  readonly items: readonly {
    readonly position: number;
    readonly kind: PageComposition['items'][number]['reference']['kind'];
    readonly id: string;
  }[];
}

function invalidCanonicalInput(error: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'composition.creator.invalid_input',
    kind: 'validation',
    message: `Creator Composition input failed canonical validation: ${error.message}`,
    publicMessage: 'The creator Composition input is invalid.',
  });
}

function missingResource(resource: 'Page' | 'Block' | 'Page composition'): ApplicationError {
  return new ApplicationError({
    code: 'composition.creator.not_found',
    kind: 'not_found',
    message: `${resource} was not found for creator editing.`,
    publicMessage: 'The requested Composition resource was not found.',
  });
}

async function executeCanonical<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof TypeError) {
      throw invalidCanonicalInput(error);
    }
    throw error;
  }
}

function toPageResponse(page: Page): CreatorPageResponse {
  return {
    id: page.id,
    universeKey: page.universeKey,
    routePath: page.route.path,
    title: page.presentation.title,
    lifecycle: page.lifecycle,
    createdAt: page.createdAt.toISOString(),
    updatedAt: page.updatedAt.toISOString(),
  };
}

function toBlockResponse(block: Block): CreatorBlockResponse {
  return {
    id: block.id,
    universeKey: block.universeKey,
    blockType: block.blockType,
    text: block.content.text,
    createdAt: block.createdAt.toISOString(),
    updatedAt: block.updatedAt.toISOString(),
  };
}

function toCompositionResponse(composition: PageComposition): CreatorPageCompositionResponse {
  return {
    pageId: composition.pageId,
    items: composition.items.map((item) => ({
      position: item.position,
      kind: item.reference.kind,
      id: item.reference.id,
    })),
  };
}

@Controller('composition')
export class CreatorCompositionController {
  constructor(
    private readonly validateSession: ValidateSession,
    private readonly authorizeCompositionEditing: AuthorizeCompositionEditing,
    private readonly createPage: CreatePage,
    private readonly getPage: GetPage,
    private readonly createTextBlock: CreateTextBlock,
    private readonly getBlock: GetBlock,
    private readonly setPageComposition: SetPageComposition,
    private readonly getPageComposition: GetPageComposition,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireEditingAccess(cookieHeader: string | undefined): Promise<void> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });
    await this.authorizeCompositionEditing.execute({ actingActorId: session.actorId });
  }

  @Post('pages')
  async createCreatorPage(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<CreatorPageResponse> {
    await this.requireEditingAccess(cookieHeader);
    const request = parseCreateCreatorPageRequest(body);
    const page = await executeCanonical(() =>
      this.createPage.execute({
        universeKey: parseNamespacedKey(request.universeKey),
        route: { path: request.routePath },
        presentation: { title: request.title },
      }),
    );
    return toPageResponse(page);
  }

  @Get('pages/:id')
  async getCreatorPage(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorPageResponse> {
    await this.requireEditingAccess(cookieHeader);
    const page = await executeCanonical(() => this.getPage.execute({ id: parseResourceId(id) }));
    if (!page) {
      throw missingResource('Page');
    }
    return toPageResponse(page);
  }

  @Post('blocks/text')
  async createCreatorTextBlock(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<CreatorBlockResponse> {
    await this.requireEditingAccess(cookieHeader);
    const request = parseCreateCreatorTextBlockRequest(body);
    const block = await executeCanonical(() =>
      this.createTextBlock.execute({
        universeKey: parseNamespacedKey(request.universeKey),
        content: { text: request.text },
      }),
    );
    return toBlockResponse(block);
  }

  @Get('blocks/:id')
  async getCreatorBlock(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorBlockResponse> {
    await this.requireEditingAccess(cookieHeader);
    const block = await executeCanonical(() => this.getBlock.execute({ id: parseResourceId(id) }));
    if (!block) {
      throw missingResource('Block');
    }
    return toBlockResponse(block);
  }

  @Put('pages/:id/composition')
  async replaceCreatorPageComposition(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
    @Body() body: unknown,
  ): Promise<CreatorPageCompositionResponse> {
    await this.requireEditingAccess(cookieHeader);
    const request = parseSetCreatorPageCompositionRequest(body);
    const composition = await executeCanonical(() =>
      this.setPageComposition.execute({
        pageId: parseResourceId(id),
        items: request.items,
      }),
    );
    return toCompositionResponse(composition);
  }

  @Get('pages/:id/composition')
  async getCreatorPageComposition(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('id') id: string,
  ): Promise<CreatorPageCompositionResponse> {
    await this.requireEditingAccess(cookieHeader);
    const composition = await executeCanonical(() =>
      this.getPageComposition.execute({ pageId: parseResourceId(id) }),
    );
    if (!composition) {
      throw missingResource('Page composition');
    }
    return toCompositionResponse(composition);
  }
}
