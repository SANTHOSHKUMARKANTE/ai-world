import type { EmailDelivery } from '@ai-world/foundation-email';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { FilesystemStorageAdapter } from '@ai-world/foundation-storage/filesystem';
import { SmtpEmailDelivery, type SmtpEmailDeliveryOptions } from '@ai-world/foundation-email/smtp';
import { type LogLevel } from '@ai-world/foundation-observability';
import { PrismaAuditRecorder } from '@ai-world/kernel-audit/infrastructure';
import {
  AssignRoleToActor,
  AssignRoleToActorAsActor,
  AuthenticatePassword,
  ConfirmEmailVerification,
  CreateSession,
  EvaluatePermission,
  IssueEmailVerification,
  IssuePasswordRecovery,
  LogoutSession,
  RegisterUser,
  ResetPasswordWithRecovery,
  SignInWithPassword,
  ValidateSession,
} from '@ai-world/platform-identity-access';
import {
  ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH,
  Argon2idPasswordHasher,
  Argon2idPasswordVerifier,
  NodeEmailVerificationTokenGenerator,
  NodePasswordRecoveryTokenGenerator,
  NodeSessionTokenGenerator,
  PrismaAuthorizationRepository,
  PrismaEmailVerificationConfirmationTransaction,
  PrismaEmailVerificationRepository,
  PrismaPasswordAuthenticationReader,
  PrismaPasswordRecoveryRepository,
  PrismaPasswordRecoveryResetTransaction,
  PrismaRegistrationTransaction,
  PrismaSessionRepository,
  Sha256EmailVerificationTokenDigester,
  Sha256PasswordRecoveryTokenDigester,
  Sha256SessionTokenDigester,
  SystemEmailVerificationClock,
  SystemPasswordRecoveryClock,
  SystemSessionClock,
} from '@ai-world/platform-identity-access/infrastructure';
import {
  DeliverAsset,
  GenerateImageThumbnail,
  UploadAsset,
  UploadAssetAsActor,
} from '@ai-world/platform-media';
import {
  PrismaAssetRepository,
  SharpImageThumbnailProcessor,
} from '@ai-world/platform-media/infrastructure';
import {
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
  GetPublicKnowledgeResource,
  ListPublicKnowledgeResources,
  UpdateKnowledgeResource,
  UpdateKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import { PrismaKnowledgeResourceRepository } from '@ai-world/platform-knowledge/infrastructure';
import { GetUserProfile, UpdateUserProfile } from '@ai-world/platform-user';
import {
  PrismaUserProfileRepository,
  PrismaUserRegistrationWriter,
} from '@ai-world/platform-user/infrastructure';
import { DynamicModule, Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PasswordAuthenticationController } from './authentication/password-authentication.controller';
import { AuthorizationController } from './authorization/authorization.controller';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import { EmailVerificationController } from './email-verification/email-verification.controller';
import { ApiErrorModule } from './errors/api-error.module';
import { HealthController } from './health/health.controller';
import { CreatorKnowledgeController } from './knowledge/creator-knowledge.controller';
import { MediaAssetsController } from './media/media-assets.controller';
import { MediaUploadPreauthorizationGuard } from './media/media-upload-preauthorization.guard';
import { PublicKnowledgeController } from './knowledge/public-knowledge.controller';
import { ObservabilityModule } from './observability/observability.module';
import { PasswordRecoveryController } from './password-recovery/password-recovery.controller';
import { RegistrationController } from './registration/registration.controller';
import { SessionController } from './session/session.controller';
import { SessionCookie } from './session/session-cookie';
import { UserProfileController } from './user-profile/user-profile.controller';

export interface AppEmailOptions {
  readonly smtp: Omit<SmtpEmailDeliveryOptions, 'from'>;
  readonly from: string;
}

export interface AppModuleOptions {
  readonly databaseUrl: string;
  readonly environment: string;
  readonly logLevel: LogLevel;

  /**
   * Development/runtime filesystem root for Storage Foundation.
   */
  readonly storageRootDirectory?: string;

  /**
   * Test/composition override for provider-neutral Storage.
   */
  readonly storageObjectStore?: StorageObjectStore;

  /**
   * Production/runtime configuration.
   *
   * Existing API tests do not need to supply this unless they exercise
   * email delivery. main.ts supplies the parsed environment explicitly.
   */
  readonly email?: AppEmailOptions;

  /**
   * Test/composition override that avoids real SMTP delivery.
   */
  readonly emailDelivery?: EmailDelivery;
}

const DEFAULT_LOCAL_EMAIL_OPTIONS: AppEmailOptions = {
  smtp: {
    host: '127.0.0.1',
    port: 1025,
    secure: false,
  },
  from: 'AI World <noreply@ai-world.local>',
};

function createStorageObjectStore(options: AppModuleOptions): StorageObjectStore {
  if (options.storageObjectStore) {
    return options.storageObjectStore;
  }

  return new FilesystemStorageAdapter({
    rootDirectory: options.storageRootDirectory ?? './uploads',
  });
}

function createEmailDelivery(options: AppModuleOptions): EmailDelivery {
  if (options.emailDelivery) {
    return options.emailDelivery;
  }

  const email = options.email ?? DEFAULT_LOCAL_EMAIL_OPTIONS;

  return new SmtpEmailDelivery({
    ...email.smtp,
    from: email.from,
  });
}

@Module({})
export class AppModule {
  static register(options: AppModuleOptions): DynamicModule {
    const emailDelivery = createEmailDelivery(options);
    const storageObjectStore = createStorageObjectStore(options);

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
        SessionController,
        EmailVerificationController,
        PasswordRecoveryController,
        UserProfileController,
        AuthorizationController,
        PublicKnowledgeController,
        CreatorKnowledgeController,
        MediaAssetsController,
      ],

      providers: [
        MediaUploadPreauthorizationGuard,
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

        {
          provide: CreateSession,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): CreateSession => {
            return new CreateSession(
              new PrismaSessionRepository(database.getClient()),
              new NodeSessionTokenGenerator(),
              new Sha256SessionTokenDigester(),
              new SystemSessionClock(),
            );
          },
        },

        {
          provide: SignInWithPassword,
          inject: [AuthenticatePassword, CreateSession],
          useFactory: (
            authenticatePassword: AuthenticatePassword,
            createSession: CreateSession,
          ): SignInWithPassword => {
            return new SignInWithPassword(authenticatePassword, createSession);
          },
        },

        {
          provide: ValidateSession,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): ValidateSession => {
            return new ValidateSession(
              new PrismaSessionRepository(database.getClient()),
              new Sha256SessionTokenDigester(),
              new SystemSessionClock(),
            );
          },
        },

        {
          provide: LogoutSession,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): LogoutSession => {
            return new LogoutSession(
              new PrismaSessionRepository(database.getClient()),
              new Sha256SessionTokenDigester(),
              new SystemSessionClock(),
            );
          },
        },

        {
          provide: AssignRoleToActor,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): AssignRoleToActor => {
            return new AssignRoleToActor(new PrismaAuthorizationRepository(database.getClient()));
          },
        },

        {
          provide: EvaluatePermission,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): EvaluatePermission => {
            return new EvaluatePermission(new PrismaAuthorizationRepository(database.getClient()));
          },
        },

        {
          provide: AssignRoleToActorAsActor,
          inject: [EvaluatePermission, AssignRoleToActor, DatabaseService],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            assignRoleToActor: AssignRoleToActor,
            database: DatabaseService,
          ): AssignRoleToActorAsActor => {
            return new AssignRoleToActorAsActor(
              evaluatePermission,
              assignRoleToActor,
              new PrismaAuditRecorder(database.getClient()),
            );
          },
        },

        {
          provide: IssueEmailVerification,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): IssueEmailVerification => {
            const repository = new PrismaEmailVerificationRepository(database.getClient());

            return new IssueEmailVerification(
              repository,
              repository,
              new NodeEmailVerificationTokenGenerator(),
              new Sha256EmailVerificationTokenDigester(),
              new SystemEmailVerificationClock(),
              emailDelivery,
            );
          },
        },

        {
          provide: ConfirmEmailVerification,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): ConfirmEmailVerification => {
            return new ConfirmEmailVerification(
              new PrismaEmailVerificationConfirmationTransaction(database.getClient()),
              new Sha256EmailVerificationTokenDigester(),
              new SystemEmailVerificationClock(),
            );
          },
        },

        {
          provide: IssuePasswordRecovery,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): IssuePasswordRecovery => {
            const repository = new PrismaPasswordRecoveryRepository(database.getClient());

            return new IssuePasswordRecovery(
              repository,
              repository,
              new NodePasswordRecoveryTokenGenerator(),
              new Sha256PasswordRecoveryTokenDigester(),
              new SystemPasswordRecoveryClock(),
              emailDelivery,
            );
          },
        },

        {
          provide: ResetPasswordWithRecovery,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): ResetPasswordWithRecovery => {
            return new ResetPasswordWithRecovery(
              new PrismaPasswordRecoveryResetTransaction(database.getClient()),
              new Sha256PasswordRecoveryTokenDigester(),
              new Argon2idPasswordHasher(),
              new SystemPasswordRecoveryClock(),
            );
          },
        },

        {
          provide: GetUserProfile,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): GetUserProfile => {
            return new GetUserProfile(new PrismaUserProfileRepository(database.getClient()));
          },
        },

        {
          provide: UpdateUserProfile,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): UpdateUserProfile => {
            return new UpdateUserProfile(new PrismaUserProfileRepository(database.getClient()));
          },
        },

        {
          provide: PrismaAssetRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaAssetRepository => {
            return new PrismaAssetRepository(database.getClient());
          },
        },

        {
          provide: DeliverAsset,
          inject: [PrismaAssetRepository],
          useFactory: (repository: PrismaAssetRepository): DeliverAsset => {
            return new DeliverAsset(repository, storageObjectStore);
          },
        },

        {
          provide: GenerateImageThumbnail,
          inject: [PrismaAssetRepository],
          useFactory: (repository: PrismaAssetRepository): GenerateImageThumbnail => {
            return new GenerateImageThumbnail(
              repository,
              storageObjectStore,
              new SharpImageThumbnailProcessor(),
            );
          },
        },

        {
          provide: UploadAsset,
          inject: [PrismaAssetRepository],
          useFactory: (repository: PrismaAssetRepository): UploadAsset => {
            return new UploadAsset(repository, storageObjectStore);
          },
        },

        {
          provide: UploadAssetAsActor,
          inject: [EvaluatePermission, UploadAsset],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            uploadAsset: UploadAsset,
          ): UploadAssetAsActor => {
            return new UploadAssetAsActor(evaluatePermission, uploadAsset);
          },
        },

        {
          provide: PrismaKnowledgeResourceRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaKnowledgeResourceRepository => {
            return new PrismaKnowledgeResourceRepository(database.getClient());
          },
        },

        {
          provide: CreateKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (repository: PrismaKnowledgeResourceRepository): CreateKnowledgeResource => {
            return new CreateKnowledgeResource(repository);
          },
        },

        {
          provide: CreateKnowledgeResourceAsActor,
          inject: [EvaluatePermission, CreateKnowledgeResource],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            createKnowledgeResource: CreateKnowledgeResource,
          ): CreateKnowledgeResourceAsActor => {
            return new CreateKnowledgeResourceAsActor(evaluatePermission, createKnowledgeResource);
          },
        },

        {
          provide: UpdateKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (repository: PrismaKnowledgeResourceRepository): UpdateKnowledgeResource => {
            return new UpdateKnowledgeResource(repository);
          },
        },

        {
          provide: UpdateKnowledgeResourceAsActor,
          inject: [EvaluatePermission, UpdateKnowledgeResource],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            updateKnowledgeResource: UpdateKnowledgeResource,
          ): UpdateKnowledgeResourceAsActor => {
            return new UpdateKnowledgeResourceAsActor(evaluatePermission, updateKnowledgeResource);
          },
        },

        {
          provide: GetPublicKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (
            repository: PrismaKnowledgeResourceRepository,
          ): GetPublicKnowledgeResource => {
            return new GetPublicKnowledgeResource(repository);
          },
        },

        {
          provide: ListPublicKnowledgeResources,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (
            repository: PrismaKnowledgeResourceRepository,
          ): ListPublicKnowledgeResources => {
            return new ListPublicKnowledgeResources(repository);
          },
        },

        {
          provide: SessionCookie,
          useFactory: (): SessionCookie => {
            return new SessionCookie(options.environment);
          },
        },
      ],
    };
  }
}
