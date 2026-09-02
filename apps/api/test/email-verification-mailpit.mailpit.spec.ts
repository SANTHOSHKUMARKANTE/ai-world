import { createHash, randomUUID } from 'node:crypto';

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
  throw new Error('DATABASE_URL is required for the Mailpit email verification integration test.');
}

const MAILPIT_HTTP_URL = process.env.MAILPIT_HTTP_URL ?? 'http://127.0.0.1:8025';

const MAILPIT_SMTP_HOST = process.env.EMAIL_SMTP_HOST ?? '127.0.0.1';

const MAILPIT_SMTP_PORT = Number(process.env.EMAIL_SMTP_PORT ?? '1025');

const EMAIL_FROM = process.env.EMAIL_FROM ?? 'AI World <noreply@ai-world.local>';

const runMarker = `api-email-verification-mailpit-${randomUUID()}`;

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

function createVerificationEmail(): string {
  return `${runMarker}-${randomUUID()}@example.com`;
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

function extractVerificationLink(text: string): URL {
  const linkMatch = text.match(/https?:\/\/[^\s]+/u);
  if (!linkMatch?.[0]) {
    throw new Error('Expected a verification deep link in the Mailpit message.');
  }

  const link = new URL(linkMatch[0]);
  if (link.pathname !== '/verify-email') {
    throw new Error(`Expected /verify-email deep link, received ${link.pathname}.`);
  }

  return link;
}

function extractVerificationToken(text: string): string {
  const link = extractVerificationLink(text);
  const token = new URLSearchParams(link.hash.slice(1)).get('token');

  if (!token || !/^[A-Za-z0-9_-]{43}$/u.test(token)) {
    throw new Error('Expected a 32-byte base64url verification token in the deep-link fragment.');
  }

  return token;
}

function digestVerificationToken(token: string): string {
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

  throw new Error(`Timed out waiting for Mailpit to receive a verification email for ${email}.`);
}

describe('Email Verification Mailpit SMTP integration', () => {
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

  it('delivers a real verification email through SMTP to Mailpit and confirms it through the API', async () => {
    const email = createVerificationEmail();
    const password = 'correct horse battery staple';

    fixtureEmails.add(email);

    await deleteMailpitMessages(email);

    const registrationResponse = await request(app.getHttpServer())
      .post('/registration')
      .send({
        email,
        password,
      })
      .expect(201);

    const actorId = registrationResponse.body.actorId as string;

    expect(actorId).toBeTruthy();

    const authenticationResponse = await request(app.getHttpServer())
      .post('/authentication/password')
      .send({
        email,
        password,
      })
      .expect(200);

    const sessionCookie = getSessionCookiePair(authenticationResponse);

    /*
     * This request exercises the real API composition:
     *
     * HTTP
     *   -> ValidateSession
     *   -> IssueEmailVerification
     *   -> EmailDelivery
     *   -> SmtpEmailDelivery
     *   -> Mailpit SMTP
     */
    await request(app.getHttpServer())
      .post('/email-verification/request')
      .set('Cookie', sessionCookie)
      .expect(204);

    const messageSummary = await waitForMailpitMessage(email);

    expect(messageSummary.Subject).toBe('Verify your AI World email');

    expect(
      messageSummary.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase()),
    ).toBe(true);

    expect(messageSummary.From.Address).toBe('noreply@ai-world.local');

    const message = await getMailpitMessage(messageSummary.ID);

    expect(message.ID).toBe(messageSummary.ID);

    expect(message.Subject).toBe('Verify your AI World email');

    expect(message.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase())).toBe(
      true,
    );

    expect(message.From.Address).toBe('noreply@ai-world.local');

    expect(message.Text).toContain('Verify your AI World email address:');
    expect(message.Text).toContain('This verification link expires in 24 hours.');

    const verificationLink = extractVerificationLink(message.Text);
    expect(verificationLink.origin).toBe('http://127.0.0.1:3000');
    expect(verificationLink.pathname).toBe('/verify-email');
    expect(verificationLink.search).toBe('');

    /*
     * Extract the actual opaque token delivered through SMTP.
     *
     * We never retrieve the raw token from PostgreSQL because the
     * database must contain only its SHA-256 digest.
     */
    const token = extractVerificationToken(message.Text);

    expect(token).toMatch(/^[A-Za-z0-9_-]{43}$/u);
    expect(token).not.toContain('=');

    const tokenDigest = digestVerificationToken(token);

    const actorEmailBeforeConfirmation = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmailBeforeConfirmation.verifiedAt).toBeNull();

    const challenge = actorEmailBeforeConfirmation.verificationChallenge;

    if (!challenge) {
      throw new Error('Expected the SMTP-delivered verification challenge to exist.');
    }

    /*
     * This proves the raw emailed token was transformed into exactly
     * the SHA-256 representation stored by Identity & Access.
     */
    expect(challenge.tokenDigest).toBe(tokenDigest);

    expect(challenge.tokenDigest).toMatch(/^[0-9a-f]{64}$/u);

    expect(challenge.tokenDigest).not.toBe(token);

    expect(challenge.consumedAt).toBeNull();

    expect(challenge.expiresAt.getTime()).toBeGreaterThan(Date.now());

    /*
     * Deliberately do not send the Session cookie.
     *
     * Possession of the single-use emailed token is the verification
     * proof required by the confirmation endpoint.
     */
    await request(app.getHttpServer())
      .post('/email-verification/confirm')
      .send({
        token,
      })
      .expect(204);

    const actorEmailAfterConfirmation = await database.actorEmail.findUniqueOrThrow({
      where: {
        actorId,
      },
      include: {
        verificationChallenge: true,
      },
    });

    expect(actorEmailAfterConfirmation.verifiedAt).not.toBeNull();

    expect(actorEmailAfterConfirmation.verificationChallenge?.consumedAt).not.toBeNull();

    /*
     * Single-use semantics must still hold for the exact token that
     * was physically delivered through SMTP.
     */
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
  });
});
