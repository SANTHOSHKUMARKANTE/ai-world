import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { DynamicModule, Inject, Injectable, Module, OnApplicationShutdown } from '@nestjs/common';

const DATABASE_CLIENT = Symbol('DATABASE_CLIENT');

export interface DatabaseModuleOptions {
  readonly connectionString: string;
}

@Injectable()
class DatabaseClientLifecycle implements OnApplicationShutdown {
  constructor(
    @Inject(DATABASE_CLIENT)
    private readonly client: DatabaseClient,
  ) {}

  async onApplicationShutdown(): Promise<void> {
    await this.client.$disconnect();
  }
}

@Module({})
export class DatabaseModule {
  static register(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_CLIENT,
          useFactory: () =>
            createDatabaseClient({
              connectionString: options.connectionString,
            }),
        },
        DatabaseClientLifecycle,
      ],
    };
  }
}
