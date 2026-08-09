import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';

export interface AppModuleOptions {
  readonly databaseUrl: string;
}

@Module({})
export class AppModule {
  static register(options: AppModuleOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        DatabaseModule.register({
          connectionString: options.databaseUrl,
        }),
      ],
      controllers: [AppController],
      providers: [AppService],
    };
  }
}
