import { ApplicationError } from '@ai-world/foundation-errors';

import type { User } from '../user';
import type { UserProfileReader } from './user-profile-reader';

export interface GetUserProfileInput {
  readonly actorId: string;
}

export class GetUserProfile {
  constructor(private readonly reader: UserProfileReader) {}

  async execute(input: GetUserProfileInput): Promise<User> {
    const user = await this.reader.findByActorId({
      actorId: input.actorId,
    });

    if (!user) {
      throw new ApplicationError({
        code: 'user.profile.not_found',
        kind: 'not_found',
        message: 'No User profile exists for the supplied Actor.',
        publicMessage: 'User profile not found.',
      });
    }

    return user;
  }
}
