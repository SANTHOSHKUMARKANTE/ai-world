'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import { getCreatorPagePreview, type CreatorPagePreview } from './creator-api';

function AuthenticatedDraftPreview({ pageId }: { readonly pageId: string }) {
  const [preview, setPreview] = useState<CreatorPagePreview | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void getCreatorPagePreview(pageId)
      .then((result) => {
        if (active) {
          setPreview(result);
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(getApiErrorMessage(error));
        }
      });

    return () => {
      active = false;
    };
  }, [pageId]);

  if (errorMessage) {
    return (
      <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
        <h1 className="text-2xl font-semibold">Draft preview unavailable</h1>
        <p role="alert" className="mt-3 text-rose-200">
          {errorMessage}
        </p>
      </section>
    );
  }

  if (!preview) {
    return <p className="text-slate-400">Loading saved draft preview…</p>;
  }

  return (
    <article>
      <header className="rounded-3xl border border-amber-400/25 bg-gradient-to-br from-amber-400/15 via-slate-900 to-slate-950 p-6 sm:p-9">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="rounded-full bg-amber-300 px-3 py-1 text-slate-950">Draft preview</span>
          <span className="text-amber-100/70">{preview.page.lifecycle}</span>
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">
          {preview.page.title}
        </h1>
        <dl className="mt-6 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
          <div>
            <dt className="inline text-slate-500">Route </dt>
            <dd className="inline">{preview.page.routePath}</dd>
          </div>
          <div>
            <dt className="inline text-slate-500">Universe </dt>
            <dd className="inline">{preview.page.universeKey}</dd>
          </div>
        </dl>
      </header>

      {preview.items.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-slate-700 p-10 text-center text-slate-400">
          This saved draft has no composition items yet.
        </p>
      ) : (
        <ol aria-label="Saved draft preview" className="mt-8 space-y-6">
          {preview.items.map((item) => (
            <li key={`${item.kind}-${item.id}-${item.position}`}>
              {item.kind === 'BLOCK' ? (
                <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
                  <p className="whitespace-pre-wrap text-lg leading-8 text-slate-200">
                    {item.text}
                  </p>
                </section>
              ) : null}

              {item.kind === 'KNOWLEDGE_RESOURCE' ? (
                <section className="rounded-2xl border border-cyan-400/25 bg-cyan-400/10 p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
                    Knowledge Resource · {item.lifecycle}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold">{item.resourceType}</h2>
                  <p className="mt-3 break-all text-xs text-cyan-100/50">{item.id}</p>
                </section>
              ) : null}

              {item.kind === 'MEDIA_ASSET' ? (
                <figure className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                  <div className="relative aspect-video">
                    <Image
                      src={`/api/media/assets/${encodeURIComponent(item.id)}/content`}
                      alt={`Media Asset ${item.position + 1} in ${preview.page.title}`}
                      fill
                      unoptimized
                      className="object-contain"
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

export function DraftPreview({ pageId }: { readonly pageId: string }) {
  const { state, refreshSession } = useSession();

  switch (state.status) {
    case 'loading':
      return <p className="text-slate-400">Checking your preview access…</p>;
    case 'anonymous':
      return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h1 className="text-2xl font-semibold">Sign in to preview this draft</h1>
          <p className="mt-3 text-slate-400">
            Draft composition is visible only to authenticated Actors with preview permission.
          </p>
          <Link
            className="mt-5 inline-block rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950"
            href="/sign-in"
          >
            Sign in
          </Link>
        </section>
      );
    case 'error':
      return (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p role="alert" className="text-rose-200">
            Preview session status is unavailable.
          </p>
          <button
            className="mt-4 rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium"
            type="button"
            onClick={() => void refreshSession()}
          >
            Try again
          </button>
        </section>
      );
    case 'authenticated':
      return <AuthenticatedDraftPreview pageId={pageId} />;
  }
}
