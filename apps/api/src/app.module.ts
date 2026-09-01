import type { EmailDelivery } from '@ai-world/foundation-email';
import type { StorageObjectStore } from '@ai-world/foundation-storage';
import { FilesystemStorageAdapter } from '@ai-world/foundation-storage/filesystem';
import {
  GenerateText,
  GenerateTextWithAuthorizedContext,
  ReviewAndAcceptGenerationAsKnowledgeResource,
  SuggestKnowledgeResourceCandidate,
  type AiProviderPort,
} from '@ai-world/platform-ai-creator';
import {
  PlatformAuthorizedAiContext,
  PlatformKnowledgeCanonicalAcceptance,
  PrismaGenerationRepository,
} from '@ai-world/platform-ai-creator/infrastructure';
import { createOpenAiProviderAdapter } from '@ai-world/platform-ai-creator/infrastructure/openai';
import {
  AddCollectionResource,
  AddCollectionResourceAsActor,
  AddFavorite,
  AddFavoriteAsActor,
  CreateCollection,
  CreateCollectionAsActor,
  DeleteCollection,
  DeleteCollectionAsActor,
  ListCollectionResources,
  ListCollectionResourcesAsActor,
  ListCollections,
  ListCollectionsAsActor,
  ListFavorites,
  ListFavoritesAsActor,
  RemoveCollectionResource,
  RemoveCollectionResourceAsActor,
  RemoveFavorite,
  RemoveFavoriteAsActor,
} from '@ai-world/platform-engagement';
import {
  PrismaCollectionRepository,
  PrismaFavoriteRepository,
} from '@ai-world/platform-engagement/infrastructure';
import {
  AiAssistedKnowledgeComposition,
  ArchivePage,
  AuthorizeCompositionArchival,
  AuthorizeCompositionEditing,
  AuthorizeCompositionPreview,
  AuthorizeCompositionPublishing,
  CreatePage,
  CreateTextBlock,
  GetBlock,
  GetPage,
  GetPageComposition,
  GetPagePreview,
  PublishPage,
  SetPageComposition,
} from '@ai-world/platform-composition';
import {
  PrismaBlockRepository,
  PrismaPageCompositionRepository,
  PrismaPageRepository,
} from '@ai-world/platform-composition/infrastructure';
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
  ResolveAssetReference,
  ResolvePublicMediaAssetDescriptor,
  UploadAssetAsActor,
} from '@ai-world/platform-media';
import {
  PrismaAssetRepository,
  PrismaMediaAssetUploadTransaction,
  SharpImageThumbnailProcessor,
} from '@ai-world/platform-media/infrastructure';
import {
  ArchiveKnowledgeResource,
  ArchiveKnowledgeResourceAsActor,
  ConfigureKnowledgeEntity,
  ConfigureKnowledgeEntityAsActor,
  CreateKnowledgeResource,
  CreateKnowledgeResourceAsActor,
  GetKnowledgeEntity,
  GetKnowledgeEntityAsActor,
  GetKnowledgeResource,
  GetKnowledgeResourceMedia,
  GetKnowledgeResourceMediaAsActor,
  GetPublicKnowledgeEntity,
  GetPublicKnowledgeEntityByResourceId,
  GetPublicKnowledgeResource,
  ListPublicKnowledgeDiscovery,
  ListPublicKnowledgeResourceAssets,
  ListPublicKnowledgeResources,
  PublishKnowledgeResource,
  PublishKnowledgeResourceAsActor,
  SetKnowledgeResourceMedia,
  SetKnowledgeResourceMediaAsActor,
  UpdateKnowledgeResource,
  UpdateKnowledgeResourceAsActor,
} from '@ai-world/platform-knowledge';
import type { SearchContract } from '@ai-world/platform-discovery';
import { PrismaKnowledgeSearch } from '@ai-world/platform-discovery/infrastructure';
import {
  PrismaKnowledgeEntityRepository,
  PrismaKnowledgeResourceRepository,
} from '@ai-world/platform-knowledge/infrastructure';
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
import { CreatorAiAssistanceController } from './composition/creator-ai-assistance.controller';
import { CreatorCompositionController } from './composition/creator-composition.controller';
import { PublicCompositionController } from './composition/public-composition.controller';
import { DatabaseModule } from './database/database.module';
import { DatabaseService } from './database/database.service';
import {
  PUBLIC_DISCOVERY_SEARCH,
  PublicDiscoverySearchController,
} from './discovery/public-discovery-search.controller';
import { EmailVerificationController } from './email-verification/email-verification.controller';
import { CollectionsController } from './engagement/collections.controller';
import { FavoritesController } from './engagement/favorites.controller';
import { ApiErrorModule } from './errors/api-error.module';
import { HealthController } from './health/health.controller';
import { CreatorKnowledgeEntityController } from './knowledge/creator-knowledge-entity.controller';
import { CreatorKnowledgeController } from './knowledge/creator-knowledge.controller';
import { MediaAssetsController } from './media/media-assets.controller';
import { MediaUploadPreauthorizationGuard } from './media/media-upload-preauthorization.guard';
import { PublicKnowledgeDiscoveryController } from './knowledge/public-knowledge-discovery.controller';
import { PublicKnowledgeEntityController } from './knowledge/public-knowledge-entity.controller';
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

  /**
   * Runtime OpenAI credential consumed only by the API composition root.
   */
  readonly openAiApiKey?: string;

  /**
   * Test/composition override for the provider-neutral AI Port.
   */
  readonly aiProvider?: AiProviderPort;

  /**
   * Normalized Generation provenance key for an injected AI provider.
   */
  readonly aiProviderKey?: string;
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

interface AppAiProvider {
  readonly provider: AiProviderPort;
  readonly providerKey: string;
}

function createAiProvider(options: AppModuleOptions): AppAiProvider {
  if (options.aiProvider) {
    return {
      provider: options.aiProvider,
      providerKey: options.aiProviderKey ?? 'provider.override',
    };
  }

  if (options.openAiApiKey) {
    return {
      provider: createOpenAiProviderAdapter({ apiKey: options.openAiApiKey }),
      providerKey: 'openai',
    };
  }

  return {
    provider: {
      async generateText(): Promise<never> {
        throw new Error('AI provider is not configured for this API runtime.');
      },
    },
    providerKey: 'provider.unconfigured',
  };
}

@Module({})
export class AppModule {
  static register(options: AppModuleOptions): DynamicModule {
    const aiProvider = createAiProvider(options);
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
        FavoritesController,
        CollectionsController,
        AuthorizationController,
        PublicKnowledgeController,
        PublicKnowledgeEntityController,
        PublicKnowledgeDiscoveryController,
        PublicDiscoverySearchController,
        CreatorKnowledgeController,
        CreatorKnowledgeEntityController,
        MediaAssetsController,
        CreatorCompositionController,
        PublicCompositionController,
        CreatorAiAssistanceController,
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
          provide: AuthorizeCompositionEditing,
          inject: [EvaluatePermission],
          useFactory: (evaluatePermission: EvaluatePermission): AuthorizeCompositionEditing => {
            return new AuthorizeCompositionEditing(evaluatePermission);
          },
        },

        {
          provide: AuthorizeCompositionPreview,
          inject: [EvaluatePermission],
          useFactory: (evaluatePermission: EvaluatePermission): AuthorizeCompositionPreview => {
            return new AuthorizeCompositionPreview(evaluatePermission);
          },
        },

        {
          provide: AuthorizeCompositionPublishing,
          inject: [EvaluatePermission],
          useFactory: (evaluatePermission: EvaluatePermission): AuthorizeCompositionPublishing => {
            return new AuthorizeCompositionPublishing(evaluatePermission);
          },
        },

        {
          provide: AuthorizeCompositionArchival,
          inject: [EvaluatePermission],
          useFactory: (evaluatePermission: EvaluatePermission): AuthorizeCompositionArchival => {
            return new AuthorizeCompositionArchival(evaluatePermission);
          },
        },

        {
          provide: PrismaPageRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaPageRepository => {
            return new PrismaPageRepository(database.getClient());
          },
        },

        {
          provide: PrismaGenerationRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaGenerationRepository => {
            return new PrismaGenerationRepository(database.getClient());
          },
        },

        {
          provide: GenerateText,
          inject: [PrismaGenerationRepository, DatabaseService],
          useFactory: (
            generations: PrismaGenerationRepository,
            database: DatabaseService,
          ): GenerateText => {
            return new GenerateText(aiProvider.provider, generations, {
              provider: aiProvider.providerKey,
              permissions: new PrismaAuthorizationRepository(database.getClient()),
            });
          },
        },

        {
          provide: PlatformAuthorizedAiContext,
          inject: [DatabaseService, PUBLIC_DISCOVERY_SEARCH, PrismaKnowledgeResourceRepository],
          useFactory: (
            database: DatabaseService,
            discovery: SearchContract,
            knowledge: PrismaKnowledgeResourceRepository,
          ): PlatformAuthorizedAiContext => {
            return new PlatformAuthorizedAiContext(
              new PrismaUserProfileRepository(database.getClient()),
              discovery,
              knowledge,
            );
          },
        },

        {
          provide: GenerateTextWithAuthorizedContext,
          inject: [PlatformAuthorizedAiContext, GenerateText],
          useFactory: (
            context: PlatformAuthorizedAiContext,
            generateText: GenerateText,
          ): GenerateTextWithAuthorizedContext => {
            return new GenerateTextWithAuthorizedContext(context, generateText);
          },
        },

        {
          provide: SuggestKnowledgeResourceCandidate,
          inject: [GenerateTextWithAuthorizedContext],
          useFactory: (
            generateText: GenerateTextWithAuthorizedContext,
          ): SuggestKnowledgeResourceCandidate => {
            return new SuggestKnowledgeResourceCandidate(generateText);
          },
        },

        {
          provide: PlatformKnowledgeCanonicalAcceptance,
          inject: [CreateKnowledgeResourceAsActor],
          useFactory: (
            createKnowledgeResource: CreateKnowledgeResourceAsActor,
          ): PlatformKnowledgeCanonicalAcceptance => {
            return new PlatformKnowledgeCanonicalAcceptance(createKnowledgeResource);
          },
        },

        {
          provide: ReviewAndAcceptGenerationAsKnowledgeResource,
          inject: [PrismaGenerationRepository, PlatformKnowledgeCanonicalAcceptance],
          useFactory: (
            generations: PrismaGenerationRepository,
            knowledgeOwner: PlatformKnowledgeCanonicalAcceptance,
          ): ReviewAndAcceptGenerationAsKnowledgeResource => {
            return new ReviewAndAcceptGenerationAsKnowledgeResource(generations, knowledgeOwner);
          },
        },

        {
          provide: AiAssistedKnowledgeComposition,
          inject: [
            SuggestKnowledgeResourceCandidate,
            PrismaGenerationRepository,
            ReviewAndAcceptGenerationAsKnowledgeResource,
          ],
          useFactory: (
            suggestions: SuggestKnowledgeResourceCandidate,
            generations: PrismaGenerationRepository,
            acceptance: ReviewAndAcceptGenerationAsKnowledgeResource,
          ): AiAssistedKnowledgeComposition => {
            return new AiAssistedKnowledgeComposition(suggestions, generations, acceptance);
          },
        },

        {
          provide: PrismaBlockRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaBlockRepository => {
            return new PrismaBlockRepository(database.getClient());
          },
        },

        {
          provide: PrismaPageCompositionRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaPageCompositionRepository => {
            return new PrismaPageCompositionRepository(database.getClient());
          },
        },

        {
          provide: CreatePage,
          inject: [PrismaPageRepository],
          useFactory: (repository: PrismaPageRepository): CreatePage => {
            return new CreatePage(repository);
          },
        },

        {
          provide: GetPage,
          inject: [PrismaPageRepository],
          useFactory: (repository: PrismaPageRepository): GetPage => {
            return new GetPage(repository);
          },
        },

        {
          provide: PublishPage,
          inject: [PrismaPageRepository],
          useFactory: (repository: PrismaPageRepository): PublishPage => {
            return new PublishPage(repository, repository);
          },
        },

        {
          provide: ArchivePage,
          inject: [PrismaPageRepository],
          useFactory: (repository: PrismaPageRepository): ArchivePage => {
            return new ArchivePage(repository, repository);
          },
        },

        {
          provide: CreateTextBlock,
          inject: [PrismaBlockRepository],
          useFactory: (repository: PrismaBlockRepository): CreateTextBlock => {
            return new CreateTextBlock(repository);
          },
        },

        {
          provide: GetBlock,
          inject: [PrismaBlockRepository],
          useFactory: (repository: PrismaBlockRepository): GetBlock => {
            return new GetBlock(repository);
          },
        },

        {
          provide: SetPageComposition,
          inject: [
            PrismaPageRepository,
            PrismaBlockRepository,
            PrismaKnowledgeResourceRepository,
            ResolveAssetReference,
            PrismaPageCompositionRepository,
          ],
          useFactory: (
            pages: PrismaPageRepository,
            blocks: PrismaBlockRepository,
            knowledgeResources: PrismaKnowledgeResourceRepository,
            mediaAssets: ResolveAssetReference,
            compositions: PrismaPageCompositionRepository,
          ): SetPageComposition => {
            return new SetPageComposition(
              pages,
              blocks,
              knowledgeResources,
              mediaAssets,
              compositions,
            );
          },
        },

        {
          provide: GetPageComposition,
          inject: [PrismaPageRepository, PrismaPageCompositionRepository],
          useFactory: (
            pages: PrismaPageRepository,
            compositions: PrismaPageCompositionRepository,
          ): GetPageComposition => {
            return new GetPageComposition(pages, compositions);
          },
        },

        {
          provide: GetPagePreview,
          inject: [
            PrismaPageRepository,
            PrismaBlockRepository,
            PrismaKnowledgeResourceRepository,
            ResolveAssetReference,
            PrismaPageCompositionRepository,
          ],
          useFactory: (
            pages: PrismaPageRepository,
            blocks: PrismaBlockRepository,
            knowledgeResources: PrismaKnowledgeResourceRepository,
            mediaAssets: ResolveAssetReference,
            compositions: PrismaPageCompositionRepository,
          ): GetPagePreview => {
            return new GetPagePreview(pages, blocks, knowledgeResources, mediaAssets, compositions);
          },
        },

        {
          provide: PrismaCollectionRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaCollectionRepository => {
            return new PrismaCollectionRepository(database.getClient());
          },
        },

        {
          provide: CreateCollection,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): CreateCollection => {
            return new CreateCollection(repository);
          },
        },

        {
          provide: ListCollections,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): ListCollections => {
            return new ListCollections(repository);
          },
        },

        {
          provide: DeleteCollection,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): DeleteCollection => {
            return new DeleteCollection(repository);
          },
        },

        {
          provide: AddCollectionResource,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): AddCollectionResource => {
            return new AddCollectionResource(repository);
          },
        },

        {
          provide: ListCollectionResources,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): ListCollectionResources => {
            return new ListCollectionResources(repository);
          },
        },

        {
          provide: RemoveCollectionResource,
          inject: [PrismaCollectionRepository],
          useFactory: (repository: PrismaCollectionRepository): RemoveCollectionResource => {
            return new RemoveCollectionResource(repository);
          },
        },

        {
          provide: CreateCollectionAsActor,
          inject: [GetUserProfile, CreateCollection],
          useFactory: (
            getUserProfile: GetUserProfile,
            createCollection: CreateCollection,
          ): CreateCollectionAsActor => {
            return new CreateCollectionAsActor(getUserProfile, createCollection);
          },
        },

        {
          provide: ListCollectionsAsActor,
          inject: [GetUserProfile, ListCollections],
          useFactory: (
            getUserProfile: GetUserProfile,
            listCollections: ListCollections,
          ): ListCollectionsAsActor => {
            return new ListCollectionsAsActor(getUserProfile, listCollections);
          },
        },

        {
          provide: DeleteCollectionAsActor,
          inject: [GetUserProfile, DeleteCollection],
          useFactory: (
            getUserProfile: GetUserProfile,
            deleteCollection: DeleteCollection,
          ): DeleteCollectionAsActor => {
            return new DeleteCollectionAsActor(getUserProfile, deleteCollection);
          },
        },

        {
          provide: AddCollectionResourceAsActor,
          inject: [GetUserProfile, AddCollectionResource],
          useFactory: (
            getUserProfile: GetUserProfile,
            addCollectionResource: AddCollectionResource,
          ): AddCollectionResourceAsActor => {
            return new AddCollectionResourceAsActor(getUserProfile, addCollectionResource);
          },
        },

        {
          provide: ListCollectionResourcesAsActor,
          inject: [GetUserProfile, ListCollectionResources],
          useFactory: (
            getUserProfile: GetUserProfile,
            listCollectionResources: ListCollectionResources,
          ): ListCollectionResourcesAsActor => {
            return new ListCollectionResourcesAsActor(getUserProfile, listCollectionResources);
          },
        },

        {
          provide: RemoveCollectionResourceAsActor,
          inject: [GetUserProfile, RemoveCollectionResource],
          useFactory: (
            getUserProfile: GetUserProfile,
            removeCollectionResource: RemoveCollectionResource,
          ): RemoveCollectionResourceAsActor => {
            return new RemoveCollectionResourceAsActor(getUserProfile, removeCollectionResource);
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
          provide: PrismaFavoriteRepository,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): PrismaFavoriteRepository => {
            return new PrismaFavoriteRepository(database.getClient());
          },
        },

        {
          provide: AddFavorite,
          inject: [PrismaFavoriteRepository],
          useFactory: (repository: PrismaFavoriteRepository): AddFavorite => {
            return new AddFavorite(repository);
          },
        },

        {
          provide: ListFavorites,
          inject: [PrismaFavoriteRepository],
          useFactory: (repository: PrismaFavoriteRepository): ListFavorites => {
            return new ListFavorites(repository);
          },
        },

        {
          provide: RemoveFavorite,
          inject: [PrismaFavoriteRepository],
          useFactory: (repository: PrismaFavoriteRepository): RemoveFavorite => {
            return new RemoveFavorite(repository);
          },
        },

        {
          provide: AddFavoriteAsActor,
          inject: [GetUserProfile, AddFavorite],
          useFactory: (
            getUserProfile: GetUserProfile,
            addFavorite: AddFavorite,
          ): AddFavoriteAsActor => {
            return new AddFavoriteAsActor(getUserProfile, addFavorite);
          },
        },

        {
          provide: ListFavoritesAsActor,
          inject: [GetUserProfile, ListFavorites],
          useFactory: (
            getUserProfile: GetUserProfile,
            listFavorites: ListFavorites,
          ): ListFavoritesAsActor => {
            return new ListFavoritesAsActor(getUserProfile, listFavorites);
          },
        },

        {
          provide: RemoveFavoriteAsActor,
          inject: [GetUserProfile, RemoveFavorite],
          useFactory: (
            getUserProfile: GetUserProfile,
            removeFavorite: RemoveFavorite,
          ): RemoveFavoriteAsActor => {
            return new RemoveFavoriteAsActor(getUserProfile, removeFavorite);
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
          provide: ResolveAssetReference,
          inject: [PrismaAssetRepository],
          useFactory: (repository: PrismaAssetRepository): ResolveAssetReference => {
            return new ResolveAssetReference(repository);
          },
        },

        {
          provide: ResolvePublicMediaAssetDescriptor,
          inject: [PrismaAssetRepository],
          useFactory: (repository: PrismaAssetRepository): ResolvePublicMediaAssetDescriptor => {
            return new ResolvePublicMediaAssetDescriptor(repository);
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
          provide: UploadAssetAsActor,
          inject: [EvaluatePermission, DatabaseService],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            database: DatabaseService,
          ): UploadAssetAsActor => {
            return new UploadAssetAsActor(
              evaluatePermission,
              new PrismaMediaAssetUploadTransaction(
                database.getClient(),
                (transaction) => new PrismaAuditRecorder(transaction),
              ),
              storageObjectStore,
            );
          },
        },

        {
          provide: PUBLIC_DISCOVERY_SEARCH,
          inject: [DatabaseService],
          useFactory: (database: DatabaseService): SearchContract => {
            return new PrismaKnowledgeSearch(database.getClient());
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
          provide: PrismaKnowledgeEntityRepository,
          inject: [DatabaseService, ResolvePublicMediaAssetDescriptor],
          useFactory: (
            database: DatabaseService,
            mediaDescriptors: ResolvePublicMediaAssetDescriptor,
          ): PrismaKnowledgeEntityRepository => {
            return new PrismaKnowledgeEntityRepository(database.getClient(), mediaDescriptors);
          },
        },

        {
          provide: GetKnowledgeResourceMedia,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (
            repository: PrismaKnowledgeResourceRepository,
          ): GetKnowledgeResourceMedia => {
            return new GetKnowledgeResourceMedia(repository, repository);
          },
        },

        {
          provide: GetKnowledgeResourceMediaAsActor,
          inject: [EvaluatePermission, GetKnowledgeResourceMedia],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            getKnowledgeResourceMedia: GetKnowledgeResourceMedia,
          ): GetKnowledgeResourceMediaAsActor => {
            return new GetKnowledgeResourceMediaAsActor(
              evaluatePermission,
              getKnowledgeResourceMedia,
            );
          },
        },

        {
          provide: SetKnowledgeResourceMedia,
          inject: [PrismaKnowledgeResourceRepository, ResolveAssetReference],
          useFactory: (
            repository: PrismaKnowledgeResourceRepository,
            resolveAssetReference: ResolveAssetReference,
          ): SetKnowledgeResourceMedia => {
            return new SetKnowledgeResourceMedia(repository, repository, resolveAssetReference);
          },
        },

        {
          provide: SetKnowledgeResourceMediaAsActor,
          inject: [EvaluatePermission, SetKnowledgeResourceMedia],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            setKnowledgeResourceMedia: SetKnowledgeResourceMedia,
          ): SetKnowledgeResourceMediaAsActor => {
            return new SetKnowledgeResourceMediaAsActor(
              evaluatePermission,
              setKnowledgeResourceMedia,
            );
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
          provide: GetKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (repository: PrismaKnowledgeResourceRepository): GetKnowledgeResource => {
            return new GetKnowledgeResource(repository);
          },
        },

        {
          provide: PublishKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (repository: PrismaKnowledgeResourceRepository): PublishKnowledgeResource => {
            return new PublishKnowledgeResource(repository, repository);
          },
        },

        {
          provide: PublishKnowledgeResourceAsActor,
          inject: [EvaluatePermission, PublishKnowledgeResource],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            publishKnowledgeResource: PublishKnowledgeResource,
          ): PublishKnowledgeResourceAsActor => {
            return new PublishKnowledgeResourceAsActor(
              evaluatePermission,
              publishKnowledgeResource,
            );
          },
        },

        {
          provide: ArchiveKnowledgeResource,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (repository: PrismaKnowledgeResourceRepository): ArchiveKnowledgeResource => {
            return new ArchiveKnowledgeResource(repository, repository);
          },
        },

        {
          provide: ArchiveKnowledgeResourceAsActor,
          inject: [EvaluatePermission, ArchiveKnowledgeResource],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            archiveKnowledgeResource: ArchiveKnowledgeResource,
          ): ArchiveKnowledgeResourceAsActor => {
            return new ArchiveKnowledgeResourceAsActor(
              evaluatePermission,
              archiveKnowledgeResource,
            );
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
          provide: ConfigureKnowledgeEntity,
          inject: [PrismaKnowledgeResourceRepository, PrismaKnowledgeEntityRepository],
          useFactory: (
            resources: PrismaKnowledgeResourceRepository,
            entities: PrismaKnowledgeEntityRepository,
          ): ConfigureKnowledgeEntity => {
            return new ConfigureKnowledgeEntity(resources, entities);
          },
        },

        {
          provide: ConfigureKnowledgeEntityAsActor,
          inject: [EvaluatePermission, ConfigureKnowledgeEntity],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            configureKnowledgeEntity: ConfigureKnowledgeEntity,
          ): ConfigureKnowledgeEntityAsActor => {
            return new ConfigureKnowledgeEntityAsActor(
              evaluatePermission,
              configureKnowledgeEntity,
            );
          },
        },

        {
          provide: GetKnowledgeEntity,
          inject: [PrismaKnowledgeEntityRepository],
          useFactory: (entities: PrismaKnowledgeEntityRepository): GetKnowledgeEntity => {
            return new GetKnowledgeEntity(entities);
          },
        },

        {
          provide: GetKnowledgeEntityAsActor,
          inject: [EvaluatePermission, GetKnowledgeEntity],
          useFactory: (
            evaluatePermission: EvaluatePermission,
            getKnowledgeEntity: GetKnowledgeEntity,
          ): GetKnowledgeEntityAsActor => {
            return new GetKnowledgeEntityAsActor(evaluatePermission, getKnowledgeEntity);
          },
        },

        {
          provide: GetPublicKnowledgeEntity,
          inject: [PrismaKnowledgeEntityRepository],
          useFactory: (entities: PrismaKnowledgeEntityRepository): GetPublicKnowledgeEntity => {
            return new GetPublicKnowledgeEntity(entities);
          },
        },

        {
          provide: GetPublicKnowledgeEntityByResourceId,
          inject: [PrismaKnowledgeEntityRepository],
          useFactory: (
            entities: PrismaKnowledgeEntityRepository,
          ): GetPublicKnowledgeEntityByResourceId => {
            return new GetPublicKnowledgeEntityByResourceId(entities);
          },
        },

        {
          provide: ListPublicKnowledgeDiscovery,
          inject: [PrismaKnowledgeEntityRepository],
          useFactory: (
            repository: PrismaKnowledgeEntityRepository,
          ): ListPublicKnowledgeDiscovery => {
            return new ListPublicKnowledgeDiscovery(repository);
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
          provide: ListPublicKnowledgeResourceAssets,
          inject: [PrismaKnowledgeResourceRepository],
          useFactory: (
            repository: PrismaKnowledgeResourceRepository,
          ): ListPublicKnowledgeResourceAssets => {
            return new ListPublicKnowledgeResourceAssets(repository, repository);
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
