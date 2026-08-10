import * as argon2 from 'argon2';

import type { PasswordHasher } from './password-hasher';

export const ARGON2ID_PASSWORD_HASH_MEMORY_COST = 19 * 1024;
export const ARGON2ID_PASSWORD_HASH_TIME_COST = 2;
export const ARGON2ID_PASSWORD_HASH_PARALLELISM = 1;
export const ARGON2ID_PASSWORD_HASH_LENGTH = 32;
export const ARGON2ID_PASSWORD_HASH_VERSION = 0x13;

export class Argon2idPasswordHasher implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: ARGON2ID_PASSWORD_HASH_MEMORY_COST,
      timeCost: ARGON2ID_PASSWORD_HASH_TIME_COST,
      parallelism: ARGON2ID_PASSWORD_HASH_PARALLELISM,
      hashLength: ARGON2ID_PASSWORD_HASH_LENGTH,
      version: ARGON2ID_PASSWORD_HASH_VERSION,
    });
  }
}
