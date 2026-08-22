import { parseResourceId } from '@ai-world/kernel-identifiers';
import { GetUserProfile } from '@ai-world/platform-user';

import type { Collection, CollectionResourceMembership } from './collection';
import {
  AddCollectionResource,
  ListCollectionResources,
  RemoveCollectionResource,
  type RemoveCollectionResourceResult,
} from './collection-resources';
import { CreateCollection } from './create-collection';
import { ListCollections } from './list-collections';

export interface CreateCollectionAsActorInput {
  readonly actingActorId: string;
  readonly name: string;
}

export interface ListCollectionsAsActorInput {
  readonly actingActorId: string;
  readonly limit?: number;
}

export interface AddCollectionResourceAsActorInput {
  readonly actingActorId: string;
  readonly collectionId: string;
  readonly resourceId: string;
}

export interface ListCollectionResourcesAsActorInput {
  readonly actingActorId: string;
  readonly collectionId: string;
  readonly limit?: number;
}

export interface RemoveCollectionResourceAsActorInput {
  readonly actingActorId: string;
  readonly collectionId: string;
  readonly resourceId: string;
}

export class CreateCollectionAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly createCollection: CreateCollection,
  ) {}

  public async execute(input: CreateCollectionAsActorInput): Promise<Collection> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.createCollection.execute({
      userId: user.id,
      name: input.name,
    });
  }
}

export class ListCollectionsAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly listCollections: ListCollections,
  ) {}

  public async execute(input: ListCollectionsAsActorInput): Promise<readonly Collection[]> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.listCollections.execute({
      userId: user.id,
      ...(input.limit === undefined ? {} : { limit: input.limit }),
    });
  }
}

export class AddCollectionResourceAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly addCollectionResource: AddCollectionResource,
  ) {}

  public async execute(
    input: AddCollectionResourceAsActorInput,
  ): Promise<CollectionResourceMembership> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.addCollectionResource.execute({
      userId: user.id,
      collectionId: input.collectionId,
      resourceId: input.resourceId,
    });
  }
}

export class ListCollectionResourcesAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly listCollectionResources: ListCollectionResources,
  ) {}

  public async execute(
    input: ListCollectionResourcesAsActorInput,
  ): Promise<readonly CollectionResourceMembership[]> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.listCollectionResources.execute({
      userId: user.id,
      collectionId: input.collectionId,
      ...(input.limit === undefined ? {} : { limit: input.limit }),
    });
  }
}

export class RemoveCollectionResourceAsActor {
  public constructor(
    private readonly getUserProfile: GetUserProfile,
    private readonly removeCollectionResource: RemoveCollectionResource,
  ) {}

  public async execute(
    input: RemoveCollectionResourceAsActorInput,
  ): Promise<RemoveCollectionResourceResult> {
    const user = await this.getUserProfile.execute({
      actorId: parseResourceId(input.actingActorId),
    });

    return this.removeCollectionResource.execute({
      userId: user.id,
      collectionId: input.collectionId,
      resourceId: input.resourceId,
    });
  }
}
