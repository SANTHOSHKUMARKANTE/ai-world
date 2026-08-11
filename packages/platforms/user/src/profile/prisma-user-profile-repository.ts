import type { DatabaseClient } from '@ai-world/foundation-database';

import type { User } from '../user';
import type { GetUserProfileByActorIdInput, UserProfileReader } from './user-profile-reader';
import type { UpdateUserProfileByActorIdInput, UserProfileWriter } from './user-profile-writer';

export class PrismaUserProfileRepository implements UserProfileReader, UserProfileWriter {
  constructor(private readonly database: DatabaseClient) {}

  async findByActorId(input: GetUserProfileByActorIdInput): Promise<User | null> {
    return this.database.user.findUnique({
      where: {
        actorId: input.actorId,
      },
    });
  }

  async updateByActorId(input: UpdateUserProfileByActorIdInput): Promise<User | null> {
    const result = await this.database.user.updateMany({
      where: {
        actorId: input.actorId,
      },
      data: {
        displayName: input.displayName,
      },
    });

    if (result.count !== 1) {
      return null;
    }

    return this.database.user.findUnique({
      where: {
        actorId: input.actorId,
      },
    });
  }
}
