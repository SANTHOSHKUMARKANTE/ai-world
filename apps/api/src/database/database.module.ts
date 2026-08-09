import { DynamicModule, Module } from '@nestjs/common';

import { DatabaseService } from './database.service';
import { DATABASE_CONNECTION_STRING } from './database.tokens';

export interface DatabaseModuleOptions {
  readonly connectionString: string;
}

@Module({})
export class DatabaseModule {
  static register(options: DatabaseModuleOptions): DynamicModule {
    return {
      module: DatabaseModule,
      providers: [
        {
          provide: DATABASE_CONNECTION_STRING,
          useValue: options.connectionString,
        },
        DatabaseService,
      ],
      exports: [DatabaseService],
    };
  }
}
