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

function knowledgeAssetsResponse(assetIds: readonly string[]): Response {
  return new Response(
    JSON.stringify({
      assetIds,
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

  it('renders Anime Character and Series imagery through the existing shared Media presentation', async () => {
    const characterResourceId = '99999999-9999-4999-8999-999999999999';
    const seriesResourceId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaab';
    const characterAssetId = 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbc';
    const seriesAssetId = 'cccccccc-cccc-4ccc-8ccc-cccccccccccd';

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === '/api/knowledge/resources?universeKey=universe.anime') {
        return knowledgeListResponse([
          {
            id: characterResourceId,
            universeKey: 'universe.anime',
            resourceType: 'anime.character',
            createdAt: '2026-08-17T05:00:00.000Z',
            updatedAt: '2026-08-17T05:10:00.000Z',
          },
          {
            id: seriesResourceId,
            universeKey: 'universe.anime',
            resourceType: 'anime.series',
            createdAt: '2026-08-17T04:00:00.000Z',
            updatedAt: '2026-08-17T04:10:00.000Z',
          },
        ]);
      }

      if (url === `/api/knowledge/resources/${characterResourceId}/assets`) {
        return knowledgeAssetsResponse([characterAssetId]);
      }

      if (url === `/api/knowledge/resources/${seriesResourceId}/assets`) {
        return knowledgeAssetsResponse([seriesAssetId]);
      }

      throw new Error(`Unexpected Anime Media request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <KnowledgeUniverseSection
        title="Anime Resources"
        description="Anime Character and Series Media reuse proof."
        universeKey="universe.anime"
        imageResourceTypes={['anime.character', 'anime.series']}
        imageSectionLabel="Anime imagery"
      />,
    );

    const anime = screen.getByRole('region', {
      name: 'Anime Resources',
    });

    await within(anime).findByText('Character');
    await within(anime).findByText('Series');

    const characterImagery = await within(anime).findByRole('region', {
      name: 'Anime imagery for anime.character',
    });
    const seriesImagery = await within(anime).findByRole('region', {
      name: 'Anime imagery for anime.series',
    });

    const characterImage = within(characterImagery).getByRole('img', {
      name: 'Anime imagery for this published resource',
    });
    const seriesImage = within(seriesImagery).getByRole('img', {
      name: 'Anime imagery for this published resource',
    });

    expect(
      new URL(characterImage.getAttribute('src') ?? '', 'http://localhost:3000').pathname,
    ).toBe(`/api/media/assets/${characterAssetId}/thumbnail`);
    expect(new URL(seriesImage.getAttribute('src') ?? '', 'http://localhost:3000').pathname).toBe(
      `/api/media/assets/${seriesAssetId}/thumbnail`,
    );

    expect(
      within(characterImagery)
        .getByRole('link', {
          name: 'Open full-size anime imagery',
        })
        .getAttribute('href'),
    ).toBe(`/api/media/assets/${characterAssetId}/content`);
    expect(
      within(seriesImagery)
        .getByRole('link', {
          name: 'Open full-size anime imagery',
        })
        .getAttribute('href'),
    ).toBe(`/api/media/assets/${seriesAssetId}/content`);

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/knowledge/resources/${characterResourceId}/assets`,
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `/api/knowledge/resources/${seriesResourceId}/assets`,
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );
  });

  it('renders Devotional temple imagery through Knowledge Asset IDs and shared Media routes', async () => {
    const templeResourceId = '44444444-4444-4444-8444-444444444444';
    const deityResourceId = '55555555-5555-4555-8555-555555555555';
    const assetId = '66666666-6666-4666-8666-666666666666';

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === '/api/knowledge/resources?universeKey=universe.devotional') {
        return knowledgeListResponse([
          {
            id: templeResourceId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.temple',
            createdAt: '2026-08-16T05:00:00.000Z',
            updatedAt: '2026-08-16T05:10:00.000Z',
          },
          {
            id: deityResourceId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.deity',
            createdAt: '2026-08-16T04:00:00.000Z',
            updatedAt: '2026-08-16T04:10:00.000Z',
          },
        ]);
      }

      if (url === `/api/knowledge/resources/${templeResourceId}/assets`) {
        return knowledgeAssetsResponse([assetId]);
      }

      throw new Error(`Unexpected Devotional Media request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <KnowledgeUniverseSection
        title="Devotional Resources"
        description="Primary Devotional Media proof."
        universeKey="universe.devotional"
        priority="primary"
        imageResourceTypes={['devotional.temple']}
        imageSectionLabel="Temple imagery"
      />,
    );

    const devotional = screen.getByRole('region', {
      name: 'Devotional Resources',
    });

    await within(devotional).findByText('Temple');
    await within(devotional).findByText('Deity');

    const imagery = await within(devotional).findByRole('region', {
      name: 'Temple imagery for devotional.temple',
    });
    const image = within(imagery).getByRole('img', {
      name: 'Temple imagery for this published resource',
    });
    const fullImageLink = within(imagery).getByRole('link', {
      name: 'Open full-size temple imagery',
    });

    expect(new URL(image.getAttribute('src') ?? '', 'http://localhost:3000').pathname).toBe(
      `/api/media/assets/${assetId}/thumbnail`,
    );
    expect(fullImageLink.getAttribute('href')).toBe(`/api/media/assets/${assetId}/content`);

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/knowledge/resources/${templeResourceId}/assets`,
      expect.objectContaining({
        credentials: 'same-origin',
      }),
    );

    expect(fetchMock).not.toHaveBeenCalledWith(
      `/api/knowledge/resources/${deityResourceId}/assets`,
      expect.anything(),
    );
  });

  it('isolates Devotional imagery reference failure from the published Knowledge card', async () => {
    const templeResourceId = '77777777-7777-4777-8777-777777777777';

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === '/api/knowledge/resources?universeKey=universe.devotional') {
        return knowledgeListResponse([
          {
            id: templeResourceId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.temple',
            createdAt: '2026-08-16T05:00:00.000Z',
            updatedAt: '2026-08-16T05:10:00.000Z',
          },
        ]);
      }

      if (url === `/api/knowledge/resources/${templeResourceId}/assets`) {
        return new Response(
          JSON.stringify({
            error: {
              code: 'web.fixture.media_unavailable',
              message: 'Media unavailable.',
              status: 503,
            },
          }),
          {
            status: 503,
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
      }

      throw new Error(`Unexpected failure-isolation request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);

    render(
      <KnowledgeUniverseSection
        title="Devotional Resources"
        description="Primary Devotional Media proof."
        universeKey="universe.devotional"
        priority="primary"
        imageResourceTypes={['devotional.temple']}
        imageSectionLabel="Temple imagery"
      />,
    );

    const devotional = screen.getByRole('region', {
      name: 'Devotional Resources',
    });

    await within(devotional).findByText('Temple');

    expect(within(devotional).getByText('devotional.temple')).toBeTruthy();
    expect(
      await within(devotional).findByText('Temple imagery is temporarily unavailable.'),
    ).toBeTruthy();
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
          id: '88888888-8888-4888-8888-888888888888',
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
