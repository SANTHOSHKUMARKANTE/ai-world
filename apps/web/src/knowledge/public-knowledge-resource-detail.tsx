'use client';

import { useEffect, useState } from 'react';

import { getPublicKnowledgeResource, type PublicKnowledgeResource } from './public-knowledge-api';

type State =
  | { readonly status: 'loading' }
  | { readonly status: 'ready'; readonly resource: PublicKnowledgeResource }
  | { readonly status: 'error' };

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

  if (state.status === 'loading')
    return (
      <p role="status" className="text-sm text-slate-500">
        Loading published resource…
      </p>
    );
  if (state.status === 'error')
    return (
      <p role="alert" className="text-sm text-slate-700">
        This published resource is unavailable.
      </p>
    );

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
        {state.resource.universeKey}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{state.resource.resourceType}</h1>
      <dl className="mt-6 grid gap-4 text-sm">
        <div>
          <dt className="font-medium text-slate-700">Resource ID</dt>
          <dd className="mt-1 break-all font-mono text-xs text-slate-600">{state.resource.id}</dd>
        </div>
        <div>
          <dt className="font-medium text-slate-700">Updated</dt>
          <dd className="mt-1 text-slate-600">
            {new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(
              new Date(state.resource.updatedAt),
            )}
          </dd>
        </div>
      </dl>
    </article>
  );
}
