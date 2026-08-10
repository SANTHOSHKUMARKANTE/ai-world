import type { PasswordHasher } from '../password/password-hasher';
import { normalizeAndValidateRegistrationPassword } from '../password/password-policy';
import { normalizeAndValidateRegistrationEmail } from './registration-email';
import type { RegistrationTransaction } from './registration-transaction';

export interface RegisterUserInput {
  readonly email: string;
  readonly password: string;
}

export interface RegisterUserResult {
  readonly actorId: string;
  readonly userId: string;
}

export class RegisterUser {
  constructor(
    private readonly transaction: RegistrationTransaction,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute(input: RegisterUserInput): Promise<RegisterUserResult> {
    const { email, normalizedEmail } = normalizeAndValidateRegistrationEmail(input.email);

    const normalizedPassword = normalizeAndValidateRegistrationPassword(input.password);

    // Intentionally outside the database transaction.
    const passwordHash = await this.passwordHasher.hash(normalizedPassword);

    return this.transaction.execute(async ({ identity, user }) => {
      const actor = await identity.createActor();

      await identity.createActorEmail({
        actorId: actor.id,
        email,
        normalizedEmail,
      });

      await identity.createPasswordCredential({
        actorId: actor.id,
        passwordHash,
      });

      const createdUser = await user.create({
        actorId: actor.id,
      });

      return {
        actorId: actor.id,
        userId: createdUser.id,
      };
    });
  }
}
