import { describe, expect, it } from 'vitest';

import {
  RegisterUser,
  type PasswordHasher,
  type RegistrationTransaction,
  type RegistrationTransactionResources,
} from '../src';

class RecordingPasswordHasher implements PasswordHasher {
  readonly passwords: string[] = [];

  constructor(private readonly events: string[]) {}

  async hash(password: string): Promise<string> {
    this.events.push('hash');
    this.passwords.push(password);

    return 'encoded-password-hash';
  }
}

class RecordingRegistrationTransaction implements RegistrationTransaction {
  calls = 0;

  constructor(
    private readonly events: string[],
    private readonly resources: RegistrationTransactionResources,
  ) {}

  async execute<TResult>(
    operation: (resources: RegistrationTransactionResources) => Promise<TResult>,
  ): Promise<TResult> {
    this.calls += 1;
    this.events.push('transaction');

    return operation(this.resources);
  }
}

function createResources(events: string[]): {
  readonly resources: RegistrationTransactionResources;
  readonly captured: {
    actorEmail?: {
      readonly actorId: string;
      readonly email: string;
      readonly normalizedEmail: string;
    };
    credential?: {
      readonly actorId: string;
      readonly passwordHash: string;
    };
    user?: {
      readonly actorId: string;
    };
  };
} {
  const now = new Date();

  const actor = {
    id: 'actor-1',
    createdAt: now,
    updatedAt: now,
  };

  const user = {
    id: 'user-1',
    actorId: actor.id,
    displayName: null,
    createdAt: now,
    updatedAt: now,
  };

  const captured: {
    actorEmail?: {
      readonly actorId: string;
      readonly email: string;
      readonly normalizedEmail: string;
    };
    credential?: {
      readonly actorId: string;
      readonly passwordHash: string;
    };
    user?: {
      readonly actorId: string;
    };
  } = {};

  const resources: RegistrationTransactionResources = {
    identity: {
      async createActor() {
        events.push('actor');

        return actor;
      },

      async createActorEmail(input) {
        events.push('email');
        captured.actorEmail = input;
      },

      async createPasswordCredential(input) {
        events.push('credential');
        captured.credential = input;
      },
    },

    user: {
      async create(input) {
        events.push('user');
        captured.user = input;

        return user;
      },
    },
  };

  return {
    resources,
    captured,
  };
}

describe('RegisterUser', () => {
  it('hashes the normalized password before opening the registration transaction', async () => {
    const events: string[] = [];
    const { resources, captured } = createResources(events);

    const passwordHasher = new RecordingPasswordHasher(events);
    const transaction = new RecordingRegistrationTransaction(events, resources);

    const registerUser = new RegisterUser(transaction, passwordHasher);

    const password = `Cafe\u0301-${'x'.repeat(10)}`;

    const result = await registerUser.execute({
      email: '  Person.Name@Example.COM  ',
      password,
    });

    expect(events).toEqual(['hash', 'transaction', 'actor', 'email', 'credential', 'user']);

    expect(passwordHasher.passwords).toEqual([password.normalize('NFC')]);

    expect(captured.actorEmail).toEqual({
      actorId: 'actor-1',
      email: 'Person.Name@Example.COM',
      normalizedEmail: 'person.name@example.com',
    });

    expect(captured.credential).toEqual({
      actorId: 'actor-1',
      passwordHash: 'encoded-password-hash',
    });

    expect(captured.user).toEqual({
      actorId: 'actor-1',
    });

    expect(result).toEqual({
      actorId: 'actor-1',
      userId: 'user-1',
    });
  });

  it('does not hash or open a transaction for an invalid email', async () => {
    const events: string[] = [];
    const { resources } = createResources(events);

    const passwordHasher = new RecordingPasswordHasher(events);
    const transaction = new RecordingRegistrationTransaction(events, resources);

    const registerUser = new RegisterUser(transaction, passwordHasher);

    await expect(
      registerUser.execute({
        email: 'invalid-email',
        password: 'a'.repeat(15),
      }),
    ).rejects.toMatchObject({
      code: 'identity.registration.invalid_email',
      kind: 'validation',
    });

    expect(passwordHasher.passwords).toEqual([]);
    expect(transaction.calls).toBe(0);
    expect(events).toEqual([]);
  });

  it('does not hash or open a transaction for an invalid password', async () => {
    const events: string[] = [];
    const { resources } = createResources(events);

    const passwordHasher = new RecordingPasswordHasher(events);
    const transaction = new RecordingRegistrationTransaction(events, resources);

    const registerUser = new RegisterUser(transaction, passwordHasher);

    await expect(
      registerUser.execute({
        email: 'person@example.com',
        password: 'too-short',
      }),
    ).rejects.toMatchObject({
      code: 'identity.registration.invalid_password',
      kind: 'validation',
    });

    expect(passwordHasher.passwords).toEqual([]);
    expect(transaction.calls).toBe(0);
    expect(events).toEqual([]);
  });
});
