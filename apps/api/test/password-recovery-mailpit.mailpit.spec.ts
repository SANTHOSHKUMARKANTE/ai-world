import { createHash, randomUUID } from 'node:crypto';

import { createDatabaseClient, type DatabaseClient } from '@ai-world/foundation-database';
import { type INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import { AppModule } from '../src/app.module';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required for the Mailpit password recovery integration test.');
}

const MAILPIT_HTTP_URL = process.env.MAILPIT_HTTP_URL ?? 'http://127.0.0.1:8025';

const MAILPIT_SMTP_HOST = process.env.EMAIL_SMTP_HOST ?? '127.0.0.1';

const MAILPIT_SMTP_PORT = Number(process.env.EMAIL_SMTP_PORT ?? '1025');

const EMAIL_FROM = process.env.EMAIL_FROM ?? 'AI World <noreply@ai-world.local>';

const runMarker = `api-password-recovery-mailpit-${randomUUID()}`;

interface MailpitAddress {
  readonly Name: string;
  readonly Address: string;
}

interface MailpitMessageSummary {
  readonly ID: string;
  readonly Subject: string;
  readonly From: MailpitAddress;
  readonly To: MailpitAddress[];
}

interface MailpitSearchResponse {
  readonly messages: MailpitMessageSummary[];
  readonly messages_count: number;
}

interface MailpitMessage {
  readonly ID: string;
  readonly Subject: string;
  readonly From: MailpitAddress;
  readonly To: MailpitAddress[];
  readonly Text: string;
}

function createRecoveryEmail(): string {
  return `${runMarker}-${randomUUID()}@example.com`;
}

function extractRecoveryToken(text: string): string {
  const normalizedText = text.replace(/\r\n?/gu, '\n');

  const recoveryMarker = 'Reset your AI World password with this token:';

  const markerIndex = normalizedText.indexOf(recoveryMarker);

  if (markerIndex < 0) {
    throw new Error('Expected the password-recovery token marker in the Mailpit message.');
  }

  const contentAfterMarker = normalizedText.slice(markerIndex + recoveryMarker.length);

  const tokenMatch = contentAfterMarker.match(/(?:^|\s)([A-Za-z0-9_-]{43})(?=\s|$)/u);

  if (!tokenMatch?.[1]) {
    throw new Error('Expected a 32-byte base64url recovery token in the Mailpit message.');
  }

  return tokenMatch[1];
}

function digestRecoveryToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

function mailpitRecipientQuery(email: string): string {
  return `to:"${email}"`;
}

async function requireSuccessfulMailpitResponse(
  response: Response,
  operation: string,
): Promise<void> {
  if (response.ok) {
    return;
  }

  const responseBody = await response.text();

  throw new Error(`${operation} failed with HTTP ${response.status}: ${responseBody}`);
}

async function checkMailpitReadiness(): Promise<void> {
  let response: Response;

  try {
    response = await fetch(`${MAILPIT_HTTP_URL}/api/v1/info`);
  } catch (error) {
    throw new Error(
      `Mailpit is not reachable at ${MAILPIT_HTTP_URL}. Start local infrastructure before running this test.`,
      {
        cause: error,
      },
    );
  }

  await requireSuccessfulMailpitResponse(response, 'Mailpit readiness check');
}

async function searchMailpitMessages(email: string): Promise<MailpitSearchResponse> {
  const query = encodeURIComponent(mailpitRecipientQuery(email));

  const response = await fetch(`${MAILPIT_HTTP_URL}/api/v1/search?query=${query}&limit=10`);

  await requireSuccessfulMailpitResponse(response, 'Mailpit message search');

  return (await response.json()) as MailpitSearchResponse;
}

async function deleteMailpitMessages(email: string): Promise<void> {
  const query = encodeURIComponent(mailpitRecipientQuery(email));

  const response = await fetch(`${MAILPIT_HTTP_URL}/api/v1/search?query=${query}`, {
    method: 'DELETE',
  });

  await requireSuccessfulMailpitResponse(response, 'Mailpit message cleanup');
}

async function getMailpitMessage(messageId: string): Promise<MailpitMessage> {
  const response = await fetch(
    `${MAILPIT_HTTP_URL}/api/v1/message/${encodeURIComponent(messageId)}`,
  );

  await requireSuccessfulMailpitResponse(response, 'Mailpit message retrieval');

  return (await response.json()) as MailpitMessage;
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function waitForMailpitMessage(email: string): Promise<MailpitMessageSummary> {
  const timeoutAt = Date.now() + 5_000;

  while (Date.now() < timeoutAt) {
    const result = await searchMailpitMessages(email);

    const message = result.messages.find((candidate) => {
      return candidate.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase());
    });

    if (message) {
      return message;
    }

    await wait(100);
  }

  throw new Error(`Timed out waiting for Mailpit to receive a recovery email for ${email}.`);
}

describe('Password Recovery Mailpit SMTP integration', () => {
  let app: INestApplication;
  let database: DatabaseClient;

  const fixtureEmails = new Set<string>();

  async function cleanupDatabaseFixtures(): Promise<void> {
    if (fixtureEmails.size === 0) {
      return;
    }

    const normalizedEmails = [...fixtureEmails].map((email) => email.toLowerCase());

    const actorEmails = await database.actorEmail.findMany({
      where: {
        normalizedEmail: {
          in: normalizedEmails,
        },
      },
      select: {
        actorId: true,
      },
    });

    const actorIds = actorEmails.map(({ actorId }) => actorId);

    if (actorIds.length > 0) {
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
  }

  async function cleanupMailpitFixtures(): Promise<void> {
    await Promise.all(
      [...fixtureEmails].map(async (email) => {
        await deleteMailpitMessages(email);
      }),
    );
  }

  beforeAll(async () => {
    await checkMailpitReadiness();

    database = createDatabaseClient({
      connectionString: databaseUrl,
    });

    const moduleRef = await Test.createTestingModule({
      imports: [
        AppModule.register({
          databaseUrl,
          environment: 'test',
          logLevel: 'fatal',
          email: {
            smtp: {
              host: MAILPIT_SMTP_HOST,
              port: MAILPIT_SMTP_PORT,
              secure: false,
            },
            from: EMAIL_FROM,
          },
        }),
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useLogger(app.get(Logger));
    app.useGlobalInterceptors(new LoggerErrorInterceptor());

    await app.init();
  });

  afterEach(async () => {
    await cleanupMailpitFixtures();
    await cleanupDatabaseFixtures();

    fixtureEmails.clear();
  });

  afterAll(async () => {
    await cleanupMailpitFixtures();
    await cleanupDatabaseFixtures();

    await app.close();
    await database.$disconnect();
  });

  it('delivers a real recovery email through SMTP to Mailpit and resets the password using the delivered token', async () => {
    const email = createRecoveryEmail();
    const originalPassword = 'correct horse battery staple';
    const newPassword = 'new correct horse battery staple';

    fixtureEmails.add(email);

    await deleteMailpitMessages(email);

    const registrationResponse = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password: originalPassword,
      })
      .expect(201);

    const actorId = registrationResponse.body.actorId as string;

    expect(actorId).toBeTruthy();

    /*
     * Create multiple pre-reset Sessions.
     * Recovery must revoke all of them.
     */
    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password: originalPassword,
      })
      .expect(200);

    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password: originalPassword,
      })
      .expect(200);

    const sessionsBeforeReset = await database.session.findMany({
      where: {
        actorId,
      },
    });

    expect(sessionsBeforeReset).toHaveLength(2);
    expect(sessionsBeforeReset.every(({ revokedAt }) => revokedAt === null)).toBe(true);

    /*
     * No Session cookie is supplied.
     *
     * HTTP
     *   -> IssuePasswordRecovery
     *   -> EmailDelivery
     *   -> SmtpEmailDelivery
     *   -> Mailpit SMTP
     */
    await request(app.getHttpServer())
      .post('/password-recovery/request')
      .send({
        email,
      })
      .expect(204);

    const messageSummary = await waitForMailpitMessage(email);

    expect(messageSummary.Subject).toBe('Reset your AI World password');

    expect(
      messageSummary.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase()),
    ).toBe(true);

    expect(messageSummary.From.Address).toBe('noreply@ai-world.local');

    const message = await getMailpitMessage(messageSummary.ID);

    expect(message.ID).toBe(messageSummary.ID);
    expect(message.Subject).toBe('Reset your AI World password');

    expect(message.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase())).toBe(
      true,
    );

    expect(message.From.Address).toBe('noreply@ai-world.local');

    expect(message.Text).toContain('Reset your AI World password with this token:');
    expect(message.Text).toContain('This recovery token expires in 1 hour.');

    /*
     * Extract the exact opaque token physically delivered over SMTP.
     */
    const token = extractRecoveryToken(message.Text);

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(token).not.toContain('=');

    const tokenDigest = digestRecoveryToken(token);

    const actorEmailBeforeReset = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    /*
     * Recovery does not mutate email verification state.
     */
    expect(actorEmailBeforeReset.verifiedAt).toBeNull();

    const challenge = actorEmailBeforeReset.passwordRecoveryChallenge;

    if (!challenge) {
      throw new Error('Expected the SMTP-delivered password recovery challenge to exist.');
    }

    /*
     * PostgreSQL contains exactly the SHA-256 digest of the token
     * delivered through SMTP, never the raw token.
     */
    expect(challenge.tokenDigest).toBe(tokenDigest);
    expect(challenge.tokenDigest).toMatch(/^[0-9a-f]{64}$/u);
    expect(challenge.tokenDigest).not.toBe(token);

    expect(challenge.consumedAt).toBeNull();
    expect(challenge.expiresAt.getTime()).toBeGreaterThan(Date.now());

    /*
     * Reset without any authenticated Session.
     */
    await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: newPassword,
      })
      .expect(204);

    const actorEmailAfterReset = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId,
      },
      include: {
        passwordRecoveryChallenge: true,
      },
    });

    expect(actorEmailAfterReset.verifiedAt).toBeNull();
    expect(actorEmailAfterReset.passwordRecoveryChallenge?.consumedAt).not.toBeNull();

    const sessionsAfterReset = await database.session.findMany({
      where: {
        actorId,
      },
    });

    expect(sessionsAfterReset).toHaveLength(2);
    expect(sessionsAfterReset.every(({ revokedAt }) => revokedAt !== null)).toBe(true);

    /*
     * Old password is no longer valid.
     */
    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password: originalPassword,
      })
      .expect(401);

    /*
     * New password is valid.
     */
    await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password: newPassword,
      })
      .expect(200);

    /*
     * The exact SMTP-delivered token is single-use.
     */
    const replayResponse = await request(app.getHttpServer())
      .post('/password-recovery/reset')
      .send({
        token,
        password: 'another valid replacement password',
      })
      .expect(400);

    expect(replayResponse.body).toEqual({
      error: expect.objectContaining({
        code: 'identity.password_recovery.invalid_token',
        message: 'The password recovery token is invalid or expired.',
        status: 400,
      }),
    });
  });
});
