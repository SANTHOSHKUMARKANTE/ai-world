import { randomUUID } from 'node:crypto';

import { type EmailDelivery, type EmailMessage } from '@ai-world/foundation-email';
import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';
import { SESSION_COOKIE_NAME } from '../src/session/session-cookie';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for Email Verification API integration tests.');
}

const runMarker = `api-email-verification-${randomUUID()}`;

function createVerificationEmail(label: string): string {
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

function getSessionCookiePair(response: {
  headers: Record<string, string | string[] | undefined>;
}): string {
  const setCookie = response.headers['set-cookie'];
  const header = Array.isArray(setCookie) ? setCookie[0] : setCookie;

  if (!header) {
    throw new Error('Expected a Session Set-Cookie header.');
  }

  const cookiePair = header.split(';')[0];

  if (!cookiePair) {
    throw new Error('Expected a Session cookie pair.');
  }

  if (!cookiePair.startsWith(`${SESSION_COOKIE_NAME}=`)) {
    throw new Error(`Expected ${SESSION_COOKIE_NAME} cookie.`);
  }

  return cookiePair;
}

function extractVerificationToken(message: EmailMessage): string {
  const match = message.text.match(/\n\n([A-Za-z0-9_-]{43})\n\n/u);

  if (!match?.[1]) {
    throw new Error('Expected a verification token in the email body.');
  }

  return match[1];
}

describe('Email Verification API', () => {
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
    const email = createVerificationEmail(label);

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

  async function signInFixture(label: string): Promise<{
    actorId: string;
    email: string;
    cookiePair: string;
  }> {
    const fixture = await registerFixture(label);

    const response = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email: fixture.email,
        password: fixture.password,
      })
      .expect(200);

    return {
      actorId: fixture.actorId,
      email: fixture.email,
      cookiePair: getSessionCookiePair(response),
    };
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

  it('requires an authenticated Session to request email verification', async () => {
    const response = await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('X-Request-Id', 'email-verification-missing-session-001')
      .expect('X-Request-Id', 'email-verification-missing-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'email-verification-missing-session-001',
      },
    });

    expect(emailDelivery.messages).toEqual([]);
  });

  it('rejects an unknown Session using the canonical Session failure', async () => {
    const response = await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', `${SESSION_COOKIE_NAME}=unknown-session-token`)
      .set('X-Request-Id', 'email-verification-invalid-session-001')
      .expect('X-Request-Id', 'email-verification-invalid-session-001')
      .expect(401);

    expect(response.body).toEqual({
      error: {
        code: 'identity.session.invalid',
        message: 'Authentication is required.',
        status: 401,
        requestId: 'email-verification-invalid-session-001',
      },
    });

    expect(emailDelivery.messages).toEqual([]);
  });

  it('issues email verification for the Actor authenticated by the Session', async () => {
    const fixture = await signInFixture('issue');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    expect(emailDelivery.messages).toHaveLength(1);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    expect(message.to).toBe(fixture.email);
    expect(message.subject).toBe('Verify your AI World email');

    const token = extractVerificationToken(message);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).toBeNull();
    expect(actorEmail.verificationChallenge).not.toBeNull();

    const challenge = actorEmail.verificationChallenge;

    if (!challenge) {
      throw new Error('Expected an email verification challenge.');
    }

    expect(challenge.tokenDigest).toMatch(/^[0-9a-f]{64}$/u);
    expect(challenge.tokenDigest).not.toBe(token);
    expect(challenge.consumedAt).toBeNull();
    expect(challenge.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it('rejects unexpected request payload fields after Session authentication', async () => {
    const fixture = await signInFixture('invalid-request-body');

    const response = await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .set('X-Request-Id', 'email-verification-invalid-request-001')
      .send({
        unexpected: true,
      })
      .expect('X-Request-Id', 'email-verification-invalid-request-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.email_verification.invalid_request',
        message: 'The email verification request is invalid.',
        status: 400,
        requestId: 'email-verification-invalid-request-001',
      },
    });

    expect(emailDelivery.messages).toEqual([]);
  });

  it('treats verification request for an already verified email as a successful no-op', async () => {
    const fixture = await signInFixture('already-verified');

    await database.actorEmail.update({
      where: {
        actorId: fixture.actorId,
      },
      data: {
        verifiedAt: new Date(),
      },
    });

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    expect(emailDelivery.messages).toEqual([]);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).not.toBeNull();
    expect(actorEmail.verificationChallenge).toBeNull();
  });

  it('confirms email verification without requiring an authenticated Session', async () => {
    const fixture = await signInFixture('confirm');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    const token = extractVerificationToken(message);

    await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token,
      })
      .expect(204);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).not.toBeNull();
    expect(actorEmail.verificationChallenge?.consumedAt).not.toBeNull();
  });

  it('returns the canonical invalid-token failure without requiring a Session', async () => {
    const response = await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .set('X-Request-Id', 'email-verification-invalid-token-001')
      .send({
        token: 'unknown-email-verification-token',
      })
      .expect('X-Request-Id', 'email-verification-invalid-token-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.email_verification.invalid_token',
        message: 'The email verification token is invalid or expired.',
        status: 400,
        requestId: 'email-verification-invalid-token-001',
      },
    });
  });

  it('rejects malformed confirmation transport input', async () => {
    const response = await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .set('X-Request-Id', 'email-verification-malformed-confirm-001')
      .send({
        token: '',
        unexpected: true,
      })
      .expect('X-Request-Id', 'email-verification-malformed-confirm-001')
      .expect(400);

    expect(response.body).toEqual({
      error: {
        code: 'identity.email_verification.invalid_request',
        message: 'The email verification request is invalid.',
        status: 400,
        requestId: 'email-verification-malformed-confirm-001',
      },
    });
  });

  it('invalidates the previous verification token when verification is resent', async () => {
    const fixture = await signInFixture('resend');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const firstMessage = emailDelivery.messages[0];

    if (!firstMessage) {
      throw new Error('Expected the first verification email.');
    }

    const firstToken = extractVerificationToken(firstMessage);

    const firstActorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    const firstChallenge = firstActorEmail.verificationChallenge;

    if (!firstChallenge) {
      throw new Error('Expected the first verification challenge.');
    }

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const secondMessage = emailDelivery.messages[1];

    if (!secondMessage) {
      throw new Error('Expected the second verification email.');
    }

    const secondToken = extractVerificationToken(secondMessage);

    expect(secondToken).not.toBe(firstToken);

    const secondActorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    const secondChallenge = secondActorEmail.verificationChallenge;

    if (!secondChallenge) {
      throw new Error('Expected the replacement verification challenge.');
    }

    expect(secondChallenge.id).toBe(firstChallenge.id);
    expect(secondChallenge.tokenDigest).not.toBe(firstChallenge.tokenDigest);
    expect(secondChallenge.consumedAt).toBeNull();
    expect(secondChallenge.expiresAt.getTime()).toBeGreaterThanOrEqual(
      firstChallenge.expiresAt.getTime(),
    );

    const oldTokenResponse = await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token: firstToken,
      })
      .expect(400);

    expect(oldTokenResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.email_verification.invalid_token',
        message: 'The email verification token is invalid or expired.',
        status: 400,
      }),
    });

    const afterOldToken = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(afterOldToken.verifiedAt).toBeNull();
    expect(afterOldToken.verificationChallenge?.consumedAt).toBeNull();

    await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token: secondToken,
      })
      .expect(204);

    const verified = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(verified.verifiedAt).not.toBeNull();
    expect(verified.verificationChallenge?.consumedAt).not.toBeNull();
  });

  it('rejects an expired verification token without mutating verification state', async () => {
    const fixture = await signInFixture('expired-verification');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    const token = extractVerificationToken(message);

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
    });

    await database.emailVerificationChallenge.update({
      where: {
        actorEmailId: actorEmail.id,
      },
      data: {
        expiresAt: new Date(Date.now() - 60_000),
      },
    });

    const expiredResponse = await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token,
      })
      .expect(400);

    expect(expiredResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.email_verification.invalid_token',
        message: 'The email verification token is invalid or expired.',
        status: 400,
      }),
    });

    const afterConfirmation = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(afterConfirmation.verifiedAt).toBeNull();
    expect(afterConfirmation.verificationChallenge?.consumedAt).toBeNull();
  });

  it('rejects replay of an already consumed verification token', async () => {
    const fixture = await signInFixture('replay');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    const token = extractVerificationToken(message);

    await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token,
      })
      .expect(204);

    const afterFirstConfirmation = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(afterFirstConfirmation.verifiedAt).not.toBeNull();
    expect(afterFirstConfirmation.verificationChallenge?.consumedAt).not.toBeNull();

    const verifiedAt = afterFirstConfirmation.verifiedAt;
    const consumedAt = afterFirstConfirmation.verificationChallenge?.consumedAt;

    const replayResponse = await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token,
      })
      .expect(400);

    expect(replayResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.email_verification.invalid_token',
        message: 'The email verification token is invalid or expired.',
        status: 400,
      }),
    });

    const afterReplay = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(afterReplay.verifiedAt?.getTime()).toBe(verifiedAt?.getTime());
    expect(afterReplay.verificationChallenge?.consumedAt?.getTime()).toBe(consumedAt?.getTime());
  });

  it('allows only one concurrent confirmation to consume a verification token', async () => {
    const fixture = await signInFixture('concurrent-confirmation');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    const token = extractVerificationToken(message);

    const responses = await Promise.all([
      request(app.getHttpServer()).post('/email-verification/confirm').send({
        token,
      }),
      request(app.getHttpServer()).post('/email-verification/confirm').send({
        token,
      }),
    ]);

    const statuses = responses.map(({ status }) => status).sort((left, right) => left - right);

    expect(statuses).toEqual([204, 400]);

    const invalidResponse = responses.find(({ status }) => status === 400);

    expect(invalidResponse?.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.email_verification.invalid_token',
        message: 'The email verification token is invalid or expired.',
        status: 400,
      }),
    });

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).not.toBeNull();
    expect(actorEmail.verificationChallenge?.consumedAt).not.toBeNull();
  });

  it('rolls back challenge consumption when the email verification state update fails', async () => {
    const fixture = await signInFixture('transaction-rollback');

    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', fixture.cookiePair)
      .expect(204);

    const message = emailDelivery.messages[0];

    if (!message) {
      throw new Error('Expected a verification email.');
    }

    const token = extractVerificationToken(message);

    const databaseObjectSuffix = randomUUID().replaceAll('-', '');

    const functionName = `test_email_verification_failure_${databaseObjectSuffix}`;
    const triggerName = `test_email_verification_failure_${databaseObjectSuffix}`;

    const normalizedEmail = fixture.email.toLowerCase();

    try {
      await database.$executeRawUnsafe(`
      CREATE FUNCTION "${functionName}"()
      RETURNS trigger
      AS $$
      BEGIN
        IF OLD.normalized_email = '${normalizedEmail}'
           AND NEW.verified_at IS NOT NULL THEN
          RAISE EXCEPTION 'forced email verification update failure';
        END IF;

        RETURN NEW;
      END;
      $$
      LANGUAGE plpgsql
    `);

      await database.$executeRawUnsafe(`
      CREATE TRIGGER "${triggerName}"
      BEFORE UPDATE OF verified_at
      ON identity_actor_emails
      FOR EACH ROW
      EXECUTE FUNCTION "${functionName}"()
    `);

      await request(app.getHttpServer())
        .post('/email-verification/confirm')
        .send({
          token,
        })
        .expect(500);
    } finally {
      await database.$executeRawUnsafe(`
      DROP TRIGGER IF EXISTS "${triggerName}"
      ON identity_actor_emails
    `);

      await database.$executeRawUnsafe(`
      DROP FUNCTION IF EXISTS "${functionName}"()
    `);
    }

    const actorEmail = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId: fixture.actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmail.verifiedAt).toBeNull();
    expect(actorEmail.verificationChallenge?.consumedAt).toBeNull();
  });
});
