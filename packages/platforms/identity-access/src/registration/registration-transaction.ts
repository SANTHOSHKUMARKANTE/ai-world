import type { UserRegistrationWriter } from '@ai-world/platform-user';

import type { Actor } from '../actor';

export interface CreateActorEmailInput {
  readonly actorId: string;
  readonly email: string;
  readonly normalizedEmail: string;
}

export interface CreatePasswordCredentialInput {
  readonly actorId: string;
  readonly passwordHash: string;
}

export interface IdentityRegistrationWriter {
  createActor(): Promise<Actor>;

  createActorEmail(input: CreateActorEmailInput): Promise<void>;

  createPasswordCredential(input: CreatePasswordCredentialInput): Promise<void>;
}

export interface RegistrationTransactionResources {
  readonly identity: IdentityRegistrationWriter;
  readonly user: UserRegistrationWriter;
}

export interface RegistrationTransaction {
  execute<TResult>(
    operation: (resources: RegistrationTransactionResources) => Promise<TResult>,
  ): Promise<TResult>;
}
