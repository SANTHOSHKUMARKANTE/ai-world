import type { LogLevel } from '@ai-world/foundation-observability';
import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ObservabilityModule } from './observability/observability.module';
import { ApiErrorModule } from './errors/api-error.module';
import { HealthController } from './health/health.controller';

export interface AppModuleOptions {
  readonly databaseUrl: string;
  readonly environment: string;
  readonly logLevel: LogLevel;
}

@Module({})
export class AppModule {
  static register(options: AppModuleOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ObservabilityModule.register({
          environment: options.environment,
          logLevel: options.logLevel,
        }),

        ApiErrorModule,

        DatabaseModule.register({
          connectionString: options.databaseUrl,
        }),
      ],
      controllers: [AppController, HealthController],
      providers: [AppService],
    };
  }
}
