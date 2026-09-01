import { ApplicationError } from '@ai-world/foundation-errors';
import {
  AddCollectionResourceAsActor,
  CreateCollectionAsActor,
  DeleteCollectionAsActor,
  ListCollectionResourcesAsActor,
  ListCollectionsAsActor,
  RemoveCollectionResourceAsActor,
  type Collection,
  type CollectionResourceMembership,
} from '@ai-world/platform-engagement';
import { ValidateSession } from '@ai-world/platform-identity-access';
import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { requireSessionToken } from '../session/require-session-token';
import { SessionCookie } from '../session/session-cookie';
import {
  parseAddCollectionResourceRequest,
  parseCreateCollectionRequest,
} from './collection-request';

export interface CollectionResponse {
  readonly id: string;
  readonly name: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CollectionListResponse {
  readonly collections: readonly CollectionResponse[];
}

export interface CollectionResourceResponse {
  readonly resourceId: string;
  readonly addedAt: string;
}

export interface CollectionResourceListResponse {
  readonly resources: readonly CollectionResourceResponse[];
}

function toCollectionResponse(collection: Collection): CollectionResponse {
  return {
    id: collection.id,
    name: collection.name,
    createdAt: collection.createdAt.toISOString(),
    updatedAt: collection.updatedAt.toISOString(),
  };
}

function toCollectionResourceResponse(
  membership: CollectionResourceMembership,
): CollectionResourceResponse {
  return {
    resourceId: membership.resourceId,
    addedAt: membership.addedAt.toISOString(),
  };
}

function invalidCanonicalCollectionInput(cause: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'engagement.collection.invalid_input',
    kind: 'validation',
    message: `Collection input failed canonical validation: ${cause.message}`,
    publicMessage: 'The Collection input is invalid.',
    cause,
  });
}

async function executeCanonical<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof TypeError) {
      throw invalidCanonicalCollectionInput(error);
    }

    throw error;
  }
}

@Controller('engagement/collections')
export class CollectionsController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly createCollection: CreateCollectionAsActor,
    private readonly deleteCollection: DeleteCollectionAsActor,
    private readonly listCollections: ListCollectionsAsActor,
    private readonly addCollectionResource: AddCollectionResourceAsActor,
    private readonly listCollectionResources: ListCollectionResourcesAsActor,
    private readonly removeCollectionResource: RemoveCollectionResourceAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActorId(cookieHeader: string | undefined): Promise<string> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });

    return session.actorId;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<CollectionResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const request = parseCreateCollectionRequest(body);
    const collection = await executeCanonical(() =>
      this.createCollection.execute({
        actingActorId,
        name: request.name,
      }),
    );

    return toCollectionResponse(collection);
  }

  @Get()
  public async list(
    @Headers('cookie') cookieHeader: string | undefined,
  ): Promise<CollectionListResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const collections = await executeCanonical(() =>
      this.listCollections.execute({ actingActorId }),
    );

    return {
      collections: collections.map(toCollectionResponse),
    };
  }

  @Delete(':collectionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('collectionId') collectionId: string,
  ): Promise<void> {
    const actingActorId = await this.requireActorId(cookieHeader);

    await executeCanonical(() =>
      this.deleteCollection.execute({
        actingActorId,
        collectionId,
      }),
    );
  }

  @Post(':collectionId/resources')
  @HttpCode(HttpStatus.OK)
  public async addResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('collectionId') collectionId: string,
    @Body() body: unknown,
  ): Promise<CollectionResourceResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const request = parseAddCollectionResourceRequest(body);
    const membership = await executeCanonical(() =>
      this.addCollectionResource.execute({
        actingActorId,
        collectionId,
        resourceId: request.resourceId,
      }),
    );

    return toCollectionResourceResponse(membership);
  }

  @Get(':collectionId/resources')
  public async listResources(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('collectionId') collectionId: string,
  ): Promise<CollectionResourceListResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const memberships = await executeCanonical(() =>
      this.listCollectionResources.execute({
        actingActorId,
        collectionId,
      }),
    );

    return {
      resources: memberships.map(toCollectionResourceResponse),
    };
  }

  @Delete(':collectionId/resources/:resourceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async removeResource(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('collectionId') collectionId: string,
    @Param('resourceId') resourceId: string,
  ): Promise<void> {
    const actingActorId = await this.requireActorId(cookieHeader);

    await executeCanonical(() =>
      this.removeCollectionResource.execute({
        actingActorId,
        collectionId,
        resourceId,
      }),
    );
  }
}
