import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';

import { DATABASE_CONNECTION_STRING } from './database.tokens';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  private readonly database: DatabaseClient;

  constructor(
    @Inject(DATABASE_CONNECTION_STRING)
    connectionString: string,
  ) {
    this.database = createDatabaseClient({
      connectionString,
    });
  }

  getClient(): DatabaseClient {
    return this.database;
  }

  async checkReadiness(): Promise<void> {
    await this.database.$queryRaw`SELECT 1`;
  }

  async onApplicationShutdown(): Promise<void> {
    await this.database.$disconnect();
  }
}
