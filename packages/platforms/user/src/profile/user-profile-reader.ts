import type { User } from '../user';

export interface GetUserProfileByActorIdInput {
  readonly actorId: string;
}

export interface UserProfileReader {
  findByActorId(input: GetUserProfileByActorIdInput): Promise<User | null>;
}
