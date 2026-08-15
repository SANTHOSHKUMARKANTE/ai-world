export type { Actor } from './actor';

export {
  ADMINISTRATOR_ROLE_KEY,
  IDENTITY_AUTHORIZATION_MANAGE_PERMISSION_KEY,
  KNOWLEDGE_EDITOR_ROLE_KEY,
} from './authorization/authorization-policy';

export {
  AssignRoleToActorAsActor,
  type AssignRoleToActorAsActorInput,
} from './authorization/assign-role-to-actor-as-actor';

export {
  AssignRoleToActor,
  type AssignRoleToActorInput,
} from './authorization/assign-role-to-actor';

export {
  EvaluatePermission,
  type EvaluatePermissionInput,
  type EvaluatePermissionResult,
} from './authorization/evaluate-permission';

export type { Permission } from './authorization/permission';

export type {
  EvaluateActorPermissionInput,
  PermissionEvaluationReader,
} from './authorization/permission-evaluation-reader';

export type {
  AssignActorRoleInput,
  AssignActorRoleResult,
  RoleAssignmentWriter,
} from './authorization/role-assignment-writer';

export type { Role } from './authorization/role';

export type { PasswordHasher } from './password/password-hasher';

export {
  normalizeAndValidateRegistrationPassword,
  REGISTRATION_PASSWORD_MAX_LENGTH,
  REGISTRATION_PASSWORD_MIN_LENGTH,
} from './password/password-policy';

export {
  normalizeAndValidateRegistrationEmail,
  REGISTRATION_EMAIL_MAX_LENGTH,
  type RegistrationEmail,
} from './registration/registration-email';

export {
  RegisterUser,
  type RegisterUserInput,
  type RegisterUserResult,
} from './registration/register-user';

export type {
  CreateActorEmailInput,
  CreatePasswordCredentialInput,
  IdentityRegistrationWriter,
  RegistrationTransaction,
  RegistrationTransactionResources,
} from './registration/registration-transaction';

export {
  AuthenticatePassword,
  type AuthenticatePasswordInput,
  type AuthenticatePasswordResult,
} from './authentication/authenticate-password';

export {
  normalizeAuthenticationEmail,
  normalizeAuthenticationPassword,
} from './authentication/authentication-input';

export type {
  PasswordAuthenticationCredential,
  PasswordAuthenticationReader,
} from './authentication/password-authentication-reader';

export type { PasswordVerifier } from './password/password-verifier';

export type { SessionTokenGenerator } from './session/session-token-generator';

export type { SessionTokenDigester } from './session/session-token-digester';

export {
  CreateSession,
  SESSION_ABSOLUTE_TTL_MILLISECONDS,
  type CreateSessionInput,
  type CreateSessionResult,
} from './session/create-session';

export type { SessionClock } from './session/session-clock';

export type {
  CreatedSessionRecord,
  CreateSessionRecordInput,
  SessionRepository,
} from './session/session-repository';

export {
  ValidateSession,
  type ValidateSessionInput,
  type ValidateSessionResult,
} from './session/validate-session';

export type {
  SessionValidationReader,
  SessionValidationRecord,
} from './session/session-validation-reader';

export { LogoutSession, type LogoutSessionInput } from './session/logout-session';

export { RevokeSession, type RevokeSessionInput } from './session/revoke-session';

export type {
  RevokeSessionByActorInput,
  RevokeSessionByTokenDigestInput,
  SessionRevocationWriter,
} from './session/session-revocation-writer';

export {
  SignInWithPassword,
  type SignInWithPasswordInput,
  type SignInWithPasswordResult,
} from './authentication/sign-in-with-password';

export type { EmailVerificationTokenDigester } from './email-verification/email-verification-token-digester';

export type { EmailVerificationTokenGenerator } from './email-verification/email-verification-token-generator';

export type {
  EmailVerificationChallengeWriter,
  UpsertEmailVerificationChallengeInput,
} from './email-verification/email-verification-challenge-writer';

export type { EmailVerificationClock } from './email-verification/email-verification-clock';

export type {
  EmailVerificationActorEmail,
  EmailVerificationReader,
} from './email-verification/email-verification-reader';

export {
  EMAIL_VERIFICATION_ABSOLUTE_TTL_MILLISECONDS,
  IssueEmailVerification,
  type IssueEmailVerificationInput,
  type IssueEmailVerificationResult,
} from './email-verification/issue-email-verification';

export {
  ConfirmEmailVerification,
  type ConfirmEmailVerificationInput,
} from './email-verification/confirm-email-verification';

export type {
  ConfirmEmailVerificationTransactionInput,
  EmailVerificationConfirmationTransaction,
} from './email-verification/email-verification-confirmation-transaction';

export type { PasswordRecoveryTokenGenerator } from './recovery/password-recovery-token-generator';

export type { PasswordRecoveryTokenDigester } from './recovery/password-recovery-token-digester';

export {
  normalizePasswordRecoveryEmail,
  PASSWORD_RECOVERY_EMAIL_MAX_LENGTH,
} from './recovery/password-recovery-email';

export type {
  PasswordRecoveryActorEmail,
  PasswordRecoveryReader,
} from './recovery/password-recovery-reader';

export type {
  PasswordRecoveryChallengeWriter,
  UpsertPasswordRecoveryChallengeInput,
} from './recovery/password-recovery-challenge-writer';

export type { PasswordRecoveryClock } from './recovery/password-recovery-clock';

export {
  IssuePasswordRecovery,
  PASSWORD_RECOVERY_ABSOLUTE_TTL_MILLISECONDS,
  type IssuePasswordRecoveryInput,
} from './recovery/issue-password-recovery';

export {
  normalizeAndValidatePasswordRecoveryPassword,
  PASSWORD_RECOVERY_PASSWORD_MAX_LENGTH,
  PASSWORD_RECOVERY_PASSWORD_MIN_LENGTH,
} from './recovery/password-recovery-password';

export type {
  PasswordRecoveryResetTransaction,
  ResetPasswordWithRecoveryTransactionInput,
} from './recovery/password-recovery-reset-transaction';

export {
  ResetPasswordWithRecovery,
  type ResetPasswordWithRecoveryInput,
} from './recovery/reset-password-with-recovery';
