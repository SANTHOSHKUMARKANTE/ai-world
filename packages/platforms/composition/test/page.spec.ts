import { describe, expect, it } from 'vitest';

import {
  CreatePage,
  PAGE_ARCHIVED_LIFECYCLE,
  PAGE_INITIAL_LIFECYCLE,
  PAGE_PRESENTATION_TITLE_MAX_LENGTH,
  PAGE_PUBLISHED_LIFECYCLE,
  PAGE_ROUTE_PATH_MAX_LENGTH,
  isPageLifecycle,
  isPagePresentationTitle,
  isPageRoutePath,
  parsePagePresentationTitle,
  parsePageRoutePath,
  type CreatePageRecordInput,
  type Page,
  type PageWriter,
} from '../src';

function pageFromRecord(input: CreatePageRecordInput): Page {
  const now = new Date('2026-08-21T00:00:00.000Z');

  return {
    id: input.id,
    universeKey: input.universeKey,
    route: { path: input.routePath },
    presentation: { title: input.title },
    lifecycle: input.lifecycle,
    createdAt: now,
    updatedAt: now,
  };
}

describe('Page model', () => {
  it('defines a deliberately small Page lifecycle without Workflow states', () => {
    expect(PAGE_INITIAL_LIFECYCLE).toBe('DRAFT');
    expect(PAGE_PUBLISHED_LIFECYCLE).toBe('PUBLISHED');
    expect(PAGE_ARCHIVED_LIFECYCLE).toBe('ARCHIVED');

    expect(isPageLifecycle('DRAFT')).toBe(true);
    expect(isPageLifecycle('PUBLISHED')).toBe(true);
    expect(isPageLifecycle('ARCHIVED')).toBe(true);

    expect(isPageLifecycle('REVIEW')).toBe(false);
    expect(isPageLifecycle('APPROVED')).toBe(false);
    expect(isPageLifecycle('SCHEDULED')).toBe(false);
  });

  it('accepts canonical absolute route paths without normalizing them', () => {
    expect(isPageRoutePath('/')).toBe(true);
    expect(isPageRoutePath('/devotional')).toBe(true);
    expect(isPageRoutePath('/anime/character-spotlight')).toBe(true);
    expect(parsePageRoutePath('/anime/character-spotlight')).toBe('/anime/character-spotlight');
  });

  it('rejects ambiguous or non-canonical route paths', () => {
    for (const value of [
      '',
      'anime',
      '/anime/',
      '/anime//character',
      '/anime/./character',
      '/anime/../character',
      '/anime?tab=1',
      '/anime#character',
      '/anime character',
      '/anime\\character',
      `/${'a'.repeat(PAGE_ROUTE_PATH_MAX_LENGTH)}`,
    ]) {
      expect(isPageRoutePath(value)).toBe(false);
    }
  });

  it('requires bounded single-line presentation titles', () => {
    expect(isPagePresentationTitle('Devotional Home')).toBe(true);
    expect(parsePagePresentationTitle('Anime Spotlight')).toBe('Anime Spotlight');

    for (const value of [
      '',
      ' leading',
      'trailing ',
      'line\nbreak',
      'a'.repeat(PAGE_PRESENTATION_TITLE_MAX_LENGTH + 1),
    ]) {
      expect(isPagePresentationTitle(value)).toBe(false);
    }
  });

  it('creates a Universe-scoped DRAFT Page through the canonical writer', async () => {
    const records: CreatePageRecordInput[] = [];

    const writer: PageWriter = {
      async create(input) {
        records.push(input);
        return pageFromRecord(input);
      },
    };

    const createPage = new CreatePage(writer);

    const page = await createPage.execute({
      universeKey: 'universe.devotional',
      route: { path: '/home' },
      presentation: { title: 'Devotional Home' },
    });

    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      universeKey: 'universe.devotional',
      routePath: '/home',
      title: 'Devotional Home',
      lifecycle: 'DRAFT',
    });

    expect(page.universeKey).toBe('universe.devotional');
    expect(page.route.path).toBe('/home');
    expect(page.presentation.title).toBe('Devotional Home');
    expect(page.lifecycle).toBe('DRAFT');
  });

  it('rejects invalid Page creation input before persistence', async () => {
    const writer: PageWriter = {
      async create(input) {
        return pageFromRecord(input);
      },
    };

    const createPage = new CreatePage(writer);

    await expect(
      createPage.execute({
        universeKey: 'Universe.Devotional',
        route: { path: '/home' },
        presentation: { title: 'Devotional Home' },
      }),
    ).rejects.toBeInstanceOf(TypeError);

    await expect(
      createPage.execute({
        universeKey: 'universe.devotional',
        route: { path: 'home' },
        presentation: { title: 'Devotional Home' },
      }),
    ).rejects.toBeInstanceOf(TypeError);
  });
});
