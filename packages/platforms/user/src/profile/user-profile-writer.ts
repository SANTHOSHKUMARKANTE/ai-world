import type { User } from '../user';

export interface UpdateUserProfileByActorIdInput {
  readonly actorId: string;
  readonly displayName: string | null;
}

export interface UserProfileWriter {
  updateByActorId(input: UpdateUserProfileByActorIdInput): Promise<User | null>;
}
