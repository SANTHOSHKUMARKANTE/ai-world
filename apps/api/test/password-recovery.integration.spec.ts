import { createHash, randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type EmailDelivery, type EmailMessage } from '@ai-world/foundation-email';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Password Recovery API integration tests.');
}

const runMarker = `api-password-recovery-${randomUUID()}`;

function createRecoveryEmail(label: string): string {
  return `${runMarker}-${label}-${randomUUID()}@example.com`;
}

class RecordingEmailDelivery implements EmailDelivery {
  public readonly messages: EmailMessage[] = [];

  public async send(message: EmailMessage): Promise<void> {
    this.messages.push(message);
  }

  public reset(): void {
    this.messages.length = 0;
  }
}

function extractRecoveryToken(message: EmailMessage): string {
  const linkMatch = message.text.match(/https?:\/\/[^\s]+/u);
  if (!linkMatch?.[0]) {
    throw new Error('Expected a password recovery deep link in the email body.');
  }

  const link = new URL(linkMatch[0]);
  if (link.pathname !== '/reset-password' || link.search !== '') {
    throw new Error('Expected a query-free /reset-password deep link.');
  }

  const tokens = new URLSearchParams(link.hash.slice(1)).getAll('token');
  const token = tokens.length === 1 ? tokens[0] : undefined;

  if (!token || !/^[A-Za-z0-9_-]{43}$/u.test(token)) {
    throw new Error('Expected one opaque recovery token in the deep-link fragment.');
  }

  return token;
}

describe('Password Recovery API', () => {
  let app: INestApplication;
  let database: DatabaseClient;
  let emailDelivery: RecordingEmailDelivery;

  async function cleanupFixtures(): Promise<void> {
    const actorEmails = await database.actorEmail.findMany({
      where: {
        normalizedEmail: {
          contains: runMarker.toLowerCase(),
        },
      },
      select: {
        actorId: true,
      },
    });

    const actorIds = actorEmails.map(({ actorId }) => actorId);

    if (actorIds.length === 0) {
      return;
    }

    await database.user.deleteMany({
      where: {
        actorId: {
          in: actorIds,
        },
      },
    });

    await database.actor.deleteMany({
      where: {
        id: {
          in: actorIds,
        },
      },
    });
  }

  async function registerFixture(
    label: string,
    password = 'correct horse battery staple',
  ): Promise<{
    actorId: string;
    email: string;
    password: string;
  }> {
    const email = createRecoveryEmail(label);

    const response = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    return {
      actorId: response.body.actorId as string,
      email,
      password,
    };
  }

  async function requestRecoveryToken(email: string): Promise<string> {
    await request(app.getHttpServer())
      .post('/password-recovery/request')
      .send({
        email,
      })
      .expect(204);

    const message = emailDelivery.messages.at(-1);

    if (!message) {
      throw new Error('Expected a password recovery email.');
    }

    return extractRecoveryToken(message);
  }

  beforeAll(async () => {
    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    emailDelivery = new RecordingEmailDelivery();

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
          emailDelivery,
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await cleanupFixtures();
    emailDelivery.reset();
  });

  afterAll(async () => {
    await cleanupFixtures();
    await app.close();
    await database.$disconnect();
  });

  it('issues password recovery without requiring a Session and persists only the token digest', async () => {
    const fixture = await registerFixture('request');
    const requestedAt = Date.now();

    await request(app.getHttpServer())
      .post('/password-recovery/request')
      .send({
        email: `  ${fixture.email.toUpperCase()}  `,
      })
      .expect(204);

    expect(emailDelivery.messages).toHaveLength(1);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a password recovery email.');
    }

    expect(message.to).toBe(fixture.email);
    expect(message.subject).toBe('Reset your AI World password');

    const token = extractRecoveryToken(message);

    const expectedDigest = createHash('sha256').update(token, 'utf8').digest('hex');

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const challenge = actorEmail.passwordRecoveryChallenge;

    if (!challenge) {
      throw new Error('Expected a password recovery challenge.');
    }

    expect(challenge.tokenDigest).toBe(expectedDigest);
    expect(challenge.tokenDigest).not.toBe(token);
    expect(challenge.tokenDigest).toMatch(/^[0-9a-f]{64}$/u);
    expect(challenge.consumedAt).toBeNull();

    expect(challenge.expiresAt.getTime()).toBeGreaterThan(requestedAt);
    expect(challenge.expiresAt.getTime()).toBeLessThanOrEqual(requestedAt + 60 * 60 * 1000 + 5_000);
  });

  it('returns the same successful response for an unknown email', async () => {
    await request(app.getHttpServer())
      .post('/password-recovery/request')
      .send({
        email: `${runMarker}-unknown-${randomUUID()}@example.com`,
      })
      .expect(204);

    expect(emailDelivery.messages).toEqual([]);
  });

  it('treats a semantically invalid email as an enumeration-safe successful no-op', async () => {
    await request(app.getHttpServer())
      .post('/password-recovery/request')
      .send({
        email: 'not-an-email',
      })
      .expect(204);

    expect(emailDelivery.messages).toEqual([]);
  });

  it('rejects malformed recovery-request transport input', async () => {
    const response = await request(app.getHttpServer())
      .post('/password-recovery/request')
      .set('X-Request-Id', 'password-recovery-invalid-request-001')
      .send({
        email: 123,
        unexpected: true,
      })
      .expect('X-Request-Id', 'password-recovery-invalid-request-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.password_recovery.invalid_request',
        message: 'The password recovery request is invalid.',
        status: 400,
        requestId: 'password-recovery-invalid-request-001',
      },
    });

    expect(emailDelivery.messages).toEqual([]);
  });

  it('resets the password without a Session, consumes the challenge, preserves verification state, and revokes existing Sessions', async () => {
    const fixture = await registerFixture('reset-success');

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    const sessionsBeforeReset = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(sessionsBeforeReset).toHaveLength(1);
    expect(sessionsBeforeReset[0]?.revokedAt).toBeNull();

    const token = await requestRecoveryToken(fixture.email);

    const newPassword = 'new correct horse battery staple';

    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: newPassword,
      })
      .expect(204);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).toBeNull();
    expect(actorEmail.passwordRecoveryChallenge?.consumedAt).not.toBeNull();

    const sessionsAfterReset = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(sessionsAfterReset).toHaveLength(1);
    expect(sessionsAfterReset[0]?.revokedAt).not.toBeNull();

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(401);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: newPassword,
      })
      .expect(200);
  });

  it('returns the canonical failure for an invalid recovery token', async () => {
    const response = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .set('X-Request-Id', 'password-recovery-invalid-token-001')
      .send({
        token: 'unknown-password-recovery-token',
        password: 'new correct horse battery staple',
      })
      .expect('X-Request-Id', 'password-recovery-invalid-token-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
        requestId: 'password-recovery-invalid-token-001',
      },
    });
  });

  it('rejects malformed reset transport input', async () => {
    const response = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .set('X-Request-Id', 'password-recovery-malformed-reset-001')
      .send({
        token: '',
        password: 'new correct horse battery staple',
        unexpected: true,
      })
      .expect('X-Request-Id', 'password-recovery-malformed-reset-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.password_recovery.invalid_request',
        message: 'The password recovery request is invalid.',
        status: 400,
        requestId: 'password-recovery-malformed-reset-001',
      },
    });
  });

  it('rejects an invalid replacement password without consuming the recovery challenge', async () => {
    const fixture = await registerFixture('invalid-password');
    const token = await requestRecoveryToken(fixture.email);

    const credentialBefore = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .set('X-Request-Id', 'password-recovery-invalid-password-001')
      .send({
        token,
        password: 'too-short',
      })
      .expect('X-Request-Id', 'password-recovery-invalid-password-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.password_recovery.invalid_password',
        message: 'Password must contain between 15 and 128 characters.',
        status: 400,
        requestId: 'password-recovery-invalid-password-001',
      },
    });

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const credentialAfter = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(actorEmail.passwordRecoveryChallenge?.consumedAt).toBeNull();
    expect(credentialAfter.passwordHash).toBe(credentialBefore.passwordHash);
  });

  it('invalidates the previous recovery token when recovery is requested again', async () => {
    const fixture = await registerFixture('resend');

    const firstToken = await requestRecoveryToken(fixture.email);

    const firstActorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const firstChallenge = firstActorEmail.passwordRecoveryChallenge;

    if (!firstChallenge) {
      throw new Error('Expected the first recovery challenge.');
    }

    const secondToken = await requestRecoveryToken(fixture.email);

    expect(secondToken).not.toBe(firstToken);
    expect(emailDelivery.messages).toHaveLength(2);

    const secondActorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const secondChallenge = secondActorEmail.passwordRecoveryChallenge;

    if (!secondChallenge) {
      throw new Error('Expected the replacement recovery challenge.');
    }

    expect(secondChallenge.id).toBe(firstChallenge.id);
    expect(secondChallenge.tokenDigest).not.toBe(firstChallenge.tokenDigest);
    expect(secondChallenge.consumedAt).toBeNull();
    expect(secondChallenge.expiresAt.getTime()).toBeGreaterThanOrEqual(
      firstChallenge.expiresAt.getTime(),
    );

    const oldTokenResponse = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token: firstToken,
        password: 'replacement password number one',
      })
      .expect(400);

    expect(oldTokenResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
      }),
    });

    const afterOldToken = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    expect(afterOldToken.passwordRecoveryChallenge?.consumedAt).toBeNull();

    const newPassword = 'replacement password number two';

    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token: secondToken,
        password: newPassword,
      })
      .expect(204);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: newPassword,
      })
      .expect(200);
  });

  it('rejects an expired recovery token without changing password, challenge consumption, or Sessions', async () => {
    const fixture = await registerFixture('expired');

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    const token = await requestRecoveryToken(fixture.email);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    await database.passwordRecoveryChallenge.update({
      where: {
        actorEmailId: actorEmail.id,
      },
      data: {
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const credentialBefore = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const response = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: 'replacement password expired',
      })
      .expect(400);

    expect(response.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
      }),
    });

    const actorEmailAfter = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const credentialAfter = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const sessionsAfter = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(actorEmailAfter.passwordRecoveryChallenge?.consumedAt).toBeNull();
    expect(credentialAfter.passwordHash).toBe(credentialBefore.passwordHash);

    expect(sessionsAfter).toHaveLength(1);
    expect(sessionsAfter[0]?.revokedAt).toBeNull();
  });

  it('rejects replay of an already consumed recovery token without replacing the password again', async () => {
    const fixture = await registerFixture('replay');
    const token = await requestRecoveryToken(fixture.email);

    const firstNewPassword = 'first replacement password';

    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: firstNewPassword,
      })
      .expect(204);

    const afterFirstReset = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const credentialAfterFirstReset = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const consumedAt = afterFirstReset.passwordRecoveryChallenge?.consumedAt;

    expect(consumedAt).not.toBeNull();

    const replayResponse = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: 'second replacement password',
      })
      .expect(400);

    expect(replayResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
      }),
    });

    const afterReplay = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const credentialAfterReplay = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(afterReplay.passwordRecoveryChallenge?.consumedAt?.getTime()).toBe(
      consumedAt?.getTime(),
    );

    expect(credentialAfterReplay.passwordHash).toBe(credentialAfterFirstReset.passwordHash);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: firstNewPassword,
      })
      .expect(200);
  });

  it('revokes every existing Actor Session after a successful recovery reset', async () => {
    const fixture = await registerFixture('multiple-sessions');

    for (let index = 0; index < 3; index += 1) {
      await request(app.getHttpServer())
        .post('/authentication/password')
        .send({
          email: fixture.email,
          password: fixture.password,
        })
        .expect(200);
    }

    const sessionsBeforeReset = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    expect(sessionsBeforeReset).toHaveLength(3);
    expect(sessionsBeforeReset.every(({ revokedAt }) => revokedAt === null)).toBe(true);

    const token = await requestRecoveryToken(fixture.email);

    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: 'replacement password all sessions',
      })
      .expect(204);

    const sessionsAfterReset = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    expect(sessionsAfterReset).toHaveLength(3);
    expect(sessionsAfterReset.every(({ revokedAt }) => revokedAt !== null)).toBe(true);
  });

  it('allows only one concurrent reset to consume a recovery token', async () => {
    const fixture = await registerFixture('concurrent');
    const token = await requestRecoveryToken(fixture.email);

    const firstPassword = 'concurrent replacement password one';
    const secondPassword = 'concurrent replacement password two';

    const responses = await Promise.all([
      request(app.getHttpServer()).post('/password-recovery/reset').send({
        token,
        password: firstPassword,
      }),
      request(app.getHttpServer()).post('/password-recovery/reset').send({
        token,
        password: secondPassword,
      }),
    ]);

    const statuses = responses.map(({ status }) => status).sort((left, right) => left - right);

    expect(statuses).toEqual([204, 400]);

    const invalidResponse = responses.find(({ status }) => status === 400);

    expect(invalidResponse?.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
      }),
    });

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    expect(actorEmail.passwordRecoveryChallenge?.consumedAt).not.toBeNull();

    const firstAuthentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: firstPassword,
      });

    const secondAuthentication = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: secondPassword,
      });

    const authenticationStatuses = [firstAuthentication.status, secondAuthentication.status].sort(
      (left, right) => left - right,
    );

    expect(authenticationStatuses).toEqual([200, 401]);
  });

  it('rolls back challenge consumption, password replacement, and Session revocation when the reset transaction fails', async () => {
    const fixture = await registerFixture('transaction-rollback');

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    const token = await requestRecoveryToken(fixture.email);

    const credentialBefore = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const sessionsBefore = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(sessionsBefore).toHaveLength(1);
    expect(sessionsBefore[0]?.revokedAt).toBeNull();

    const databaseObjectSuffix = randomUUID().replaceAll('-', '');

    const functionName = `test_password_recovery_failure_${databaseObjectSuffix}`;
    const triggerName = `test_password_recovery_failure_${databaseObjectSuffix}`;

    try {
      await database.$executeRawUnsafe(`
        CREATE FUNCTION "${functionName}"()
        RETURNS trigger
        AS $$
        BEGIN
          IF OLD.actor_id = '${fixture.actorId}'::uuid
             AND OLD.revoked_at IS NULL
             AND NEW.revoked_at IS NOT NULL THEN
            RAISE EXCEPTION 'forced password recovery Session revocation failure';
          END IF;

          RETURN NEW;
        END;
        $$
        LANGUAGE plpgsql
      `);

      await database.$executeRawUnsafe(`
        CREATE TRIGGER "${triggerName}"
        BEFORE UPDATE OF revoked_at
        ON identity_sessions
        FOR EACH ROW
        EXECUTE FUNCTION "${functionName}"()
      `);

      await request(app.getHttpServer())
        .post('/password-recovery/reset')
        .send({
          token,
          password: 'replacement password rollback',
        })
        .expect(500);
    } finally {
      await database.$executeRawUnsafe(`
        DROP TRIGGER IF EXISTS "${triggerName}"
        ON identity_sessions
      `);

      await database.$executeRawUnsafe(`
        DROP FUNCTION IF EXISTS "${functionName}"()
      `);
    }

    const actorEmailAfterFailure = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    const credentialAfterFailure = await database.passwordCredential.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    const sessionsAfterFailure = await database.session.findMany({
      where: {
        actorId: fixture.actorId,
      },
    });

    expect(actorEmailAfterFailure.passwordRecoveryChallenge?.consumedAt).toBeNull();

    expect(credentialAfterFailure.passwordHash).toBe(credentialBefore.passwordHash);

    expect(sessionsAfterFailure).toHaveLength(1);
    expect(sessionsAfterFailure[0]?.revokedAt).toBeNull();

    /*
     * The exact same token must still be usable after rollback.
     * This proves challenge consumption was not partially committed.
     */
    const successfulPassword = 'replacement password after rollback';

    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: successfulPassword,
      })
      .expect(204);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: successfulPassword,
      })
      .expect(200);
  });
});
