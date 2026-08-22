import { parseResourceId } from '@ai-world/kernel-identifiers';
import { parseNamespacedKey } from '@ai-world/kernel-namespace';
import { describe, expect, it } from 'vitest';

import {
  ArchivePage,
  PublishPage,
  type FindPageByIdInput,
  type Page,
  type PageLifecycleWriter,
  type PageReader,
  type TransitionPageLifecycleRecordInput,
} from '../src';

const PAGE_ID = parseResourceId('11111111-1111-4111-8111-111111111111');

function createPage(lifecycle: Page['lifecycle'] = 'DRAFT'): Page {
  const now = new Date('2026-08-22T00:00:00.000Z');
  return {
    id: PAGE_ID,
    universeKey: parseNamespacedKey('universe.devotional'),
    route: { path: '/published-page' },
    presentation: { title: 'Published Page' },
    lifecycle,
    createdAt: now,
    updatedAt: now,
  };
}

class MutablePageRepository implements PageReader, PageLifecycleWriter {
  readonly transitions: TransitionPageLifecycleRecordInput[] = [];

  constructor(private page: Page | null) {}

  async findById(input: FindPageByIdInput): Promise<Page | null> {
    return input.id === this.page?.id ? this.page : null;
  }

  async findByRoute(): Promise<Page | null> {
    return this.page;
  }

  async transitionLifecycle(input: TransitionPageLifecycleRecordInput): Promise<Page | null> {
    this.transitions.push(input);
    if (input.id !== this.page?.id || this.page.lifecycle !== input.fromLifecycle) {
      return null;
    }
    this.page = { ...this.page, lifecycle: input.toLifecycle };
    return this.page;
  }
}

describe('Page publication lifecycle', () => {
  it('supports only DRAFT to PUBLISHED to ARCHIVED transitions', async () => {
    const repository = new MutablePageRepository(createPage());
    const publish = new PublishPage(repository, repository);
    const archive = new ArchivePage(repository, repository);

    await expect(publish.execute({ id: PAGE_ID })).resolves.toMatchObject({
      id: PAGE_ID,
      lifecycle: 'PUBLISHED',
    });
    await expect(archive.execute({ id: PAGE_ID })).resolves.toMatchObject({
      id: PAGE_ID,
      lifecycle: 'ARCHIVED',
    });
    expect(repository.transitions).toEqual([
      { id: PAGE_ID, fromLifecycle: 'DRAFT', toLifecycle: 'PUBLISHED' },
      { id: PAGE_ID, fromLifecycle: 'PUBLISHED', toLifecycle: 'ARCHIVED' },
    ]);
  });

  it('rejects repeated and reverse lifecycle transitions', async () => {
    const repository = new MutablePageRepository(createPage('PUBLISHED'));

    await expect(
      new PublishPage(repository, repository).execute({ id: PAGE_ID }),
    ).rejects.toMatchObject({
      code: 'composition.page.lifecycle_conflict',
      kind: 'conflict',
    });

    const archivedRepository = new MutablePageRepository(createPage('ARCHIVED'));
    await expect(
      new PublishPage(archivedRepository, archivedRepository).execute({ id: PAGE_ID }),
    ).rejects.toMatchObject({
      code: 'composition.page.lifecycle_conflict',
      kind: 'conflict',
    });
    await expect(
      new ArchivePage(archivedRepository, archivedRepository).execute({ id: PAGE_ID }),
    ).rejects.toMatchObject({
      code: 'composition.page.lifecycle_conflict',
      kind: 'conflict',
    });
  });

  it('returns not-found semantics when publication targets no Page', async () => {
    const repository = new MutablePageRepository(null);

    await expect(
      new PublishPage(repository, repository).execute({ id: PAGE_ID }),
    ).rejects.toMatchObject({
      code: 'composition.page.not_found',
      kind: 'not_found',
    });
  });
});
