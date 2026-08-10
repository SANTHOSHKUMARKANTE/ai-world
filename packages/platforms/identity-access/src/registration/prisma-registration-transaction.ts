import type { DatabaseClient, DatabaseTransactionClient } from '@ai-world/foundation-database';
import type { UserRegistrationWriter } from '@ai-world/platform-user';

import { PrismaIdentityRegistrationWriter } from './prisma-identity-registration-writer';
import type {
  RegistrationTransaction,
  RegistrationTransactionResources,
} from './registration-transaction';

export class PrismaRegistrationTransaction implements RegistrationTransaction {
  constructor(
    private readonly database: DatabaseClient,
    private readonly createUserRegistrationWriter: (
      transaction: DatabaseTransactionClient,
    ) => UserRegistrationWriter,
  ) {}

  execute<TResult>(
    operation: (resources: RegistrationTransactionResources) => Promise<TResult>,
  ): Promise<TResult> {
    return this.database.$transaction(async (transaction) =>
      operation({
        identity: new PrismaIdentityRegistrationWriter(transaction),
        user: this.createUserRegistrationWriter(transaction),
      }),
    );
  }
}
