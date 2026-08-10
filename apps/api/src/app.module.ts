import { type LogLevel } from '@ai-world/foundation-observability';
import { AuthenticatePassword, RegisterUser } from '@ai-world/platform-identity-access';
import {
  ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH,
  Argon2idPasswordHasher,
  Argon2idPasswordVerifier,
  PrismaPasswordAuthenticationReader,
  PrismaRegistrationTransaction,
} from '@ai-world/platform-identity-access/infrastructure';
import { PrismaUserRegistrationWriter } from '@ai-world/platform-user/infrastructure';
import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasswordAuthenticationController } from './authentication/password-authentication.controller';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { ApiErrorModule } from './errors/api-error.module';
import { HealthController } from './health/health.controller';
import { ObservabilityModule } from './observability/observability.module';
import { RegistrationController } from './registration/registration.controller';

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

      controllers: [
        AppController,
        HealthController,
        RegistrationController,
        PasswordAuthenticationController,
      ],

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

        {
          provide: AuthenticatePassword,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): AuthenticatePassword => {
            return new AuthenticatePassword(
              new PrismaPasswordAuthenticationReader(database.getClient()),
              new Argon2idPasswordVerifier(),
              ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH,
            );
          },
        },
      ],
    };
  }
}
