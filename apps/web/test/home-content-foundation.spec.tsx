import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { HomeKnowledgeFoundation } from '../src/home/home-knowledge-foundation';

function discoveryResponse(items: readonly Record<string, unknown>[]): Response {
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function resource(universeKey: 'universe.devotional' | 'universe.anime'): Record<string, unknown> {
  const devotional = universeKey === 'universe.devotional';

  return {
    resourceId: devotional
      ? '11111111-1111-4111-8111-111111111111'
      : '22222222-2222-4222-8222-222222222222',
    universeKey,
    resourceType: devotional ? 'devotional.deity' : 'anime.character',
    slug: devotional ? 'shiva' : 'naruto-uzumaki',
    displayName: devotional ? 'Lord Shiva' : 'Naruto Uzumaki',
    summary: devotional ? 'Published Devotional Knowledge.' : 'Published Anime Knowledge.',
    updatedAt: '2026-09-03T08:00:00.000Z',
    previewMedia: null,
  };
}

function stubMotionPreference(): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: true,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-11A Home content foundation', () => {
  it('loads a bounded public feed for each Universe and uses canonical destinations', async () => {
    stubMotionPreference();
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      return discoveryResponse([
        resource(url.includes('universe.devotional') ? 'universe.devotional' : 'universe.anime'),
      ]);
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<HomeKnowledgeFoundation />);

    const devotional = screen.getByRole('region', { name: 'Devotional Knowledge' });
    const anime = screen.getByRole('region', { name: 'Anime Knowledge' });

    await within(devotional).findByRole('heading', { name: 'Lord Shiva' });
    await within(anime).findByRole('heading', { name: 'Naruto Uzumaki' });

    expect(
      within(devotional).getByRole('link', { name: 'Open Lord Shiva' }).getAttribute('href'),
    ).toBe('/devotional/shiva');
    expect(
      within(anime).getByRole('link', { name: 'Open Naruto Uzumaki' }).getAttribute('href'),
    ).toBe('/anime/characters/naruto-uzumaki');
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/discovery?universeKey=universe.devotional&limit=3',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/discovery?universeKey=universe.anime&limit=3',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
  });

  it('keeps a healthy Universe and static continuation paths when the other feed fails', async () => {
    stubMotionPreference();
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: unknown) => {
        const url = String(input);
        if (url.includes('universe.devotional')) {
          return new Response(JSON.stringify({ error: { code: 'temporarily-unavailable' } }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return discoveryResponse([resource('universe.anime')]);
      }),
    );

    render(<HomeKnowledgeFoundation />);

    const devotional = screen.getByRole('region', { name: 'Devotional Knowledge' });
    const anime = screen.getByRole('region', { name: 'Anime Knowledge' });

    await within(devotional).findByRole('alert');
    await within(anime).findByRole('heading', { name: 'Naruto Uzumaki' });
    expect(
      screen.getByRole('link', { name: 'Browse all published Knowledge' }).getAttribute('href'),
    ).toBe('/knowledge');
    expect(screen.getByRole('link', { name: 'Search across Universes' }).getAttribute('href')).toBe(
      '/search',
    );
  });

  it('states the honest empty condition independently for both Universes', async () => {
    stubMotionPreference();
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => discoveryResponse([])),
    );

    render(<HomeKnowledgeFoundation />);

    await waitFor(() => {
      expect(screen.getAllByText('No published resources yet.')).toHaveLength(2);
    });
    expect(screen.queryByText(/featured|trending|recommended for you/i)).toBeNull();
  });
});
