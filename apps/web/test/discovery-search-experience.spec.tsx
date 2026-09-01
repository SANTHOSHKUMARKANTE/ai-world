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
});

describe('Phase 6 Web Discovery integration', () => {
  it('searches globally and renders ranked cross-Universe results with Resource navigation', async () => {
    const animeId = '11111111-1111-4111-8111-111111111111';
    const devotionalId = '22222222-2222-4222-8222-222222222222';
    const fetchMock = vi.fn(async (input: unknown) => {
      expect(String(input)).toBe('/api/discovery/search?query=A&offset=0&limit=20');
      return jsonResponse({
        items: [
          { resourceId: animeId, resourceType: 'anime.character', universeKey: 'universe.anime' },
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
    const links = within(results).getAllByRole('link', { name: 'Open resource' });
    expect(links[0]?.getAttribute('href')).toBe(`/knowledge/resources/${animeId}`);
    expect(links[1]?.getAttribute('href')).toBe(`/knowledge/resources/${devotionalId}`);
    const items = within(results).getAllByRole('listitem');
    expect(within(items[0]!).getByText('anime.character')).toBeTruthy();
    expect(within(items[1]!).getByText('devotional.temple')).toBeTruthy();
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
    await screen.findByText('No published Search results.');
    expect(fetchMock).toHaveBeenCalledTimes(1);
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
