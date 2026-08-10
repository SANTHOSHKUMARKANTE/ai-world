import { describe, expect, it } from 'vitest';

import {
  ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH,
  Argon2idPasswordHasher,
  Argon2idPasswordVerifier,
} from '../src/infrastructure';

describe('Argon2idPasswordVerifier', () => {
  it('accepts the correct password', async () => {
    const hasher = new Argon2idPasswordHasher();
    const verifier = new Argon2idPasswordVerifier();

    const passwordHash = await hasher.hash('correct password');

    await expect(verifier.verify('correct password', passwordHash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hasher = new Argon2idPasswordHasher();
    const verifier = new Argon2idPasswordVerifier();

    const passwordHash = await hasher.hash('correct password');

    await expect(verifier.verify('wrong password', passwordHash)).resolves.toBe(false);
  });

  it('provides a valid dummy Argon2id hash for unknown-identity verification', async () => {
    const verifier = new Argon2idPasswordVerifier();

    await expect(
      verifier.verify(
        'arbitrary authentication password',
        ARGON2ID_AUTHENTICATION_DUMMY_PASSWORD_HASH,
      ),
    ).resolves.toBe(false);
  });
});
