import { parseResourceId } from '@ai-world/kernel-identifiers';
import { GetUserProfile } from '@ai-world/platform-user';

import { AddFavorite } from './add-favorite';
import type { Favorite } from './favorite';
import { ListFavorites } from './list-favorites';
import { RemoveFavorite, type RemoveFavoriteResult } from './remove-favorite';

export interface AddFavoriteAsActorInput {
  readonly actingActorId: string;
  readonly resourceId: string;
}

export interface ListFavoritesAsActorInput {
  readonly actingActorId: string;
  readonly limit?: number;
}

export interface RemoveFavoriteAsActorInput {
  readonly actingActorId: string;
  readonly resourceId: string;
}

export class AddFavoriteAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly addFavorite: AddFavorite,
  ) {}

  public async execute(input: AddFavoriteAsActorInput): Promise<Favorite> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.addFavorite.execute({
      userId: user.id,
      resourceId: input.resourceId,
    });
  }
}

export class ListFavoritesAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly listFavorites: ListFavorites,
  ) {}

  public async execute(input: ListFavoritesAsActorInput): Promise<readonly Favorite[]> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.listFavorites.execute({
      userId: user.id,
      ...(input.limit === undefined ? {} : { limit: input.limit }),
    });
  }
}

export class RemoveFavoriteAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly removeFavorite: RemoveFavorite,
  ) {}

  public async execute(input: RemoveFavoriteAsActorInput): Promise<RemoveFavoriteResult> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.removeFavorite.execute({
      userId: user.id,
      resourceId: input.resourceId,
    });
  }
}
