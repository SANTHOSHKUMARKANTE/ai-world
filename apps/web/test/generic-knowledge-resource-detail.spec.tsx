import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PublicKnowledgeResourceDetail } from '../src/knowledge/public-knowledge-resource-detail';

vi.mock('../src/engagement/resource-engagement-controls', () => ({
  ResourceEngagementControls: ({ resourceId }: { resourceId: string }) => (
    <div data-testid="engagement-controls">{`engagement:${resourceId}`}</div>
  ),
}));

const RESOURCE_ID = '11111111-1111-4111-8111-111111111111';

function response(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function resourcePayload() {
  return {
    id: RESOURCE_ID,
    universeKey: 'universe.devotional',
    resourceType: 'devotional.temple',
    createdAt: '2026-08-30T08:00:00.000Z',
    updatedAt: '2026-08-31T08:00:00.000Z',
  };
}

function entityPayload() {
  return {
    resource: {
      id: RESOURCE_ID,
      universeKey: 'universe.devotional',
      resourceType: 'devotional.temple',
    },
    profile: {
      slug: 'kashi-vishwanath',
      displayName: 'Kashi Vishwanath Temple',
      nativeName: 'काशी विश्वनाथ मंदिर',
      alternateNames: ['Golden Temple'],
      summary: 'A published sacred-place Knowledge fixture.',
      overview: 'A longer public overview for the finished generic fallback.',
      facts: [{ key: 'devotional.location', label: 'Location', value: 'Varanasi' }],
    },
    media: [
      {
        assetId: '22222222-2222-4222-8222-222222222222',
        assetType: 'IMAGE',
        mimeType: 'image/png',
        role: 'HERO',
        playback: 'STILL',
        position: 0,
        altText: 'Temple artwork',
        caption: 'Published hero',
        posterAssetId: null,
      },
    ],
    relations: [
      {
        sectionKey: 'entity.temples',
        relationshipType: 'devotional.association',
        position: 0,
        target: {
          id: '33333333-3333-4333-8333-333333333333',
          universeKey: 'universe.devotional',
          resourceType: 'devotional.deity',
          slug: 'shiva',
          displayName: 'Lord Shiva',
          summary: 'Related published Deity.',
          previewAssetId: null,
        },
      },
    ],
  };
}

function stubMotion(reduced = false): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: reduced,
      media: '(prefers-reduced-motion: reduce)',
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

describe('finished generic Knowledge Resource detail', () => {
  it('uses rich public Entity identity without exposing raw IDs as product identity', async () => {
    stubMotion();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: unknown) => {
        const url = String(input);
        if (url === `/api/knowledge/resources/${RESOURCE_ID}`) {
          return response(resourcePayload());
        }
        if (url === `/api/knowledge/entities/by-resource/${RESOURCE_ID}`) {
          return response(entityPayload());
        }
        throw new Error(`Unexpected request: ${url}`);
      }),
    );

    render(<PublicKnowledgeResourceDetail resourceId={RESOURCE_ID} />);

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Kashi Vishwanath Temple' }),
    ).toBeTruthy();
    expect(screen.getByText('A published sacred-place Knowledge fixture.')).toBeTruthy();
    expect(screen.getByText('Varanasi')).toBeTruthy();
    expect(screen.getByText('Golden Temple')).toBeTruthy();
    expect(screen.queryByText(RESOURCE_ID, { exact: true })).toBeNull();
    expect(screen.queryByText('devotional.temple', { exact: true })).toBeNull();
    expect(screen.getByTestId('engagement-controls').textContent).toContain(RESOURCE_ID);
    expect(screen.getByRole('link', { name: /^Lord Shiva/ }).getAttribute('href')).toBe(
      '/devotional/shiva',
    );
  });

  it('keeps a truthful profileless generic fallback and still composes Engagement', async () => {
    stubMotion();

    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: unknown) => {
        const url = String(input);
        if (url === `/api/knowledge/resources/${RESOURCE_ID}`) {
          return response(resourcePayload());
        }
        if (url === `/api/knowledge/entities/by-resource/${RESOURCE_ID}`) {
          return response(
            {
              error: {
                code: 'knowledge.entity.public_not_found',
                message: 'Knowledge Entity not found.',
                status: 404,
              },
            },
            404,
          );
        }
        if (url === `/api/knowledge/resources/${RESOURCE_ID}/assets`) {
          return response({ assetIds: [] });
        }
        throw new Error(`Unexpected request: ${url}`);
      }),
    );

    render(<PublicKnowledgeResourceDetail resourceId={RESOURCE_ID} />);

    expect(await screen.findByRole('heading', { level: 1, name: 'Temple' })).toBeTruthy();
    expect(screen.getByText(/Published Temple in Devotional/)).toBeTruthy();
    expect(screen.queryByText(RESOURCE_ID, { exact: true })).toBeNull();
    expect(screen.getByTestId('engagement-controls')).toBeTruthy();
  });

  it('distinguishes not-found from unexpected errors and retries an unexpected failure', async () => {
    stubMotion();
    let attempts = 0;

    const fetchMock = vi.fn(async (input: unknown) => {
      const url = String(input);

      if (url === `/api/knowledge/resources/${RESOURCE_ID}`) {
        attempts += 1;
        if (attempts === 1) {
          return response(
            { error: { code: 'test.failure', message: 'Failed.', status: 500 } },
            500,
          );
        }
        return response(resourcePayload());
      }

      if (url === `/api/knowledge/entities/by-resource/${RESOURCE_ID}`) {
        return response(
          {
            error: {
              code: 'knowledge.entity.public_not_found',
              message: 'Knowledge Entity not found.',
              status: 404,
            },
          },
          404,
        );
      }

      if (url === `/api/knowledge/resources/${RESOURCE_ID}/assets`) {
        return response({ assetIds: [] });
      }

      throw new Error(`Unexpected request: ${url}`);
    });

    vi.stubGlobal('fetch', fetchMock);
    render(<PublicKnowledgeResourceDetail resourceId={RESOURCE_ID} />);

    expect(await screen.findByRole('alert')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));

    expect(await screen.findByRole('heading', { level: 1, name: 'Temple' })).toBeTruthy();
    expect(attempts).toBe(2);

    vi.stubGlobal(
      'fetch',
      vi.fn(async () =>
        response(
          {
            error: {
              code: 'knowledge.resource.public_not_found',
              message: 'Knowledge Resource not found.',
              status: 404,
            },
          },
          404,
        ),
      ),
    );

    const second = render(
      <PublicKnowledgeResourceDetail resourceId="44444444-4444-4444-8444-444444444444" />,
    );
    expect(await screen.findByText('Published Knowledge not found')).toBeTruthy();
    second.unmount();
  });
});
