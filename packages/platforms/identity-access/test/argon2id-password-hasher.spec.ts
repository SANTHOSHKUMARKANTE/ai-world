import * as argon2 from 'argon2';
import { describe, expect, it } from 'vitest';

import {
  Argon2idPasswordHasher,
  ARGON2ID_PASSWORD_HASH_MEMORY_COST,
  ARGON2ID_PASSWORD_HASH_PARALLELISM,
  ARGON2ID_PASSWORD_HASH_TIME_COST,
} from '../src/infrastructure';

describe('Argon2idPasswordHasher', () => {
  const password = 'correct horse battery staple';

  it('produces an Argon2id PHC hash with the configured parameters', async () => {
    const hasher = new Argon2idPasswordHasher();

    const passwordHash = await hasher.hash(password);

    const parts = passwordHash.split('$');

    expect(parts[1]).toBe('argon2id');
    expect(parts[2]).toBe('v=19');

    const parameterPart = parts[3];

    expect(parameterPart).toBeDefined();

    const parameters = Object.fromEntries(
      parameterPart!.split(',').map((parameter) => {
        const [name, rawValue] = parameter.split('=');

        return [name, Number(rawValue)];
      }),
    );

    expect(parameters).toMatchObject({
      m: ARGON2ID_PASSWORD_HASH_MEMORY_COST,
      t: ARGON2ID_PASSWORD_HASH_TIME_COST,
      p: ARGON2ID_PASSWORD_HASH_PARALLELISM,
    });

    expect(passwordHash).not.toContain(password);
  });

  it('produces a hash that verifies the original password', async () => {
    const hasher = new Argon2idPasswordHasher();

    const passwordHash = await hasher.hash(password);

    await expect(argon2.verify(passwordHash, password)).resolves.toBe(true);
  });

  it('does not verify a different password', async () => {
    const hasher = new Argon2idPasswordHasher();

    const passwordHash = await hasher.hash(password);

    await expect(argon2.verify(passwordHash, 'different-password-value')).resolves.toBe(false);
  });

  it('uses a unique salt for separate hashes of the same password', async () => {
    const hasher = new Argon2idPasswordHasher();

    const firstHash = await hasher.hash(password);
    const secondHash = await hasher.hash(password);

    expect(firstHash).not.toBe(secondHash);

    await expect(argon2.verify(firstHash, password)).resolves.toBe(true);
    await expect(argon2.verify(secondHash, password)).resolves.toBe(true);
  });
});
