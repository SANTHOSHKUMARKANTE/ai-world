'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { PublishedResourceImageGallery } from './published-resource-image-gallery';
import { listPublicKnowledgeResources, type PublicKnowledgeResource } from './public-knowledge-api';

type KnowledgeSectionState =
  | {
      readonly status: 'loading';
    }
  | {
      readonly status: 'ready';
      readonly items: readonly PublicKnowledgeResource[];
    }
  | {
      readonly status: 'error';
    };

export interface KnowledgeUniverseSectionProps {
  readonly title: string;
  readonly description: string;
  readonly universeKey: string;
  readonly priority?: 'primary' | 'secondary';
  readonly tone?: 'devotional' | 'anime';
  readonly imageResourceTypes?: readonly string[];
  readonly imageSectionLabel?: string;
}

function formatResourceType(resourceType: string): string {
  const finalSegment = resourceType.split('.').at(-1) ?? resourceType;

  return finalSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');
}

function formatUpdatedAt(updatedAt: string): string {
  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(new Date(updatedAt));
}

export function KnowledgeUniverseSection({
  title,
  description,
  universeKey,
  priority = 'secondary',
  tone,
  imageResourceTypes = [],
  imageSectionLabel = 'Published imagery',
}: KnowledgeUniverseSectionProps) {
  const [state, setState] = useState<KnowledgeSectionState>({
    status: 'loading',
  });

  const headingId = useMemo(
    () => `knowledge-${universeKey.replace(/[^a-z0-9]+/gi, '-')}`,
    [universeKey],
  );

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeResources(universeKey)
      .then((items) => {
        if (active) {
          setState({
            status: 'ready',
            items,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: 'error',
          });
        }
      });

    return () => {
      active = false;
    };
  }, [universeKey]);

  return (
    <section
      aria-labelledby={headingId}
      data-priority={priority}
      data-universe={universeKey}
      data-universe-tone={tone}
      className="aw-universe-section"
    >
      <header className="aw-universe-section__header">
        <p className="aw-eyebrow">
          {priority === 'primary' ? 'Featured universe' : 'Explore another universe'}
        </p>
        <h2 id={headingId}>{title}</h2>
        <p>{description}</p>
      </header>

      {state.status === 'loading' ? <p role="status">Loading published resources…</p> : null}

      {state.status === 'error' ? (
        <p role="alert">Published Knowledge is temporarily unavailable.</p>
      ) : null}

      {state.status === 'ready' && state.items.length === 0 ? (
        <p className="aw-empty-state">No published resources yet.</p>
      ) : null}

      {state.status === 'ready' && state.items.length > 0 ? (
        <ul className="aw-resource-grid">
          {state.items.map((resource) => (
            <li key={resource.id} className="aw-resource-card">
              <p className="aw-resource-card__kind">Published resource</p>
              <h3>{formatResourceType(resource.resourceType)}</h3>
              <p className="aw-resource-card__type">{resource.resourceType}</p>

              <dl className="aw-resource-meta">
                <div>
                  <dt>Resource ID</dt>
                  <dd>{resource.id}</dd>
                </div>
                <div>
                  <dt>Updated</dt>
                  <dd>{formatUpdatedAt(resource.updatedAt)}</dd>
                </div>
              </dl>

              {imageResourceTypes.includes(resource.resourceType) ? (
                <PublishedResourceImageGallery
                  resourceId={resource.id}
                  resourceType={resource.resourceType}
                  label={imageSectionLabel}
                />
              ) : null}

              <Link
                className="aw-text-link aw-resource-card__open"
                href={`/knowledge/resources/${encodeURIComponent(resource.id)}`}
              >
                Open published resource
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
