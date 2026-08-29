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
            { position: 2, kind: 'MEDIA_ASSET', id: assetId, assetType: 'IMAGE' },
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

  it('uses the same user-started VIDEO semantics in controlled Creator preview', async () => {
    const pageId = '77777777-7777-4777-8777-777777777777';
    const videoId = '88888888-8888-4888-8888-888888888888';
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
            universeKey: 'universe.anime',
            routePath: '/preview-video-proof',
            title: 'Draft video parity',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'MEDIA_ASSET',
              id: videoId,
              assetType: 'VIDEO',
              durationMs: 5000,
            },
          ],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <DraftPreview pageId={pageId} />
      </SessionProvider>,
    );

    await screen.findByRole('heading', { name: 'Draft video parity' });
    const video = screen.getByLabelText('Draft media 1 in Draft video parity') as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe(`/api/media/assets/${videoId}/content`);
    expect(video.controls).toBe(true);
    expect(video.autoplay).toBe(false);
    expect(video.loop).toBe(false);
    expect(video.preload).toBe('none');
    expect(video.getAttribute('poster')).toBeNull();
  });

  it('uses the same user-started AUDIO semantics in controlled Creator preview', async () => {
    const pageId = '99999999-9999-4999-8999-999999999999';
    const audioId = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
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
            routePath: '/preview-audio-proof',
            title: 'Draft audio parity',
            lifecycle: 'DRAFT',
          },
          items: [
            {
              position: 0,
              kind: 'MEDIA_ASSET',
              id: audioId,
              assetType: 'AUDIO',
              durationMs: 273,
            },
          ],
        }),
      );
    vi.stubGlobal('fetch', fetchMock);

    render(
      <SessionProvider>
        <DraftPreview pageId={pageId} />
      </SessionProvider>,
    );

    await screen.findByRole('heading', { name: 'Draft audio parity' });
    const audio = screen.getByLabelText('Draft media 1 in Draft audio parity') as HTMLAudioElement;
    expect(audio.getAttribute('src')).toBe(`/api/media/assets/${audioId}/content`);
    expect(audio.controls).toBe(true);
    expect(audio.autoplay).toBe(false);
    expect(audio.loop).toBe(false);
    expect(audio.preload).toBe('none');
  });
});
