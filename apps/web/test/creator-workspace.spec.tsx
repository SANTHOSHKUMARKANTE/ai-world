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

describe('Creator workspace', { timeout: 10_000 }, () => {
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
    expect(screen.getByRole('navigation', { name: 'Creator Studio tasks' })).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Composition' }).getAttribute('href')).toBe(
      '#creator-composition-task',
    );
    expect(screen.getByText('No Page selected')).toBeTruthy();
    expect(screen.getByText('No Resource selected')).toBeTruthy();

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
    expect(screen.getByText('Creator proof')).toBeTruthy();
    expect(screen.getByText('Page status: DRAFT')).toBeTruthy();
    expect((screen.getByLabelText('Active Page ID') as HTMLInputElement).value).toBe(pageId);
    expect(screen.getByRole('link', { name: 'Open saved preview' }).getAttribute('href')).toBe(
      `/creator/preview/${pageId}`,
    );

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

  it('publishes, locks, and archives a saved Page through the lifecycle controls', async () => {
    const pageId = '11111111-1111-4111-8111-111111111111';
    const basePage = {
      id: pageId,
      universeKey: 'universe.devotional',
      routePath: '/publication-proof',
      title: 'Publication proof',
      createdAt: '2026-08-22T10:00:00.000Z',
      updatedAt: '2026-08-22T10:00:00.000Z',
    };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ actorId: 'creator-actor', expiresAt: '2026-08-22T12:00:00.000Z' }),
      )
      .mockResolvedValueOnce(jsonResponse({ ...basePage, lifecycle: 'DRAFT' }, 201))
      .mockResolvedValueOnce(jsonResponse({ ...basePage, lifecycle: 'PUBLISHED' }, 201))
      .mockResolvedValueOnce(jsonResponse({ ...basePage, lifecycle: 'ARCHIVED' }, 201));
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <CreatorWorkspace />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Create draft Page' })).toBeTruthy();
    });
    fireEvent.change(screen.getByLabelText('Route path'), {
      target: { value: '/publication-proof' },
    });
    fireEvent.change(screen.getByLabelText('Presentation title'), {
      target: { value: 'Publication proof' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create draft Page' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Publish Page' })).toBeTruthy();
    });
    fireEvent.click(screen.getByRole('button', { name: 'Publish Page' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Archive Page' })).toBeTruthy();
    });
    expect(screen.getByRole('button', { name: 'Save composition' })).toHaveProperty(
      'disabled',
      true,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Archive Page' }));

    await waitFor(() => {
      expect(screen.getByText('Archived Pages are terminal and read-only.')).toBeTruthy();
    });
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      `/api/composition/pages/${pageId}/publish`,
      expect.objectContaining({ method: 'POST' }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      4,
      `/api/composition/pages/${pageId}/archive`,
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('keeps an AI suggestion non-canonical until the creator explicitly accepts it', async () => {
    const generationId = '55555555-5555-4555-8555-555555555555';
    const resourceId = '66666666-6666-4666-8666-666666666666';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse({ actorId: 'creator-actor', expiresAt: '2026-08-22T12:00:00.000Z' }),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            generationId,
            universeKey: 'universe.devotional',
            resourceType: 'devotional.temple',
            canonical: false,
            createdAt: '2026-08-22T11:00:00.000Z',
          },
          201,
        ),
      )
      .mockResolvedValueOnce(
        jsonResponse(
          {
            generationId,
            canonical: true,
            canonicalOwner: 'knowledge',
            resource: {
              id: resourceId,
              universeKey: 'universe.devotional',
              resourceType: 'devotional.temple',
              lifecycle: 'DRAFT',
              createdAt: '2026-08-22T11:01:00.000Z',
              updatedAt: '2026-08-22T11:01:00.000Z',
            },
          },
          201,
        ),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <CreatorWorkspace />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Generate AI suggestion' })).toBeTruthy();
    });
    fireEvent.change(screen.getByLabelText('Assistance request'), {
      target: { value: 'Suggest a Devotional Knowledge type.' },
    });
    fireEvent.change(screen.getByLabelText('Published Knowledge context search'), {
      target: { value: 'temple' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Generate AI suggestion' }));

    await waitFor(() => {
      expect(screen.getByText('Non-canonical suggestion')).toBeTruthy();
      expect(screen.getByRole('button', { name: 'Accept as Knowledge draft' })).toBeTruthy();
    });
    expect(screen.queryByRole('button', { name: /Add Knowledge/ })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Accept as Knowledge draft' }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Add Knowledge.*devotional.temple/ })).toBeTruthy();
    });
    expect(screen.queryByText('Non-canonical suggestion')).toBeNull();
    expect(screen.getByRole('status').textContent).toContain(
      'accepted as a canonical Knowledge draft',
    );

    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      '/api/composition/ai/knowledge-candidates',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          universeKey: 'universe.devotional',
          request: 'Suggest a Devotional Knowledge type.',
          contextQuery: 'temple',
        }),
      }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      3,
      `/api/composition/ai/knowledge-candidates/${generationId}/accept`,
      expect.objectContaining({ method: 'POST' }),
    );
  });
});
