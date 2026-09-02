import { randomUUID } from 'node:crypto';

import { expect, test, type Page } from '@playwright/test';

const webOrigin = 'http://127.0.0.1:3100';
const apiOrigin = 'http://127.0.0.1:3001';
const mailpitOrigin = process.env.MAILPIT_HTTP_URL ?? 'http://127.0.0.1:8025';

interface MailpitAddress {
  readonly Address: string;
}

interface MailpitMessageSummary {
  readonly ID: string;
  readonly To: MailpitAddress[];
}

interface MailpitSearchResponse {
  readonly messages: MailpitMessageSummary[];
}

interface MailpitMessage {
  readonly Text: string;
}

function createEmail(label: string): string {
  return `uxp-09b-${label}-${randomUUID()}@example.com`;
}

function mailpitQuery(email: string): string {
  return encodeURIComponent(`to:"${email}"`);
}

async function deleteMailpitMessages(email: string): Promise<void> {
  const response = await fetch(`${mailpitOrigin}/api/v1/search?query=${mailpitQuery(email)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(`Mailpit cleanup failed with HTTP ${response.status}.`);
  }
}

async function waitForMailpitMessage(email: string): Promise<MailpitMessage> {
  const timeoutAt = Date.now() + 5_000;

  while (Date.now() < timeoutAt) {
    const searchResponse = await fetch(
      `${mailpitOrigin}/api/v1/search?query=${mailpitQuery(email)}&limit=10`,
    );

    if (!searchResponse.ok) {
      throw new Error(`Mailpit search failed with HTTP ${searchResponse.status}.`);
    }

    const search = (await searchResponse.json()) as MailpitSearchResponse;
    const message = search.messages.find((candidate) =>
      candidate.To.some(({ Address }) => Address.toLowerCase() === email.toLowerCase()),
    );

    if (message) {
      const messageResponse = await fetch(
        `${mailpitOrigin}/api/v1/message/${encodeURIComponent(message.ID)}`,
      );

      if (!messageResponse.ok) {
        throw new Error(`Mailpit message retrieval failed with HTTP ${messageResponse.status}.`);
      }

      return (await messageResponse.json()) as MailpitMessage;
    }

    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  throw new Error(`Timed out waiting for the UXP-09B email fixture for ${email}.`);
}

function extractLifecycleLink(
  text: string,
  expectedPath: '/verify-email' | '/reset-password',
): URL {
  const matches = text.match(/https?:\/\/[^\s]+/gu) ?? [];
  const link = matches
    .map((value) => new URL(value))
    .find(({ pathname }) => pathname === expectedPath);

  if (!link) {
    throw new Error(`Expected ${expectedPath} deep link in delivered email.`);
  }

  return link;
}

function getOpaqueFragmentToken(link: URL): string {
  const token = new URLSearchParams(link.hash.slice(1)).get('token');
  if (!token) {
    throw new Error('Expected an opaque token in the lifecycle-link fragment.');
  }

  return token;
}

async function register(page: Page, email: string, password: string): Promise<void> {
  await page.goto('/register');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByRole('heading', { name: 'Account created' })).toBeVisible();
}

async function tabUntilFocused(page: Page, label: string): Promise<void> {
  const control = page.getByLabel(label);

  for (let attempt = 0; attempt < 24; attempt += 1) {
    if (await control.evaluate((element) => element === document.activeElement)) {
      return;
    }

    await page.keyboard.press('Tab');
  }

  await expect(control).toBeFocused();
}

test.describe('UXP-09B finished verification and recovery/reset', () => {
  test('verification request delivers a safe deep link that confirms anonymously and survives refresh', async ({
    page,
  }) => {
    const email = createEmail('verification');
    const password = 'correct horse battery staple';

    await deleteMailpitMessages(email);

    try {
      await register(page, email, password);

      await page.goto('/sign-in?continueTo=%2Fverify-email');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
      await page.getByRole('link', { name: 'Continue' }).click();
      await expect(page).toHaveURL(`${webOrigin}/verify-email`);

      await page.getByRole('button', { name: 'Send verification email' }).click();
      await expect(
        page.getByText('If verification is still required, a verification email has been sent.'),
      ).toBeVisible();

      const message = await waitForMailpitMessage(email);
      const verificationLink = extractLifecycleLink(message.Text, '/verify-email');
      const token = getOpaqueFragmentToken(verificationLink);

      expect(verificationLink.origin).toBe(webOrigin);
      expect(verificationLink.search).toBe('');
      expect(verificationLink.hash).toMatch(/^#token=/u);

      await page.context().clearCookies();
      await page.goto(verificationLink.toString());

      await expect(page.getByText('Verification link recognized.')).toBeVisible();
      await expect(page.getByLabel('Verification token')).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText(token);

      await page.reload();
      await expect(page.getByText('Verification link recognized.')).toBeVisible();

      await page.getByRole('button', { name: 'Verify email' }).click();
      await expect(page.getByText('Your email has been verified.')).toBeVisible();
      expect(page.url()).not.toContain('#token=');
    } finally {
      await deleteMailpitMessages(email);
    }
  });

  test('recovery is enumeration-safe and the delivered deep link resets the password after refresh', async ({
    page,
  }) => {
    const email = createEmail('recovery');
    const originalPassword = 'correct horse battery staple';
    const newPassword = 'new correct horse battery staple';

    await deleteMailpitMessages(email);

    try {
      await register(page, email, originalPassword);

      await page.goto('/sign-in');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(originalPassword);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
      await page.getByRole('link', { name: 'Go to your account' }).click();
      await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
      await page.getByRole('link', { name: 'Go to your account' }).click();
      await expect(page).toHaveURL(`${webOrigin}/account`);

      await page.goto('/forgot-password');
      await page.getByLabel('Email').fill(email);
      await page.getByRole('button', { name: 'Recover password' }).click();

      await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
      await expect(
        page.getByText(
          'If this email can be recovered, password recovery instructions have been sent.',
        ),
      ).toBeVisible();

      const message = await waitForMailpitMessage(email);
      const recoveryLink = extractLifecycleLink(message.Text, '/reset-password');
      const token = getOpaqueFragmentToken(recoveryLink);

      expect(recoveryLink.origin).toBe(webOrigin);
      expect(recoveryLink.search).toBe('');
      expect(recoveryLink.hash).toMatch(/^#token=/u);

      await page.goto(recoveryLink.toString());

      await expect(page.getByText('Recovery link recognized.')).toBeVisible();
      await expect(page.getByLabel('Recovery token')).toHaveCount(0);
      await expect(page.locator('body')).not.toContainText(token);

      await page.reload();
      await expect(page.getByText('Recovery link recognized.')).toBeVisible();

      const newPasswordInput = page.getByLabel('New password');
      await expect(newPasswordInput).toHaveAttribute('minlength', '15');
      await expect(newPasswordInput).toHaveAttribute('maxlength', '128');
      await expect(page.getByText('Use 15–128 characters.')).toBeVisible();

      await newPasswordInput.fill(newPassword);
      await page.getByRole('button', { name: 'Reset password' }).click();

      await expect(page.getByRole('heading', { name: 'Password reset' })).toBeVisible();
      expect(page.url()).not.toContain('#token=');

      await page.goto('/account');
      await expect(page.getByText('You are signed out.')).toBeVisible();

      const oldCredentialResponse = await fetch(`${apiOrigin}/authentication/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: originalPassword }),
      });
      expect(oldCredentialResponse.ok).toBe(false);

      const newCredentialResponse = await fetch(`${apiOrigin}/authentication/password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: newPassword }),
      });
      expect(newCredentialResponse.status).toBe(200);
    } finally {
      await deleteMailpitMessages(email);
    }
  });

  test('unknown recovery email receives the same safe product result', async ({ page }) => {
    await page.goto('/forgot-password');
    await page.getByLabel('Email').fill(createEmail('unknown'));
    await page.getByRole('button', { name: 'Recover password' }).click();

    await expect(page.getByRole('heading', { name: 'Check your email' })).toBeVisible();
    await expect(
      page.getByText(
        'If this email can be recovered, password recovery instructions have been sent.',
      ),
    ).toBeVisible();
  });

  test('invalid verification and recovery links fail safely without exposing their token', async ({
    page,
  }) => {
    const invalidVerificationToken = 'A'.repeat(43);
    await page.goto(`/verify-email#token=${invalidVerificationToken}`);
    await expect(page.getByText('Verification link recognized.')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(invalidVerificationToken);
    await page.getByRole('button', { name: 'Verify email' }).click();
    await expect(page.getByRole('alert')).toBeVisible();

    const invalidRecoveryToken = 'B'.repeat(43);
    await page.goto(`/reset-password#token=${invalidRecoveryToken}`);
    await expect(page.getByText('Recovery link recognized.')).toBeVisible();
    await expect(page.locator('body')).not.toContainText(invalidRecoveryToken);
    await page.getByLabel('New password').fill('replacement password value');
    await page.getByRole('button', { name: 'Reset password' }).click();
    await expect(page.getByRole('alert')).toBeVisible();
  });

  test('UXP-09B lifecycle controls are keyboard reachable', async ({ page }) => {
    for (const [path, label] of [
      ['/forgot-password', 'Email'],
      ['/reset-password', 'Recovery token'],
      ['/verify-email', 'Verification token'],
    ] as const) {
      await page.goto(path);
      await tabUntilFocused(page, label);
      await expect(page.getByLabel(label)).toBeFocused();
    }
  });

  for (const viewport of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 834, height: 1112 },
    { name: 'desktop', width: 1440, height: 1000 },
  ] as const) {
    test(`UXP-09B routes remain readable without overflow at ${viewport.name} width`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);

      for (const path of ['/verify-email', '/forgot-password', '/reset-password']) {
        const response = await page.goto(path);
        expect(response?.status()).toBe(200);

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );
        expect(hasHorizontalOverflow).toBe(false);
      }
    });
  }
});
