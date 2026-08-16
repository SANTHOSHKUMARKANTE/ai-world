'use client';

import { useEffect, useMemo, useState } from 'react';

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
}

function formatResourceType(resourceType: string): string {
  const finalSegment = resourceType.split('.').at(-1) ?? resourceType;

  return finalSegment
    .split('-')
    .filter(Boolean)
    .map((segment) => {
      return segment.charAt(0).toUpperCase() + segment.slice(1);
    })
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
}: KnowledgeUniverseSectionProps) {
  const [state, setState] = useState<KnowledgeSectionState>({
    status: 'loading',
  });

  const headingId = useMemo(() => {
    return `knowledge-${universeKey.replace(/[^a-z0-9]+/gi, '-')}`;
  }, [universeKey]);

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
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <header className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          {priority === 'primary' ? 'Primary universe' : 'Reuse-test universe'}
        </p>

        <h2 id={headingId} className="text-2xl font-semibold tracking-tight text-slate-950">
          {title}
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </header>

      {state.status === 'loading' ? (
        <p role="status" className="text-sm text-slate-500">
          Loading published resources…
        </p>
      ) : null}

      {state.status === 'error' ? (
        <p role="alert" className="text-sm text-slate-700">
          Published Knowledge is temporarily unavailable.
        </p>
      ) : null}

      {state.status === 'ready' && state.items.length === 0 ? (
        <p className="text-sm text-slate-500">No published resources yet.</p>
      ) : null}

      {state.status === 'ready' && state.items.length > 0 ? (
        <ul className="grid gap-4 md:grid-cols-2">
          {state.items.map((resource) => (
            <li key={resource.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Published resource
              </p>

              <h3 className="mt-1 text-lg font-semibold text-slate-950">
                {formatResourceType(resource.resourceType)}
              </h3>

              <p className="mt-1 font-mono text-xs text-slate-600">{resource.resourceType}</p>

              <dl className="mt-4 grid gap-2 text-sm">
                <div>
                  <dt className="font-medium text-slate-700">Resource ID</dt>
                  <dd className="break-all font-mono text-xs text-slate-600">{resource.id}</dd>
                </div>

                <div>
                  <dt className="font-medium text-slate-700">Updated</dt>
                  <dd className="text-slate-600">{formatUpdatedAt(resource.updatedAt)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
