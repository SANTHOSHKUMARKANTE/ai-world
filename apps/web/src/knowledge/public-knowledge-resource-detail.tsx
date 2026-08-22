'use client';

import { useEffect, useState } from 'react';

import { WEB_UNIVERSE_PRESENTATIONS } from '../universes/presentation';
import { getPublicKnowledgeResource, type PublicKnowledgeResource } from './public-knowledge-api';
import { PublishedResourceImageGallery } from './published-resource-image-gallery';

type State =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly resource: PublicKnowledgeResource }
  | { readonly status: 'error' };

function resourceLabel(resourceType: string): string {
  const segment = resourceType.split('.').at(-1) ?? resourceType;
  return segment.charAt(0).toUpperCase() + segment.slice(1).replaceAll('-', ' ');
}

export function PublicKnowledgeResourceDetail({ resourceId }: { readonly resourceId: string }) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    let active = true;

    void getPublicKnowledgeResource(resourceId)
      .then((resource) => {
        if (active) setState({ status: 'ready', resource });
      })
      .catch(() => {
        if (active) setState({ status: 'error' });
      });

    return () => {
      active = false;
    };
  }, [resourceId]);

  if (state.status === 'loading') {
    return <p role="status">Loading published resource…</p>;
  }

  if (state.status === 'error') {
    return <p role="alert">This published resource is unavailable.</p>;
  }

  const presentation = WEB_UNIVERSE_PRESENTATIONS.find(
    (item) => item.universeKey === state.resource.universeKey,
  );

  return (
    <article
      className="aw-resource-detail"
      data-universe-tone={presentation?.tone}
      aria-labelledby="public-resource-title"
    >
      <header className="aw-resource-detail__header">
        <p className="aw-eyebrow">
          {presentation?.label ?? state.resource.universeKey} · Published Knowledge
        </p>
        <h1 id="public-resource-title">{resourceLabel(state.resource.resourceType)}</h1>
        <p>{state.resource.resourceType}</p>
      </header>

      <dl className="aw-resource-meta aw-resource-meta--detail">
        <div>
          <dt>Resource ID</dt>
          <dd>{state.resource.id}</dd>
        </div>
        <div>
          <dt>Updated</dt>
          <dd>
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
              new Date(state.resource.updatedAt),
            )}
          </dd>
        </div>
      </dl>

      <PublishedResourceImageGallery
        resourceId={state.resource.id}
        resourceType={state.resource.resourceType}
        label="Published imagery"
      />
    </article>
  );
}
