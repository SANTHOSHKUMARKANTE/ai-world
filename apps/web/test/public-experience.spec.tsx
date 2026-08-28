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

describe('UXP-05B public Experience Media', () => {
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

  it('renders IMAGE and user-started bounded VIDEO while degrading unsupported Media honestly', async () => {
    const pageId = '77777777-7777-4777-8777-777777777777';
    const imageId = '88888888-8888-4888-8888-888888888888';
    const videoId = '99999999-9999-4999-8999-999999999999';
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonResponse({
          page: {
            id: pageId,
            universeKey: 'universe.anime',
            routePath: '/typed-media-proof',
            title: 'Typed Media proof',
            lifecycle: 'PUBLISHED',
          },
          items: [
            { position: 0, kind: 'MEDIA_ASSET', id: imageId, assetType: 'IMAGE' },
            {
              position: 1,
              kind: 'MEDIA_ASSET',
              id: videoId,
              assetType: 'VIDEO',
              durationMs: 5000,
            },
            {
              position: 2,
              kind: 'MEDIA_ASSET',
              id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
              assetType: 'AUDIO',
            },
            {
              position: 3,
              kind: 'MEDIA_ASSET',
              id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb',
              assetType: 'VIDEO',
              durationMs: 9000,
            },
          ],
        }),
      ),
    );

    render(<PublicExperience pageId={pageId} />);

    await screen.findByRole('heading', { level: 1, name: 'Typed Media proof' });
    expect(
      screen
        .getByRole('img', { name: 'Published media 1 in Typed Media proof' })
        .getAttribute('src'),
    ).toBe(`/api/media/assets/${imageId}/content`);

    const video = screen.getByLabelText(
      'Published media 2 in Typed Media proof',
    ) as HTMLVideoElement;
    expect(video.getAttribute('src')).toBe(`/api/media/assets/${videoId}/content`);
    expect(video.controls).toBe(true);
    expect(video.autoplay).toBe(false);
    expect(video.loop).toBe(false);
    expect(video.preload).toBe('none');
    expect(video.getAttribute('poster')).toBeNull();

    expect(screen.getByText('Audio playback is not available for this Experience.')).toBeTruthy();
    expect(screen.getByText('This video is not available for this Experience.')).toBeTruthy();
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
