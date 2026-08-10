import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from './generated/prisma/client';
import type { TransactionClient } from './generated/prisma/internal/prismaNamespace';

export interface DatabaseClientOptions {
  readonly connectionString: string;
}

export function createDatabaseClient(options: DatabaseClientOptions): PrismaClient {
  const adapter = new PrismaPg({
    connectionString: options.connectionString,
  });

  return new PrismaClient({ adapter });
}

export type DatabaseClient = ReturnType<typeof createDatabaseClient>;
export type DatabaseTransactionClient = TransactionClient;
