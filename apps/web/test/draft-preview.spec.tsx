import { render, screen, waitFor, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DraftPreview } from '../src/creator/draft-preview';
import { SessionProvider } from '../src/session/session-provider';

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

describe('Controlled draft preview', () => {
  it('does not request draft content for an anonymous visitor', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(
        {
          error: {
            code: 'identity.session.invalid',
            message: 'Authentication is required.',
            status: 401,
          },
        },
        401,
      ),
    );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <DraftPreview pageId="11111111-1111-4111-8111-111111111111" />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sign in to preview this draft' })).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('renders the saved typed composition in canonical order for an authenticated Actor', async () => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const assetId = '44444444-4444-4444-8444-444444444444';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          actorId: 'preview-actor',
          expiresAt: '2026-08-22T12:00:00.000Z',
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          page: {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: '/preview-proof',
            title: 'Preview proof',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'BLOCK',
              id: '22222222-2222-4222-8222-222222222222',
              blockType: 'composition.block.text',
              text: 'A saved preview Block.',
            },
            {
              position: 1,
              kind: 'KNOWLEDGE_RESOURCE',
              id: '33333333-3333-4333-8333-333333333333',
              resourceType: 'devotional.deity',
              lifecycle: 'DRAFT',
            },
            { position: 2, kind: 'MEDIA_ASSET', id: assetId },
          ],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <DraftPreview pageId={pageId} />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Preview proof' })).toBeTruthy();
    });

    const items = within(screen.getByRole('list', { name: 'Saved draft preview' })).getAllByRole(
      'listitem',
    );
    expect(items).toHaveLength(3);
    expect(items[0]?.textContent).toContain('A saved preview Block.');
    expect(items[1]?.textContent).toContain('devotional.deity');
    expect(within(items[2]!).getByRole('img').getAttribute('src')).toBe(
      `/api/media/assets/${assetId}/content`,
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `/api/composition/pages/${pageId}/preview`,
      expect.objectContaining({ credentials: 'same-origin' }),
    );
  });
});
