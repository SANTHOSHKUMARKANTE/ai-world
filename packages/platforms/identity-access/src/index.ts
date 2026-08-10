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
