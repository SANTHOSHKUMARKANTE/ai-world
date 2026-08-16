import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { KnowledgeUniverseSection } from '../src/knowledge/knowledge-universe-section';

interface KnowledgeFixture {
  readonly id: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

function knowledgeListResponse(items: readonly KnowledgeFixture[]): Response {
  return new Response(
    JSON.stringify({
      items,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

function renderKnowledgeExperience() {
  return render(
    <>
      <KnowledgeUniverseSection
        title="Devotional Resources"
        description="Primary Devotional experience."
        universeKey="universe.devotional"
        priority="primary"
      />

      <KnowledgeUniverseSection
        title="Anime Resources"
        description="Bounded Anime reuse proof."
        universeKey="universe.anime"
      />
    </>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Web Knowledge experience', () => {
  it('loads Devotional first and Anime through the same public Knowledge API contract', async () => {
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === '/api/knowledge/resources?universeKey=universe.devotional') {
        return knowledgeListResponse([
          {
            id: '11111111-1111-4111-8111-111111111111',
            universeKey: 'universe.devotional',
            resourceType: 'devotional.deity',
            createdAt: '2026-08-16T05:00:00.000Z',
            updatedAt: '2026-08-16T05:10:00.000Z',
          },
          {
            id: '22222222-2222-4222-8222-222222222222',
            universeKey: 'universe.devotional',
            resourceType: 'devotional.scripture',
            createdAt: '2026-08-16T04:00:00.000Z',
            updatedAt: '2026-08-16T04:10:00.000Z',
          },
        ]);
      }

      if (url === '/api/knowledge/resources?universeKey=universe.anime') {
        return knowledgeListResponse([
          {
            id: '33333333-3333-4333-8333-333333333333',
            universeKey: 'universe.anime',
            resourceType: 'anime.series',
            createdAt: '2026-08-16T03:00:00.000Z',
            updatedAt: '2026-08-16T03:10:00.000Z',
          },
        ]);
      }

      throw new Error(`Unexpected Web request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    renderKnowledgeExperience();

    const devotional = screen.getByRole('region', {
      name: 'Devotional Resources',
    });
    const anime = screen.getByRole('region', {
      name: 'Anime Resources',
    });

    await within(devotional).findByText('Deity');
    await within(anime).findByText('Series');

    expect(within(devotional).getByText('Scripture')).toBeTruthy();
    expect(within(devotional).queryByText('Series')).toBeNull();
    expect(within(anime).queryByText('Deity')).toBeNull();

    expect(devotional.getAttribute('data-priority')).toBe('primary');
    expect(anime.getAttribute('data-priority')).toBe('secondary');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/resources?universeKey=universe.devotional',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/resources?universeKey=universe.anime',
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
  });

  it('shows a bounded empty state without inventing domain content', async () => {
    const fetchMock = vi.fn(async () => {
      return knowledgeListResponse([]);
    });

    vi.stubGlobal('fetch', fetchMock);

    renderKnowledgeExperience();

    await waitFor(() => {
      expect(screen.getAllByText('No published resources yet.')).toHaveLength(2);
    });

    expect(screen.queryByText('DRAFT')).toBeNull();
    expect(screen.queryByText('ARCHIVED')).toBeNull();
  });

  it('keeps the Devotional and Anime views independently resilient to an invalid response', async () => {
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url.includes('universe.devotional')) {
        return new Response(
          JSON.stringify({
            items: [
              {
                id: 'bad-devotional-payload',
              },
            ],
          }),
          {
            status: 200,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      return knowledgeListResponse([
        {
          id: '44444444-4444-4444-8444-444444444444',
          universeKey: 'universe.anime',
          resourceType: 'anime.character',
          createdAt: '2026-08-16T02:00:00.000Z',
          updatedAt: '2026-08-16T02:10:00.000Z',
        },
      ]);
    });

    vi.stubGlobal('fetch', fetchMock);

    renderKnowledgeExperience();

    const devotional = screen.getByRole('region', {
      name: 'Devotional Resources',
    });
    const anime = screen.getByRole('region', {
      name: 'Anime Resources',
    });

    await within(devotional).findByRole('alert');
    await within(anime).findByText('Character');

    expect(
      within(devotional).getByText('Published Knowledge is temporarily unavailable.'),
    ).toBeTruthy();
  });
});
