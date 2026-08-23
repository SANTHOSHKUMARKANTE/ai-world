import { expect, test } from '@playwright/test';

const MOBILE_ROUTES = [
  '/',
  '/register',
  '/sign-in',
  '/account',
  '/knowledge',
  '/search',
  '/saved',
  '/creator',
] as const;

interface LabMetrics {
  cls: number;
  lcp: number;
  inp: number;
  eventTimingSupported: boolean;
}

function channelToLinear(channel: number): number {
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hexColor: string): number {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/iu.exec(hexColor.trim());
  if (!match?.[1]) {
    throw new Error(`Expected a three- or six-digit hex color; received ${hexColor}.`);
  }

  const compact = match[1];
  const value =
    compact.length === 3 ? [...compact].map((channel) => `${channel}${channel}`).join('') : compact;
  const red = channelToLinear(Number.parseInt(value.slice(0, 2), 16));
  const green = channelToLinear(Number.parseInt(value.slice(2, 4), 16));
  const blue = channelToLinear(Number.parseInt(value.slice(4, 6), 16));

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(foreground: string, background: string): number {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

function maxCssDuration(millisecondsOrSeconds: string): number {
  return Math.max(
    ...millisecondsOrSeconds.split(',').map((value) => {
      const trimmed = value.trim();
      if (trimmed.endsWith('ms')) {
        return Number.parseFloat(trimmed);
      }
      if (trimmed.endsWith('s')) {
        return Number.parseFloat(trimmed) * 1000;
      }
      return Number.parseFloat(trimmed) || 0;
    }),
  );
}

test.describe('WPR-M05 product quality', () => {
  test('provides a keyboard skip path with visible focus', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    const outlineWidth = await skipLink.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).outlineWidth),
    );
    expect(outlineWidth).toBeGreaterThanOrEqual(2);

    await page.keyboard.press('Enter');
    await expect(page.locator('#aw-main-content')).toBeFocused();
  });

  test('keeps critical routes semantically sane and overflow-free on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });

    const serverErrors: string[] = [];
    page.on('response', (response) => {
      if (response.status() >= 500) {
        serverErrors.push(`${response.status()} ${response.url()}`);
      }
    });

    for (const path of MOBILE_ROUTES) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);

      await expect(page.getByRole('main'), path).toHaveCount(1);
      await expect(page.getByRole('heading', { level: 1 }), path).toHaveCount(1);

      const duplicateIds = await page.evaluate(() => {
        const ids = [...document.querySelectorAll<HTMLElement>('[id]')]
          .map((element) => element.id)
          .filter(Boolean);
        return ids.filter((id, index) => ids.indexOf(id) !== index);
      });
      expect(duplicateIds, path).toEqual([]);

      const hasHorizontalOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      );
      expect(hasHorizontalOverflow, path).toBe(false);
    }

    expect(serverErrors).toEqual([]);
  });

  test('keeps Identity forms labelled and error feedback announced', async ({ page }) => {
    await page.route('**/api/authentication/password', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'identity.authentication.invalid_credentials',
            message: 'The email or password is incorrect.',
            status: 401,
          },
        }),
      });
    });

    const response = await page.goto('/sign-in');
    expect(response?.status()).toBe(200);

    const main = page.getByRole('main');
    const email = main.getByLabel('Email');
    const password = main.getByLabel('Password');

    await expect(email).toBeVisible();
    await expect(password).toBeVisible();
    await expect(main.getByRole('button', { name: 'Sign in' })).toBeVisible();

    await email.fill('quality@example.com');
    await password.fill('incorrect password');
    await main.getByRole('button', { name: 'Sign in' }).click();

    await expect(main.getByRole('alert')).toBeVisible();
  });

  test('honors reduced motion and semantic contrast guardrails', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    const explore = page.getByRole('link', { name: 'Explore Knowledge', exact: true });
    await explore.hover();

    const motion = await explore.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        transform: style.transform,
        transitionDuration: style.transitionDuration,
        animationDuration: style.animationDuration,
      };
    });

    expect(motion.transform).toBe('none');
    expect(maxCssDuration(motion.transitionDuration)).toBeLessThanOrEqual(0.1);
    expect(maxCssDuration(motion.animationDuration)).toBeLessThanOrEqual(0.1);

    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      const token = (name: string) => style.getPropertyValue(name).trim();
      return {
        surface: token('--aw-surface'),
        raised: token('--aw-surface-raised'),
        text: token('--aw-text'),
        muted: token('--aw-text-muted'),
        brand: token('--aw-brand'),
        success: token('--aw-success'),
        warning: token('--aw-warning'),
        danger: token('--aw-danger'),
        focus: token('--aw-focus'),
      };
    });

    expect(contrastRatio(tokens.text, tokens.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.muted, tokens.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.brand, tokens.raised)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.success, tokens.raised)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.warning, tokens.raised)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.danger, tokens.raised)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(tokens.focus, tokens.raised)).toBeGreaterThanOrEqual(3);
  });

  test('meets warm local lab Core Web Vitals guardrails', async ({ page }) => {
    await page.goto('/sign-in');
    await page.addInitScript(() => {
      const metrics: LabMetrics = {
        cls: 0,
        lcp: 0,
        inp: 0,
        eventTimingSupported: PerformanceObserver.supportedEntryTypes.includes('event'),
      };

      (
        window as typeof window & {
          __aiWorldQualityMetrics?: LabMetrics;
        }
      ).__aiWorldQualityMetrics = metrics;

      if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const shift = entry as PerformanceEntry & {
              readonly hadRecentInput?: boolean;
              readonly value?: number;
            };
            if (!shift.hadRecentInput) {
              metrics.cls += shift.value ?? 0;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });
      }

      if (PerformanceObserver.supportedEntryTypes.includes('largest-contentful-paint')) {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const last = entries.at(-1);
          if (last) {
            metrics.lcp = last.startTime;
          }
        }).observe({ type: 'largest-contentful-paint', buffered: true });
      }

      if (metrics.eventTimingSupported) {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const eventEntry = entry as PerformanceEntry & {
              readonly interactionId?: number;
            };
            if ((eventEntry.interactionId ?? 0) > 0) {
              metrics.inp = Math.max(metrics.inp, eventEntry.duration);
            }
          }
        });
        (
          observer.observe as (
            options: PerformanceObserverInit & { readonly durationThreshold?: number },
          ) => void
        )({
          type: 'event',
          buffered: true,
          durationThreshold: 16,
        });
      }
    });

    await page.reload({ waitUntil: 'networkidle' });

    await page.route('**/api/authentication/password', async (route) => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 'identity.authentication.invalid_credentials',
            message: 'The email or password is incorrect.',
            status: 401,
          },
        }),
      });
    });

    await page.getByLabel('Email').fill('lab@example.com');
    await page.getByLabel('Password').fill('incorrect password');

    await page.evaluate(() => {
      const metrics = (
        window as typeof window & {
          __aiWorldQualityMetrics?: LabMetrics;
        }
      ).__aiWorldQualityMetrics;
      if (metrics) {
        metrics.inp = 0;
      }
    });

    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('main').getByRole('alert')).toBeVisible();
    await page.waitForTimeout(250);

    const metrics = await page.evaluate(() => {
      return (
        window as typeof window & {
          __aiWorldQualityMetrics?: LabMetrics;
        }
      ).__aiWorldQualityMetrics;
    });

    expect(metrics).toBeTruthy();
    if (!metrics) {
      throw new Error('Expected local performance metrics.');
    }

    console.log(`WPR-M05 lab metrics ${JSON.stringify(metrics)}`);

    expect(metrics.lcp).toBeGreaterThan(0);
    expect(metrics.lcp).toBeLessThanOrEqual(2500);
    expect(metrics.cls).toBeLessThanOrEqual(0.1);
    expect(metrics.eventTimingSupported).toBe(true);
    expect(metrics.inp).toBeLessThanOrEqual(200);
  });
});
