'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { ApiClientError } from '../api/api-client';
import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';
import { getPublicExperience, type CreatorPagePreview } from './creator-api';

type PublicExperienceState =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly experience: CreatorPagePreview }
  | { readonly status: 'not-found' }
  | { readonly status: 'error' };

function resourceLabel(resourceType: string): string {
  const segment = resourceType.split('.').at(-1) ?? resourceType;

  return segment
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export function PublicExperience({ pageId }: { readonly pageId: string }) {
  const [state, setState] = useState<PublicExperienceState>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    void getPublicExperience(pageId)
      .then((experience) => {
        if (active) {
          setState({ status: 'ready', experience });
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        if (error instanceof ApiClientError && error.status === 404) {
          setState({ status: 'not-found' });
          return;
        }

        setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [pageId]);

  if (state.status === 'loading') {
    return (
      <p role="status" aria-live="polite">
        Loading published Experience…
      </p>
    );
  }

  if (state.status === 'not-found') {
    return (
      <section className="aw-experience" aria-labelledby="published-experience-not-found">
        <header className="aw-experience__header">
          <p className="aw-eyebrow">Published Experience</p>
          <h1 id="published-experience-not-found">Experience not found</h1>
        </header>
        <p role="alert">This published Experience was not found.</p>
      </section>
    );
  }

  if (state.status === 'error') {
    return (
      <section className="aw-experience" aria-labelledby="published-experience-unavailable">
        <header className="aw-experience__header">
          <p className="aw-eyebrow">Published Experience</p>
          <h1 id="published-experience-unavailable">Experience unavailable</h1>
        </header>
        <p role="alert">This published Experience is unavailable right now.</p>
      </section>
    );
  }

  const presentation = WEB_UNIVERSE_PRESENTATIONS.find(
    (item) => item.universeKey === state.experience.page.universeKey,
  );

  return (
    <article
      className="aw-experience"
      data-universe-tone={presentation?.tone}
      aria-labelledby="published-experience-title"
    >
      <header className="aw-experience__header">
        <p className="aw-eyebrow">
          {presentation?.label ?? state.experience.page.universeKey} · Published Experience
        </p>
        <h1 id="published-experience-title">{state.experience.page.title}</h1>
      </header>

      {state.experience.items.length === 0 ? (
        <p className="aw-empty-state">This published Experience has no content yet.</p>
      ) : (
        <ol aria-label="Published experience content" className="aw-experience__content">
          {state.experience.items.map((item) => (
            <li key={`${item.kind}-${item.id}-${item.position}`}>
              {item.kind === 'BLOCK' ? (
                <section className="aw-experience-block">
                  <p>{item.text}</p>
                </section>
              ) : null}

              {item.kind === 'KNOWLEDGE_RESOURCE' ? (
                <section className="aw-experience-knowledge">
                  <p className="aw-eyebrow">Knowledge</p>
                  <h2>{resourceLabel(item.resourceType)}</h2>
                  <p>{item.resourceType}</p>
                  <Link
                    className="aw-text-link"
                    href={`/knowledge/resources/${encodeURIComponent(item.id)}`}
                  >
                    Open Knowledge resource
                  </Link>
                </section>
              ) : null}

              {item.kind === 'MEDIA_ASSET' ? (
                <figure className="aw-experience-media">
                  <div className="aw-experience-media__frame">
                    <Image
                      src={`/api/media/assets/${encodeURIComponent(item.id)}/content`}
                      alt={`Published media ${item.position + 1} in ${state.experience.page.title}`}
                      fill
                      unoptimized
                    />
                  </div>
                </figure>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </article>
  );
}
