import type { DatabaseTransactionClient } from '@ai-world/foundation-database';
import { ApplicationError } from '@ai-world/foundation-errors';

import type { Actor } from '../actor';
import type {
  CreateActorEmailInput,
  CreatePasswordCredentialInput,
  IdentityRegistrationWriter,
} from './registration-transaction';

function hasDatabaseErrorCode(error: unknown, code: string): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { readonly code?: unknown }).code === code
  );
}

export class PrismaIdentityRegistrationWriter implements IdentityRegistrationWriter {
  constructor(private readonly database: DatabaseTransactionClient) {}

  async createActor(): Promise<Actor> {
    return this.database.actor.create({
      data: {},
    });
  }

  async createActorEmail(input: CreateActorEmailInput): Promise<void> {
    try {
      await this.database.actorEmail.create({
        data: {
          actorId: input.actorId,
          email: input.email,
          normalizedEmail: input.normalizedEmail,
        },
      });
    } catch (error) {
      if (hasDatabaseErrorCode(error, 'P2002')) {
        throw new ApplicationError({
          code: 'identity.registration.email_conflict',
          kind: 'conflict',
          message: 'Registration email conflicts with an existing Identity email.',
          publicMessage: 'Registration could not be completed with this email.',
          cause: error,
        });
      }

      throw error;
    }
  }

  async createPasswordCredential(input: CreatePasswordCredentialInput): Promise<void> {
    await this.database.passwordCredential.create({
      data: {
        actorId: input.actorId,
        passwordHash: input.passwordHash,
      },
    });
  }
}
