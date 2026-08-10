import type { User } from '../user';

export interface CreateRegistrationUserInput {
  readonly actorId: string;
}

export interface UserRegistrationWriter {
  create(input: CreateRegistrationUserInput): Promise<User>;
}
