import { type LogLevel } from '@ai-world/foundation-observability';
import { RegisterUser } from '@ai-world/platform-identity-access';
import {
  Argon2idPasswordHasher,
  PrismaRegistrationTransaction,
} from '@ai-world/platform-identity-access/infrastructure';
import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { ApiErrorModule } from './errors/api-error.module';
import { HealthController } from './health/health.controller';
import { ObservabilityModule } from './observability/observability.module';
import { RegistrationController } from './registration/registration.controller';
import { PrismaUserRegistrationWriter } from '@ai-world/platform-user/infrastructure';

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

      controllers: [AppController, HealthController, RegistrationController],

      providers: [
        AppService,

        {
          provide: RegisterUser,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): RegisterUser => {
            return new RegisterUser(
              new PrismaRegistrationTransaction(
                database.getClient(),
                (transaction) => new PrismaUserRegistrationWriter(transaction),
              ),
              new Argon2idPasswordHasher(),
            );
          },
        },
      ],
    };
  }
}
