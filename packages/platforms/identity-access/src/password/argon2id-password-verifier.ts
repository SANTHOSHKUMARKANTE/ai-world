import * as argon2 from 'argon2';

import type { PasswordVerifier } from './password-verifier';

export const ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$YWl3b3JsZC1hdXRoLXNhbHQ$7tKnJX8FGpwhuWlpINQ9QnoV3o/LeeXsgpISO1OsM/I';

export class Argon2idPasswordVerifier implements PasswordVerifier {
  verify(password: string, passwordHash: string): Promise<boolean> {
    return argon2.verify(passwordHash, password);
  }
}
