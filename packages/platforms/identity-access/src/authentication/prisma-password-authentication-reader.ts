import type { DatabaseClient } from '@ai-world/foundation-database';

import type {
  PasswordAuthenticationCredential,
  PasswordAuthenticationReader,
} from './password-authentication-reader';

export class PrismaPasswordAuthenticationReader implements PasswordAuthenticationReader {
  constructor(private readonly database: DatabaseClient) {}

  async findByNormalizedEmail(
    normalizedEmail: string,
  ): Promise<PasswordAuthenticationCredential | null> {
    const actorEmail = await this.database.actorEmail.findUnique({
      where: {
        normalizedEmail,
      },
      select: {
        actorId: true,
        actor: {
          select: {
            passwordCredential: {
              select: {
                passwordHash: true,
              },
            },
          },
        },
      },
    });

    if (!actorEmail?.actor.passwordCredential) {
      return null;
    }

    return {
      actorId: actorEmail.actorId,
      passwordHash: actorEmail.actor.passwordCredential.passwordHash,
    };
  }
}
