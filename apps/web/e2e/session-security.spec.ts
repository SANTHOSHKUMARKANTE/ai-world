import { randomUUID } from 'node:crypto';

import { expect, test } from '@playwright/test';

const SESSION_COOKIE_NAME = 'ai_world_session';

interface BrowserSessionResponse {
  readonly actorId: string;
  readonly expiresAt: string;
}

test.describe('Real browser Session security', () => {
  test('keeps the opaque Session in an HttpOnly cookie across the real Web and API path', async ({
    context,
    page,
  }) => {
    const email = `playwright.${randomUUID()}@example.com`;
    const password = 'correct horse battery staple';
    const displayName = `Playwright ${randomUUID().slice(0, 8)}`;

    await page.goto('/register');

    await expect(
      page.getByRole('heading', {
        name: 'Create your account',
      }),
    ).toBeVisible();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);

    await page
      .getByRole('button', {
        name: 'Create account',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Account created',
      }),
    ).toBeVisible();

    await page
      .getByRole('link', {
        name: 'Sign in to your account',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Sign in',
      }),
    ).toBeVisible();

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);

    await page
      .getByRole('button', {
        name: 'Sign in',
      })
      .click();

    await expect(
      page.getByRole('heading', {
        name: 'Signed in',
      }),
    ).toBeVisible();

    const cookiesAfterSignIn = await context.cookies();

    const sessionCookie = cookiesAfterSignIn.find((cookie) => cookie.name === SESSION_COOKIE_NAME);

    expect(sessionCookie).toBeDefined();

    if (!sessionCookie) {
      throw new Error('Expected the authenticated browser to contain the AI World Session cookie.');
    }

    expect(sessionCookie.value.length).toBeGreaterThan(0);
    expect(sessionCookie.httpOnly).toBe(true);
    expect(sessionCookie.secure).toBe(false);
    expect(sessionCookie.sameSite).toBe('Lax');
    expect(sessionCookie.path).toBe('/');

    const browserStorage = await page.evaluate(() => {
      return {
        visibleCookieString: document.cookie,
        localStorageEntries: Object.entries(localStorage),
        sessionStorageEntries: Object.entries(sessionStorage),
      };
    });

    expect(browserStorage.visibleCookieString).not.toContain(`${SESSION_COOKIE_NAME}=`);

    expect(browserStorage.visibleCookieString).not.toContain(sessionCookie.value);

    expect(JSON.stringify(browserStorage.localStorageEntries)).not.toContain(sessionCookie.value);

    expect(JSON.stringify(browserStorage.sessionStorageEntries)).not.toContain(sessionCookie.value);

    expect(browserStorage.localStorageEntries.some(([key]) => key === SESSION_COOKIE_NAME)).toBe(
      false,
    );

    expect(browserStorage.sessionStorageEntries.some(([key]) => key === SESSION_COOKIE_NAME)).toBe(
      false,
    );

    await page
      .getByRole('link', {
        name: 'Continue',
      })
      .click();

    await expect(page.getByRole('heading', { name: 'Your account' })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('heading', { name: 'Your account' })).toBeVisible();

    const sessionResult = await page.evaluate(
      async (): Promise<{
        status: number;
        body: BrowserSessionResponse | null;
      }> => {
        const response = await fetch('/api/session', {
          credentials: 'same-origin',
        });

        if (!response.ok) {
          return {
            status: response.status,
            body: null,
          };
        }

        return {
          status: response.status,
          body: (await response.json()) as BrowserSessionResponse,
        };
      },
    );

    expect(sessionResult.status).toBe(200);
    expect(sessionResult.body).not.toBeNull();
    expect(sessionResult.body?.actorId).toEqual(expect.any(String));
    expect(sessionResult.body?.expiresAt).toEqual(expect.any(String));

    const displayNameInput = page.getByLabel('Display name');

    await expect(displayNameInput).toBeVisible();

    await displayNameInput.fill(displayName);

    const profileMutationRequestPromise = page.waitForRequest((request) => {
      return request.url().endsWith('/api/user-profile') && request.method() === 'PATCH';
    });

    await page
      .getByRole('button', {
        name: 'Save profile',
      })
      .click();

    const profileMutationRequest = await profileMutationRequestPromise;

    await expect(page.getByRole('status')).toHaveText('Profile updated.');

    const profileMutationBody = profileMutationRequest.postDataJSON() as Record<string, unknown>;

    expect(profileMutationBody).toEqual({
      displayName,
    });

    expect(profileMutationBody).not.toHaveProperty('actorId');

    expect(profileMutationBody).not.toHaveProperty('userId');

    expect(await displayNameInput.inputValue()).toBe(displayName);

    await page
      .getByRole('navigation', {
        name: 'Account',
      })
      .getByRole('button', {
        name: 'Sign out',
      })
      .click();

    await expect(page.getByText('You are signed out.')).toBeVisible();

    const cookiesAfterLogout = await context.cookies();

    expect(cookiesAfterLogout.some((cookie) => cookie.name === SESSION_COOKIE_NAME)).toBe(false);

    const sessionStatusAfterLogout = await page.evaluate(async () => {
      const response = await fetch('/api/session', {
        credentials: 'same-origin',
      });

      return response.status;
    });

    expect(sessionStatusAfterLogout).toBe(401);

    await page.reload();

    await expect(page.getByText('You are signed out.')).toBeVisible();
  });
});
