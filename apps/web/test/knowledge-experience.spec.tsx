import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { KnowledgeUniverseSection } from '../src/knowledge/knowledge-universe-section';

interface DiscoveryFixture {
  readonly resourceId: string;
  readonly universeKey: string;
  readonly resourceType: string;
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
  readonly updatedAt: string;
  readonly previewMedia: {
    readonly assetId: string;
    readonly assetType: 'IMAGE' | 'VIDEO';
    readonly mimeType: string;
    readonly playback: 'STILL' | 'SHORT_LOOP';
    readonly posterAssetId: string | null;
    readonly altText: string | null;
  } | null;
}

function discoveryResponse(items: readonly DiscoveryFixture[]): Response {
  return new Response(JSON.stringify({ items }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function stubMotionPreference(reduced = false): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn((query: string) => ({
      matches: reduced,
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

function devotionalFixture(overrides: Partial<DiscoveryFixture> = {}): DiscoveryFixture {
  return {
    resourceId: '11111111-1111-4111-8111-111111111111',
    universeKey: 'universe.devotional',
    resourceType: 'devotional.deity',
    slug: 'shiva',
    displayName: 'Lord Shiva',
    summary: 'Published Devotional Knowledge identity.',
    updatedAt: '2026-08-30T09:00:00.000Z',
    previewMedia: null,
    ...overrides,
  };
}

function animeFixture(overrides: Partial<DiscoveryFixture> = {}): DiscoveryFixture {
  return {
    resourceId: '22222222-2222-4222-8222-222222222222',
    universeKey: 'universe.anime',
    resourceType: 'anime.character',
    slug: 'naruto-uzumaki',
    displayName: 'Naruto Uzumaki',
    summary: 'Published Anime Knowledge identity.',
    updatedAt: '2026-08-30T10:00:00.000Z',
    previewMedia: null,
    ...overrides,
  };
}

function renderKnowledgeExperience() {
  return render(
    <>
      <KnowledgeUniverseSection
        sectionId="unit-devotional"
        title="Devotional Knowledge"
        description="Primary Devotional discovery proof."
        universeKey="universe.devotional"
        priority="primary"
        tone="devotional"
      />
      <KnowledgeUniverseSection
        sectionId="unit-anime"
        title="Anime Knowledge"
        description="Anime discovery reuse proof."
        universeKey="universe.anime"
        tone="anime"
      />
    </>,
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Web Knowledge experience', () => {
  it('loads both Universes through public discovery with real identity and canonical destinations', async () => {
    stubMotionPreference();
    const devotional = devotionalFixture();
    const anime = animeFixture();

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url === '/api/knowledge/discovery?universeKey=universe.devotional&limit=8') {
        return discoveryResponse([devotional]);
      }
      if (url === '/api/knowledge/discovery?universeKey=universe.anime&limit=8') {
        return discoveryResponse([anime]);
      }
      throw new Error(`Unexpected Knowledge discovery request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
    renderKnowledgeExperience();

    const devotionalRegion = screen.getByRole('region', { name: 'Devotional Knowledge' });
    const animeRegion = screen.getByRole('region', { name: 'Anime Knowledge' });

    await within(devotionalRegion).findByRole('heading', { name: 'Lord Shiva' });
    await within(animeRegion).findByRole('heading', { name: 'Naruto Uzumaki' });

    expect(
      within(devotionalRegion).getByRole('link', { name: 'Open Lord Shiva' }).getAttribute('href'),
    ).toBe('/devotional/shiva');
    expect(
      within(animeRegion).getByRole('link', { name: 'Open Naruto Uzumaki' }).getAttribute('href'),
    ).toBe('/anime/characters/naruto-uzumaki');

    expect(within(devotionalRegion).getByText('Deity')).toBeTruthy();
    expect(within(animeRegion).getByText('Character')).toBeTruthy();
    expect(screen.queryByText(devotional.resourceId, { exact: true })).toBeNull();
    expect(screen.queryByText(anime.resourceId, { exact: true })).toBeNull();
    expect(devotionalRegion.getAttribute('data-priority')).toBe('primary');
    expect(animeRegion.getAttribute('data-priority')).toBe('secondary');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/discovery?universeKey=universe.devotional&limit=8',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/knowledge/discovery?universeKey=universe.anime&limit=8',
      expect.objectContaining({ credentials: 'same-origin' }),
    );
  });

  it('renders IMAGE, SHORT_LOOP and no-Media directly from discovery', async () => {
    stubMotionPreference(false);

    const image = devotionalFixture({
      previewMedia: {
        assetId: '33333333-3333-4333-8333-333333333333',
        assetType: 'IMAGE',
        mimeType: 'image/png',
        playback: 'STILL',
        posterAssetId: null,
        altText: 'Lord Shiva portrait',
      },
    });
    const shortLoop = animeFixture({
      previewMedia: {
        assetId: '44444444-4444-4444-8444-444444444444',
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: '55555555-5555-4555-8555-555555555555',
        altText: 'Naruto Uzumaki short motion',
      },
    });
    const noMedia = animeFixture({
      resourceId: '66666666-6666-4666-8666-666666666666',
      resourceType: 'anime.series',
      slug: 'naruto',
      displayName: 'Naruto',
      previewMedia: null,
    });

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.includes('universe.devotional')) return discoveryResponse([image]);
      if (url.includes('universe.anime')) return discoveryResponse([shortLoop, noMedia]);
      throw new Error(`Unexpected Knowledge Media request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
    renderKnowledgeExperience();

    expect(await screen.findByAltText('Lord Shiva portrait')).toBeTruthy();
    expect(await screen.findByLabelText('Naruto Uzumaki short motion')).toBeTruthy();

    const animeRegion = screen.getByRole('region', { name: 'Anime Knowledge' });
    const noMediaCard = within(animeRegion).getByRole('link', { name: 'Open Naruto' });
    expect(noMediaCard.querySelector('[data-preview-kind="none"]')).toBeTruthy();

    const video = screen.getByLabelText('Naruto Uzumaki short motion') as HTMLVideoElement;
    expect(video.muted).toBe(true);
    expect(video.autoplay).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.playsInline).toBe(true);
  });

  it('keeps one Universe healthy when the other discovery response is invalid', async () => {
    stubMotionPreference();

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.includes('universe.devotional')) {
        return new Response(JSON.stringify({ items: [{ resourceId: 'invalid-only' }] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return discoveryResponse([]);
    });

    vi.stubGlobal('fetch', fetchMock);
    renderKnowledgeExperience();

    const devotionalRegion = screen.getByRole('region', { name: 'Devotional Knowledge' });
    const animeRegion = screen.getByRole('region', { name: 'Anime Knowledge' });

    await within(devotionalRegion).findByRole('alert');
    await waitFor(() => {
      expect(within(animeRegion).getByText('No published resources yet.')).toBeTruthy();
    });

    expect(
      within(devotionalRegion).getByText('Devotional Knowledge is temporarily unavailable.'),
    ).toBeTruthy();
  });

  it('retries only the failed Universe and recovers without replacing the healthy section', async () => {
    stubMotionPreference();
    let devotionalAttempts = 0;

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      if (url.includes('universe.devotional')) {
        devotionalAttempts += 1;
        if (devotionalAttempts === 1) {
          return new Response(JSON.stringify({ error: { code: 'test.failure' } }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          });
        }
        return discoveryResponse([devotionalFixture()]);
      }
      return discoveryResponse([animeFixture()]);
    });

    vi.stubGlobal('fetch', fetchMock);
    renderKnowledgeExperience();

    const devotionalRegion = screen.getByRole('region', { name: 'Devotional Knowledge' });
    const animeRegion = screen.getByRole('region', { name: 'Anime Knowledge' });

    await within(devotionalRegion).findByRole('alert');
    await within(animeRegion).findByRole('heading', { name: 'Naruto Uzumaki' });
    within(devotionalRegion).getByRole('button', { name: 'Try again' }).click();
    await within(devotionalRegion).findByRole('heading', { name: 'Lord Shiva' });

    expect(devotionalAttempts).toBe(2);
    expect(within(animeRegion).getByRole('heading', { name: 'Naruto Uzumaki' })).toBeTruthy();
  });

  it('uses the poster instead of ambient motion when reduced motion is requested', async () => {
    stubMotionPreference(true);

    const shortLoop = animeFixture({
      previewMedia: {
        assetId: '77777777-7777-4777-8777-777777777777',
        assetType: 'VIDEO',
        mimeType: 'video/mp4',
        playback: 'SHORT_LOOP',
        posterAssetId: '88888888-8888-4888-8888-888888888888',
        altText: 'Reduced motion Character preview',
      },
    });

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);
      return url.includes('universe.anime')
        ? discoveryResponse([shortLoop])
        : discoveryResponse([]);
    });

    vi.stubGlobal('fetch', fetchMock);
    renderKnowledgeExperience();

    const animeRegion = screen.getByRole('region', { name: 'Anime Knowledge' });
    await within(animeRegion).findByRole('heading', { name: 'Naruto Uzumaki' });

    expect(
      animeRegion.querySelector('video[data-knowledge-discovery-short-loop="true"]'),
    ).toBeNull();
    expect(animeRegion.querySelector('[data-preview-kind="video-poster"]')).toBeTruthy();
    expect(within(animeRegion).getByAltText('Reduced motion Character preview')).toBeTruthy();
  });
});
