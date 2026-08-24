'use client';

import { useState } from 'react';

import { Button } from '../ui/primitives';

function canonicalCharacterUrl(slug: string): string {
  return new URL(
    `/anime/characters/${encodeURIComponent(slug)}`,
    window.location.origin,
  ).toString();
}

async function copyText(value: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.append(textarea);
  textarea.select();

  const copied = document.execCommand('copy');
  textarea.remove();

  if (!copied) {
    throw new Error('Copy was not available.');
  }
}

export function AnimeCharacterShareControls({
  slug,
  displayName,
  summary,
}: {
  readonly slug: string;
  readonly displayName: string;
  readonly summary: string;
}) {
  const [message, setMessage] = useState<string | null>(null);

  async function share(): Promise<void> {
    const url = canonicalCharacterUrl(slug);
    setMessage(null);

    if (!navigator.share) {
      try {
        await copyText(url);
        setMessage('Link copied. Native sharing is not available on this device.');
      } catch {
        setMessage('Sharing is not available right now.');
      }
      return;
    }

    try {
      await navigator.share({ title: displayName, text: summary, url });
      setMessage('Share sheet opened.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setMessage('Share cancelled.');
        return;
      }

      setMessage('Sharing is not available right now.');
    }
  }

  async function copyLink(): Promise<void> {
    setMessage(null);

    try {
      await copyText(canonicalCharacterUrl(slug));
      setMessage('Canonical link copied.');
    } catch {
      setMessage('The link could not be copied.');
    }
  }

  return (
    <div className="aw-anime-character__share" aria-label={`Share ${displayName}`}>
      <Button variant="secondary" onClick={() => void share()}>
        Share
      </Button>
      <Button variant="secondary" onClick={() => void copyLink()}>
        Copy link
      </Button>
      {message ? (
        <span className="aw-anime-character__share-status" role="status" aria-live="polite">
          {message}
        </span>
      ) : null}
    </div>
  );
}
