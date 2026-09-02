import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

const anonymousIdentityPages = [
  {
    path: '/register',
    heading: 'Create your account',
    controls: ['Email', 'Password'],
  },
  {
    path: '/sign-in',
    heading: 'Sign in',
    controls: ['Email', 'Password'],
  },
  {
    path: '/forgot-password',
    heading: 'Recover your password',
    controls: ['Email'],
  },
  {
    path: '/reset-password',
    heading: 'Reset your password',
    controls: ['Recovery token', 'New password'],
  },
  {
    path: '/verify-email',
    heading: 'Email verification',
    controls: ['Verification token'],
  },
] as const;

test.describe('WPR-M02 Identity and Account experience', () => {
  for (const identityPage of anonymousIdentityPages) {
    test(`${identityPage.path} uses the shared Identity presentation`, async ({ page }) => {
      const response = await page.goto(identityPage.path);

      expect(response?.status()).toBe(200);

      const main = page.getByRole('main');

      await expect(main).toHaveClass(/aw-identity-page/);
      await expect(
        main.getByRole('heading', {
          level: 1,
          name: identityPage.heading,
        }),
      ).toBeVisible();

      for (const label of identityPage.controls) {
        await expect(main.getByLabel(label)).toBeVisible();
      }
    });
  }

  test('anonymous Account presents safe recovery actions inside the Account experience', async ({
    page,
  }) => {
    const response = await page.goto('/account');

    expect(response?.status()).toBe(200);

    const main = page.getByRole('main');

    await expect(main.getByRole('heading', { level: 1, name: 'Your account' })).toBeVisible();
    await expect(main.getByText('You are signed out.')).toBeVisible();
    await expect(main.getByRole('link', { name: 'Sign in' })).toHaveAttribute('href', '/sign-in');
    await expect(main.getByRole('link', { name: 'Create account' })).toHaveAttribute(
      'href',
      '/register',
    );
    await expect(main.getByRole('link', { name: 'Verify your email' })).toHaveAttribute(
      'href',
      '/verify-email',
    );
  });

  test('Identity and Account pages remain usable at a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    for (const path of [...anonymousIdentityPages.map((entry) => entry.path), '/account']) {
      const response = await page.goto(path);

      expect(response?.status()).toBe(200);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );

      expect(hasHorizontalOverflow).toBe(false);
    }
  });

  test('UXP-09A registration communicates policy and the verification handoff', async ({
    page,
  }) => {
    await page.goto('/register');

    const password = page.getByLabel('Password');

    await expect(password).toHaveAttribute('minlength', '15');
    await expect(password).toHaveAttribute('maxlength', '128');
    await expect(page.getByText('Use 15–128 characters.')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Recover your password' })).toHaveAttribute(
      'href',
      '/forgot-password',
    );
  });

  test('UXP-09A keeps only safe first-party continuation for an authenticated visitor', async ({
    page,
  }) => {
    await page.route('**/api/session', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          actorId: 'authenticated-actor',
          expiresAt: '2026-09-02T12:00:00.000Z',
        }),
      });
    });

    await page.goto('/sign-in?continueTo=https%3A%2F%2Fmalicious.example');

    await expect(page.getByRole('heading', { name: 'You are already signed in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Continue' })).toHaveAttribute('href', '/account');

    await page.goto('/register');

    await expect(page.getByRole('heading', { name: 'You are already signed in' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Create account' })).toHaveCount(0);
  });

  for (const viewport of [
    { name: 'tablet', width: 834, height: 1112 },
    { name: 'desktop', width: 1440, height: 1000 },
  ] as const) {
    test(`UXP-09A remains readable at ${viewport.name} width`, async ({ page }) => {
      await page.setViewportSize(viewport);

      for (const path of ['/register', '/sign-in']) {
        await page.goto(path);

        await expect(page.getByRole('main')).toBeVisible();

        const hasHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
        );

        expect(hasHorizontalOverflow).toBe(false);
      }
    });
  }

  test('UXP-09C completes the real profile and Session journey', async ({ page }) => {
    const email = `uxp-09c-${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';

    await page.goto('/register');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Create account' }).click();
    await page.getByRole('link', { name: 'Sign in to your account' }).click();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('heading', { name: 'Signed in' })).toBeVisible();
    await page.getByRole('link', { name: 'Go to your account' }).click();
    await expect(page).toHaveURL(/\/account$/u);

    const main = page.getByRole('main');
    const displayName = main.getByLabel('Display name');
    await expect(displayName).toHaveAttribute('maxlength', '80');
    await displayName.fill('  UXP 09C Profile  ');
    await main.getByRole('button', { name: 'Save profile' }).click();
    await expect(main.getByRole('status')).toContainText('Profile updated.');
    await expect(displayName).toHaveValue('UXP 09C Profile');

    await main.getByRole('button', { name: 'Clear display name' }).click();
    await expect(displayName).toHaveValue('');

    await main.getByRole('button', { name: 'Sign out' }).click();
    await expect(main.getByText('You are signed out.')).toBeVisible();
    await expect(main.getByLabel('Display name')).toHaveCount(0);
    await expect(
      page.getByRole('navigation', { name: 'Account' }).getByRole('link', { name: 'Sign in' }),
    ).toBeVisible();

    await page.reload();
    await expect(main.getByText('You are signed out.')).toBeVisible();
    await expect(main.getByLabel('Display name')).toHaveCount(0);
  });
});
