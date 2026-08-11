export type { Actor } from './actor';

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
