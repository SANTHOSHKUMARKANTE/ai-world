import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CreatorWorkspace } from '../src/creator/creator-workspace';
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

describe('Creator workspace', () => {
  it('requires an authenticated Session before rendering creator controls', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
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
      ),
    );

    render(
      <SessionProvider>
        <CreatorWorkspace />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Sign in to create' })).toBeTruthy();
    });
    expect(screen.queryByRole('button', { name: 'Create draft Page' })).toBeNull();
  });

  it('creates a Page and Block, orders the typed reference, and saves through the API boundary', async () => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const blockId = '22222222-2222-4222-8222-222222222222';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({
          actorId: 'creator-actor',
          expiresAt: '2026-08-22T12:00:00.000Z',
        }),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            id: pageId,
            universeKey: 'universe.devotional',
            routePath: '/creator-proof',
            title: 'Creator proof',
            lifecycle: 'DRAFT',
            createdAt: '2026-08-21T12:00:00.000Z',
            updatedAt: '2026-08-21T12:00:00.000Z',
          },
          201,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            id: blockId,
            universeKey: 'universe.devotional',
            blockType: 'composition.block.text',
            text: 'A structured creator Block.',
            createdAt: '2026-08-21T12:01:00.000Z',
            updatedAt: '2026-08-21T12:01:00.000Z',
          },
          201,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse({
          pageId,
          items: [{ position: 0, kind: 'BLOCK', id: blockId }],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <CreatorWorkspace />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Create or load a Page' })).toBeTruthy();
    });

    fireEvent.change(screen.getByLabelText('Route path'), {
      target: { value: '/creator-proof' },
    });
    fireEvent.change(screen.getByLabelText('Presentation title'), {
      target: { value: 'Creator proof' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create draft Page' }));

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toContain('created as a DRAFT');
    });
    expect((screen.getByLabelText('Active Page ID') as HTMLInputElement).value).toBe(pageId);
    expect(
      screen.getByRole('link', { name: 'Open saved draft preview' }).getAttribute('href'),
    ).toBe(`/creator/preview/${pageId}`);

    fireEvent.change(screen.getByLabelText('Text content'), {
      target: { value: 'A structured creator Block.' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Text Block' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Block/ })).toBeTruthy();
    });
    fireEvent.click(screen.getByRole('button', { name: /Add Block/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Save composition' }));

    await waitFor(() => {
      expect(screen.getByRole('status').textContent).toBe('Saved 1 ordered composition items.');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/composition/pages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          universeKey: 'universe.devotional',
          routePath: '/creator-proof',
          title: 'Creator proof',
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      `/api/composition/pages/${pageId}/composition`,
      expect.objectContaining({
        method: 'PUT',
        body: JSON.stringify({ items: [{ kind: 'BLOCK', id: blockId }] }),
      }),
    );
  });
});
