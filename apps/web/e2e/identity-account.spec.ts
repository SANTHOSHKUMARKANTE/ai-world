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
});
