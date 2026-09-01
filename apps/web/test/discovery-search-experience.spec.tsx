import { fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { SearchExperience } from '../src/discovery/search-experience';
import { PublicKnowledgeResourceDetail } from '../src/knowledge/public-knowledge-resource-detail';
import { SessionProvider } from '../src/session/session-provider';

function jsonResponse(payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  window.history.replaceState(null, '', '/');
});

describe('Phase 6 Web Discovery integration', () => {
  it('searches globally and renders ranked cross-Universe results with Resource navigation', async () => {
    const animeId = '11111111-1111-4111-8111-111111111111';
    const devotionalId = '22222222-2222-4222-8222-222222222222';
    const fetchMock = vi.fn(async (input: unknown) => {
      expect(String(input)).toBe('/api/discovery/search?query=A&offset=0&limit=20');
      return jsonResponse({
        items: [
          {
            resourceId: animeId,
            resourceType: 'anime.character',
            universeKey: 'universe.anime',
            slug: 'naruto-uzumaki',
            displayName: 'Naruto Uzumaki',
            summary: 'A shinobi determined to become Hokage.',
          },
          {
            resourceId: devotionalId,
            resourceType: 'devotional.temple',
            universeKey: 'universe.devotional',
          },
        ],
        pagination: { offset: 0, limit: 20 },
      });
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<SearchExperience />);
    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    const results = await screen.findByRole('list', { name: 'Search results' });
    const links = within(results).getAllByRole('link');
    expect(links[0]?.getAttribute('href')).toBe('/anime/characters/naruto-uzumaki');
    expect(links[1]?.getAttribute('href')).toBe(`/knowledge/resources/${devotionalId}`);
    const items = within(results).getAllByRole('listitem');
    expect(within(items[0]!).getByRole('heading', { name: 'Naruto Uzumaki' })).toBeTruthy();
    expect(within(items[0]!).getByText('Anime · Character')).toBeTruthy();
    expect(within(items[1]!).getByRole('heading', { name: 'Temple' })).toBeTruthy();
    expect(screen.queryByText(animeId, { exact: true })).toBeNull();
    expect(screen.queryByText('anime.character', { exact: true })).toBeNull();

    fireEvent.change(screen.getByLabelText('Search scope'), {
      target: { value: 'universe.devotional' },
    });
    expect(document.querySelector('.aw-search-results__header')?.textContent).toContain(
      'All Universes',
    );
  });

  it('sends Universe scope and exact multi-value Resource Type filters', async () => {
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = new URL(String(input), 'http://localhost');
      expect(url.pathname).toBe('/api/discovery/search');
      expect(url.searchParams.get('query')).toBe('.');
      expect(url.searchParams.get('universeKey')).toBe('universe.devotional');
      expect(url.searchParams.getAll('resourceType')).toEqual([
        'devotional.deity',
        'devotional.temple',
      ]);
      return jsonResponse({ items: [], pagination: { offset: 0, limit: 20 } });
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<SearchExperience />);
    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: '.' } });
    fireEvent.change(screen.getByLabelText('Search scope'), {
      target: { value: 'universe.devotional' },
    });
    fireEvent.click(screen.getByLabelText('Devotional deity'));
    fireEvent.click(screen.getByLabelText('Devotional temple'));
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    await screen.findByText('No published results found');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(window.location.search).toBe(
      '?query=.&universeKey=universe.devotional&resourceType=devotional.deity&resourceType=devotional.temple',
    );
  });

  it('clears stale Search URL state when a blank query is submitted', async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ items: [], pagination: { offset: 20, limit: 20 } }),
    );
    vi.stubGlobal('fetch', fetchMock);
    window.history.replaceState(null, '', '/search?query=temple&offset=20&utm_source=acceptance');

    render(<SearchExperience initialQuery="temple" initialOffset={20} />);
    await screen.findByText('No published results found');

    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    expect(window.location.search).toBe('?utm_source=acceptance');
  });

  it('keeps pagination on committed criteria and recovers from an empty speculative page', async () => {
    const items = Array.from({ length: 20 }, (_, index) => ({
      resourceId: `11111111-1111-4111-8111-${String(index).padStart(12, '0')}`,
      resourceType: 'anime.character',
      universeKey: 'universe.anime',
      slug: `character-${index}`,
      displayName: `Character ${index}`,
      summary: `Published character ${index}.`,
    }));
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = new URL(String(input), 'http://localhost');
      const offset = Number(url.searchParams.get('offset'));
      return jsonResponse({
        items: offset === 0 ? items : [],
        pagination: { offset, limit: 20 },
      });
    });
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SearchExperience
        initialQuery="character"
        initialUniverseKey="universe.anime"
        initialResourceTypes={['anime.character']}
      />,
    );

    await screen.findByText('Showing 1–20');
    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: 'temple' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('No published results found');

    expect(fetchMock).toHaveBeenCalledTimes(2);
    const nextRequest = new URL(String(fetchMock.mock.calls[1]?.[0]), 'http://localhost');
    expect(nextRequest.searchParams.get('query')).toBe('character');
    expect(nextRequest.searchParams.get('offset')).toBe('20');
    expect(window.location.search).toContain('query=character');
    expect(window.location.search).toContain('universeKey=universe.anime');
    expect(window.location.search).toContain('resourceType=anime.character');
    expect(window.location.search).toContain('offset=20');
    expect(screen.getByRole('button', { name: 'Previous' })).not.toHaveProperty('disabled', true);
    expect(screen.getByRole('button', { name: 'Next' })).toHaveProperty('disabled', true);

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));
    await screen.findByText('Showing 1–20');
    expect(fetchMock).toHaveBeenCalledTimes(3);
    const previousRequest = new URL(String(fetchMock.mock.calls[2]?.[0]), 'http://localhost');
    expect(previousRequest.searchParams.get('query')).toBe('character');
    expect(previousRequest.searchParams.get('offset')).toBe('0');
    expect(window.location.search).not.toContain('offset=');
  });

  it('keeps an unexpected Search failure bounded and retries the same request', async () => {
    let attempts = 0;
    const requests: URL[] = [];
    const fetchMock = vi.fn(async (input: unknown) => {
      requests.push(new URL(String(input), 'http://localhost'));
      attempts += 1;
      if (attempts === 1) {
        throw new Error('temporary failure');
      }
      return jsonResponse({ items: [], pagination: { offset: 0, limit: 20 } });
    });
    vi.stubGlobal('fetch', fetchMock);
    render(<SearchExperience />);

    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: 'temple' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));
    const alert = await screen.findByRole('alert');

    fireEvent.change(screen.getByLabelText('Search query'), { target: { value: 'character' } });
    fireEvent.click(within(alert).getByRole('button', { name: 'Try again' }));

    await screen.findByText('No published results found');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(requests[1]?.searchParams.get('query')).toBe('temple');
  });

  it('loads a Search result through the finished generic Knowledge fallback', async () => {
    const id = '33333333-3333-4333-8333-333333333333';
    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === '/api/session') {
        return new Response(
          JSON.stringify({
            error: {
              code: 'identity.session.unauthorized',
              message: 'Authentication is required.',
              status: 401,
            },
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      if (url === `/api/knowledge/resources/${id}`) {
        return jsonResponse({
          id,
          universeKey: 'universe.devotional',
          resourceType: 'devotional.temple',
          createdAt: '2026-08-18T09:00:00.000Z',
          updatedAt: '2026-08-18T09:10:00.000Z',
        });
      }

      if (url === `/api/knowledge/entities/by-resource/${id}`) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'knowledge.entity.public_not_found',
              message: 'Knowledge Entity not found.',
              status: 404,
            },
          }),
          {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          },
        );
      }

      if (url === `/api/knowledge/resources/${id}/assets`) {
        return jsonResponse({ assetIds: [] });
      }

      throw new Error(`Unexpected public Resource detail request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <PublicKnowledgeResourceDetail resourceId={id} />
      </SessionProvider>,
    );

    await screen.findByRole('heading', { name: 'Temple' });

    expect(screen.getByText('Devotional · Published Knowledge')).toBeTruthy();
    expect(screen.getByText('Published Temple in Devotional.')).toBeTruthy();
    expect(screen.queryByText('devotional.temple', { exact: true })).toBeNull();
    expect(screen.queryByText(id, { exact: true })).toBeNull();

    await vi.waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/knowledge/resources/${id}/assets`,
        expect.objectContaining({
          credentials: 'same-origin',
        }),
      );
    });
  });
});
