import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PublicExperience } from '../src/creator/public-experience';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('UXP-05A public Experience shell', () => {
  it('renders published Block and Knowledge content without requiring a Session provider', async () => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const knowledgeId = '22222222-2222-4222-8222-222222222222';
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse({
        page: {
          id: pageId,
          universeKey: 'universe.devotional',
          routePath: '/public-proof',
          title: 'Public Experience proof',
          lifecycle: 'PUBLISHED',
        },
        items: [
          {
            position: 0,
            kind: 'BLOCK',
            id: '33333333-3333-4333-8333-333333333333',
            blockType: 'composition.block.text',
            text: 'A published composed story.',
          },
          {
            position: 1,
            kind: 'KNOWLEDGE_RESOURCE',
            id: knowledgeId,
            resourceType: 'devotional.temple',
            lifecycle: 'PUBLISHED',
          },
        ],
      }),
    );

    vi.stubGlobal('fetch', fetchMock);

    render(<PublicExperience pageId={pageId} />);

    await screen.findByRole('heading', { level: 1, name: 'Public Experience proof' });
    expect(screen.getByText('Devotional · Published Experience')).toBeTruthy();
    expect(screen.getByText('A published composed story.')).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Temple' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Open Knowledge resource' }).getAttribute('href')).toBe(
      `/knowledge/resources/${knowledgeId}`,
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `/api/composition/public/pages/${pageId}`,
        expect.objectContaining({ credentials: 'same-origin' }),
      );
    });
  });

  it('distinguishes a missing published Page from an unexpected request failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: 'composition.public.not_found',
              message: 'The published Experience was not found.',
              status: 404,
            },
          },
          404,
        ),
      ),
    );

    render(<PublicExperience pageId="44444444-4444-4444-8444-444444444444" />);

    await screen.findByRole('heading', { level: 1, name: 'Experience not found' });
    expect(screen.getByRole('alert').textContent).toBe('This published Experience was not found.');
  });

  it('renders a bounded unexpected-error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse(
          {
            error: {
              code: 'web.api.unexpected_error',
              message: 'The request could not be completed.',
              status: 500,
            },
          },
          500,
        ),
      ),
    );

    render(<PublicExperience pageId="55555555-5555-4555-8555-555555555555" />);

    await screen.findByRole('heading', { level: 1, name: 'Experience unavailable' });
    expect(screen.getByRole('alert').textContent).toBe(
      'This published Experience is unavailable right now.',
    );
  });

  it('keeps an empty published Experience useful and explicit', async () => {
    const pageId = '66666666-6666-4666-8666-666666666666';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          page: {
            id: pageId,
            universeKey: 'universe.anime',
            routePath: '/empty-proof',
            title: 'Empty Experience',
            lifecycle: 'PUBLISHED',
          },
          items: [],
        }),
      ),
    );

    render(<PublicExperience pageId={pageId} />);

    await screen.findByRole('heading', { level: 1, name: 'Empty Experience' });
    expect(screen.getByText('This published Experience has no content yet.')).toBeTruthy();
  });
});
