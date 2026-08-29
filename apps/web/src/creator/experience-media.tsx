import Image from 'next/image';
import { useState, type ReactNode } from 'react';

import type { CreatorPagePreviewItem } from './creator-api';

type ExperienceMediaItem = Extract<CreatorPagePreviewItem, { readonly kind: 'MEDIA_ASSET' }>;

const MAX_EXPERIENCE_VIDEO_DURATION_MS = 8_000;

interface ExperienceMediaContentProps {
  readonly item: ExperienceMediaItem;
  readonly label: string;
}

function UnsupportedMedia({ children }: { readonly children: ReactNode }) {
  return (
    <div
      role="status"
      className="grid h-full place-items-center p-6 text-center text-sm text-slate-500"
    >
      {children}
    </div>
  );
}

function ExperienceAudio({ source, label }: { readonly source: string; readonly label: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <UnsupportedMedia>This audio is not available for this Experience.</UnsupportedMedia>;
  }

  return (
    <audio
      src={source}
      aria-label={label}
      className="w-full"
      controls
      preload="none"
      onError={() => setFailed(true)}
    >
      Your browser does not support audio playback.
    </audio>
  );
}

export function ExperienceMediaContent({ item, label }: ExperienceMediaContentProps) {
  const source = `/api/media/assets/${encodeURIComponent(item.id)}/content`;

  if (item.assetType === 'IMAGE') {
    return <Image src={source} alt={label} fill unoptimized className="object-contain" />;
  }

  if (item.assetType === 'VIDEO') {
    if (item.durationMs === undefined || item.durationMs > MAX_EXPERIENCE_VIDEO_DURATION_MS) {
      return <UnsupportedMedia>This video is not available for this Experience.</UnsupportedMedia>;
    }

    return (
      <video
        src={source}
        aria-label={label}
        className="h-full w-full object-contain"
        controls
        playsInline
        preload="none"
      >
        Your browser does not support video playback.
      </video>
    );
  }

  if (item.assetType === 'AUDIO') {
    if (item.durationMs === undefined) {
      return <UnsupportedMedia>This audio is not available for this Experience.</UnsupportedMedia>;
    }

    return <ExperienceAudio source={source} label={label} />;
  }

  return <UnsupportedMedia>This media type is not available for this Experience.</UnsupportedMedia>;
}
