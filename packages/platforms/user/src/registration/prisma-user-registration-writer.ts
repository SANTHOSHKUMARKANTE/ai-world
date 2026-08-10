import type { DatabaseTransactionClient } from '@ai-world/foundation-database';

import type { User } from '../user';
import type {
  CreateRegistrationUserInput,
  UserRegistrationWriter,
} from './user-registration-writer';

export class PrismaUserRegistrationWriter implements UserRegistrationWriter {
  constructor(private readonly database: DatabaseTransactionClient) {}

  async create(input: CreateRegistrationUserInput): Promise<User> {
    return this.database.user.create({
      data: {
        actorId: input.actorId,
      },
    });
  }
}
