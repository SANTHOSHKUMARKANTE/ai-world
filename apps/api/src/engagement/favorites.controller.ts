import { ApplicationError } from '@ai-world/foundation-errors';
import {
  AddFavoriteAsActor,
  ListFavoritesAsActor,
  RemoveFavoriteAsActor,
  type Favorite,
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
import { parseAddFavoriteRequest } from './favorite-request';

export interface FavoriteResponse {
  readonly id: string;
  readonly resourceId: string;
  readonly createdAt: string;
}

export interface FavoriteListResponse {
  readonly favorites: readonly FavoriteResponse[];
}

function toFavoriteResponse(favorite: Favorite): FavoriteResponse {
  return {
    id: favorite.id,
    resourceId: favorite.resourceId,
    createdAt: favorite.createdAt.toISOString(),
  };
}

function invalidCanonicalFavoriteInput(cause: TypeError): ApplicationError {
  return new ApplicationError({
    code: 'engagement.favorite.invalid_input',
    kind: 'validation',
    message: `Favorite input failed canonical validation: ${cause.message}`,
    publicMessage: 'The Favorite input is invalid.',
    cause,
  });
}

async function executeCanonical<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (error instanceof TypeError) {
      throw invalidCanonicalFavoriteInput(error);
    }

    throw error;
  }
}

@Controller('engagement/favorites')
export class FavoritesController {
  public constructor(
    private readonly validateSession: ValidateSession,
    private readonly addFavorite: AddFavoriteAsActor,
    private readonly listFavorites: ListFavoritesAsActor,
    private readonly removeFavorite: RemoveFavoriteAsActor,
    private readonly sessionCookie: SessionCookie,
  ) {}

  private async requireActorId(cookieHeader: string | undefined): Promise<string> {
    const token = requireSessionToken(this.sessionCookie, cookieHeader);
    const session = await this.validateSession.execute({ token });

    return session.actorId;
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  public async add(
    @Headers('cookie') cookieHeader: string | undefined,
    @Body() body: unknown,
  ): Promise<FavoriteResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const request = parseAddFavoriteRequest(body);
    const favorite = await executeCanonical(() =>
      this.addFavorite.execute({
        actingActorId,
        resourceId: request.resourceId,
      }),
    );

    return toFavoriteResponse(favorite);
  }

  @Get()
  public async list(
    @Headers('cookie') cookieHeader: string | undefined,
  ): Promise<FavoriteListResponse> {
    const actingActorId = await this.requireActorId(cookieHeader);
    const favorites = await executeCanonical(() => this.listFavorites.execute({ actingActorId }));

    return {
      favorites: favorites.map(toFavoriteResponse),
    };
  }

  @Delete(':resourceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async remove(
    @Headers('cookie') cookieHeader: string | undefined,
    @Param('resourceId') resourceId: string,
  ): Promise<void> {
    const actingActorId = await this.requireActorId(cookieHeader);

    await executeCanonical(() =>
      this.removeFavorite.execute({
        actingActorId,
        resourceId,
      }),
    );
  }
}
