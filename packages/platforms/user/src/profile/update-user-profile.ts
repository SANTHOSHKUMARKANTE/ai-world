import { ApplicationError } from '@ai-world/foundation-errors';

import type { User } from '../user';
import { normalizeUserDisplayName } from './user-display-name';
import type { UserProfileWriter } from './user-profile-writer';

export interface UpdateUserProfileInput {
  readonly actorId: string;
  readonly displayName: string | null;
}

export class UpdateUserProfile {
  constructor(private readonly writer: UserProfileWriter) {}

  async execute(input: UpdateUserProfileInput): Promise<User> {
    const displayName = normalizeUserDisplayName(input.displayName);

    const user = await this.writer.updateByActorId({
      actorId: input.actorId,
      displayName,
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
