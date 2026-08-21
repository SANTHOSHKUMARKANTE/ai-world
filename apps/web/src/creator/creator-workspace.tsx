'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import {
  createCreatorKnowledgeResource,
  createCreatorPage,
  createCreatorTextBlock,
  getCreatorPage,
  getCreatorPageComposition,
  replaceCreatorPageComposition,
  uploadCreatorMediaAsset,
  type CreatorCompositionItemKind,
  type CreatorPage,
} from './creator-api';

interface ReferenceDraft {
  readonly kind: CreatorCompositionItemKind;
  readonly id: string;
  readonly label: string;
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60';
const primaryButtonClassName =
  'rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButtonClassName =
  'rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50';

function referenceName(kind: CreatorCompositionItemKind): string {
  switch (kind) {
    case 'BLOCK':
      return 'Block';
    case 'KNOWLEDGE_RESOURCE':
      return 'Knowledge';
    case 'MEDIA_ASSET':
      return 'Media';
  }
}

function isReferenceKind(value: string): value is CreatorCompositionItemKind {
  return value === 'BLOCK' || value === 'KNOWLEDGE_RESOURCE' || value === 'MEDIA_ASSET';
}

function EditorCard({
  eyebrow,
  title,
  description,
  children,
}: {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">{eyebrow}</p>
      <h2 className="mt-2 text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function AuthenticatedCreatorWorkspace() {
  const [universeKey, setUniverseKey] = useState('universe.devotional');
  const [routePath, setRoutePath] = useState('/creator-draft');
  const [pageTitle, setPageTitle] = useState('Creator draft');
  const [pageId, setPageId] = useState('');
  const [activePage, setActivePage] = useState<CreatorPage | null>(null);
  const [resourceType, setResourceType] = useState('devotional.deity');
  const [blockText, setBlockText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [manualKind, setManualKind] = useState<CreatorCompositionItemKind>('BLOCK');
  const [manualId, setManualId] = useState('');
  const [library, setLibrary] = useState<readonly ReferenceDraft[]>([]);
  const [items, setItems] = useState<readonly ReferenceDraft[]>([]);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const busy = busyAction !== null;

  async function perform<T>(
    action: string,
    operation: () => Promise<T>,
    success: (result: T) => void,
  ): Promise<void> {
    setBusyAction(action);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      success(await operation());
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  function registerReference(reference: ReferenceDraft): void {
    setLibrary((current) => [reference, ...current]);
  }

  async function handleCreatePage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await perform(
      'create-page',
      () => createCreatorPage({ universeKey, routePath, title: pageTitle }),
      (page) => {
        setActivePage(page);
        setPageId(page.id);
        setItems([]);
        setStatusMessage(`Page “${page.title}” created as a DRAFT.`);
      },
    );
  }

  async function handleLoadPage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await perform(
      'load-page',
      async () => {
        const [page, composition] = await Promise.all([
          getCreatorPage(pageId),
          getCreatorPageComposition(pageId),
        ]);
        return { page, composition };
      },
      ({ page, composition }) => {
        setActivePage(page);
        setUniverseKey(page.universeKey);
        setRoutePath(page.routePath);
        setPageTitle(page.title);
        setItems(
          composition.items.map((item) => ({
            kind: item.kind,
            id: item.id,
            label: `${referenceName(item.kind)} ${item.id.slice(0, 8)}`,
          })),
        );
        setStatusMessage(`Loaded ${composition.items.length} composition items.`);
      },
    );
  }

  async function handleCreateKnowledge(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await perform(
      'create-knowledge',
      () => createCreatorKnowledgeResource({ universeKey, resourceType }),
      (resource) => {
        registerReference({
          kind: 'KNOWLEDGE_RESOURCE',
          id: resource.id,
          label: resource.resourceType,
        });
        setStatusMessage(`Knowledge draft “${resource.resourceType}” created.`);
      },
    );
  }

  async function handleCreateBlock(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await perform(
      'create-block',
      () => createCreatorTextBlock({ universeKey, text: blockText }),
      (block) => {
        registerReference({
          kind: 'BLOCK',
          id: block.id,
          label: block.text.length > 48 ? `${block.text.slice(0, 48)}…` : block.text,
        });
        setBlockText('');
        setStatusMessage('Reusable Text Block created.');
      },
    );
  }

  async function handleUploadMedia(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!mediaFile) {
      setErrorMessage('Choose an image file before uploading.');
      return;
    }
    await perform(
      'upload-media',
      () => uploadCreatorMediaAsset(mediaFile),
      (asset) => {
        registerReference({
          kind: 'MEDIA_ASSET',
          id: asset.id,
          label: mediaFile.name,
        });
        setMediaFile(null);
        setStatusMessage(`Media Asset “${mediaFile.name}” uploaded.`);
      },
    );
  }

  function handleAddManualReference(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const id = manualId.trim();
    if (!id) {
      setErrorMessage('Enter a canonical reference ID.');
      return;
    }
    setItems((current) => [
      ...current,
      { kind: manualKind, id, label: `${referenceName(manualKind)} ${id.slice(0, 8)}` },
    ]);
    setManualId('');
    setErrorMessage(null);
    setStatusMessage(`${referenceName(manualKind)} reference added to the draft order.`);
  }

  function moveItem(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= items.length) {
      return;
    }
    setItems((current) => {
      const next = [...current];
      const selected = next[index];
      const displaced = next[target];
      if (!selected || !displaced) {
        return current;
      }
      next[index] = displaced;
      next[target] = selected;
      return next;
    });
  }

  async function saveComposition(): Promise<void> {
    const id = pageId.trim();
    if (!id) {
      setErrorMessage('Create or load a Page before saving composition.');
      return;
    }
    await perform(
      'save-composition',
      () =>
        replaceCreatorPageComposition(
          id,
          items.map((item) => ({ kind: item.kind, id: item.id })),
        ),
      (composition) => {
        setItems(
          composition.items.map((item) => {
            const known = items.find(
              (candidate) => candidate.kind === item.kind && candidate.id === item.id,
            );
            return (
              known ?? {
                kind: item.kind,
                id: item.id,
                label: `${referenceName(item.kind)} ${item.id.slice(0, 8)}`,
              }
            );
          }),
        );
        setStatusMessage(`Saved ${composition.items.length} ordered composition items.`);
      },
    );
  }

  return (
    <div>
      <section className="mb-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
        <label className="text-sm font-semibold text-cyan-100" htmlFor="creator-universe-key">
          Active Universe
        </label>
        <input
          id="creator-universe-key"
          className={inputClassName}
          value={universeKey}
          disabled={busy}
          onChange={(event) => setUniverseKey(event.target.value)}
        />
        <p className="mt-2 text-sm text-cyan-100/70">
          New Pages, Blocks, and Knowledge use this shared Universe boundary.
        </p>
      </section>

      {statusMessage ? (
        <p
          role="status"
          className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200"
        >
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p
          role="alert"
          className="mb-6 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <EditorCard
          eyebrow="01 · Page"
          title="Create or load a Page"
          description="Pages remain canonical Composition-owned DRAFTs. Route and title are structured fields."
        >
          <form onSubmit={handleCreatePage} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-page-route">
              Route path
              <input
                id="creator-page-route"
                className={inputClassName}
                value={routePath}
                disabled={busy}
                onChange={(event) => setRoutePath(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium" htmlFor="creator-page-title">
              Presentation title
              <input
                id="creator-page-title"
                className={inputClassName}
                value={pageTitle}
                disabled={busy}
                onChange={(event) => setPageTitle(event.target.value)}
              />
            </label>
            <button className={primaryButtonClassName} type="submit" disabled={busy}>
              {busyAction === 'create-page' ? 'Creating…' : 'Create draft Page'}
            </button>
          </form>

          <form onSubmit={handleLoadPage} className="mt-6 border-t border-slate-800 pt-5">
            <label className="block text-sm font-medium" htmlFor="creator-page-id">
              Active Page ID
              <input
                id="creator-page-id"
                className={inputClassName}
                placeholder="UUID"
                value={pageId}
                disabled={busy}
                onChange={(event) => setPageId(event.target.value)}
              />
            </label>
            <button
              className={`${secondaryButtonClassName} mt-3`}
              type="submit"
              disabled={busy || !pageId.trim()}
            >
              {busyAction === 'load-page' ? 'Loading…' : 'Load Page composition'}
            </button>
          </form>

          {activePage ? (
            <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl bg-slate-950/70 p-4 text-sm">
              <dt className="text-slate-500">Lifecycle</dt>
              <dd>{activePage.lifecycle}</dd>
              <dt className="text-slate-500">Universe</dt>
              <dd className="break-all">{activePage.universeKey}</dd>
              <dt className="text-slate-500">Route</dt>
              <dd className="break-all">{activePage.routePath}</dd>
            </dl>
          ) : null}
        </EditorCard>

        <EditorCard
          eyebrow="02 · Knowledge"
          title="Create a Knowledge draft"
          description="The Knowledge Platform validates and owns the canonical Resource. Composition stores only its reference."
        >
          <form onSubmit={handleCreateKnowledge} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-resource-type">
              Resource type
              <input
                id="creator-resource-type"
                className={inputClassName}
                value={resourceType}
                disabled={busy}
                onChange={(event) => setResourceType(event.target.value)}
              />
            </label>
            <button className={primaryButtonClassName} type="submit" disabled={busy}>
              {busyAction === 'create-knowledge' ? 'Creating…' : 'Create Knowledge draft'}
            </button>
          </form>
        </EditorCard>

        <EditorCard
          eyebrow="03 · Media"
          title="Upload a Media Asset"
          description="Binary storage and Asset lifecycle remain Media-owned. The workspace receives only the canonical Asset ID."
        >
          <form onSubmit={handleUploadMedia} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-media-file">
              Image file
              <input
                id="creator-media-file"
                className={inputClassName}
                type="file"
                accept="image/png,image/jpeg"
                disabled={busy}
                onChange={(event) => setMediaFile(event.target.files?.[0] ?? null)}
              />
            </label>
            <button className={primaryButtonClassName} type="submit" disabled={busy || !mediaFile}>
              {busyAction === 'upload-media' ? 'Uploading…' : 'Upload Media Asset'}
            </button>
          </form>
        </EditorCard>

        <EditorCard
          eyebrow="04 · Block"
          title="Create a reusable Text Block"
          description="Blocks own presentation content independently and can be referenced by more than one Page."
        >
          <form onSubmit={handleCreateBlock} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-block-text">
              Text content
              <textarea
                id="creator-block-text"
                className={`${inputClassName} min-h-32 resize-y`}
                value={blockText}
                disabled={busy}
                onChange={(event) => setBlockText(event.target.value)}
              />
            </label>
            <button
              className={primaryButtonClassName}
              type="submit"
              disabled={busy || !blockText.trim()}
            >
              {busyAction === 'create-block' ? 'Creating…' : 'Create Text Block'}
            </button>
          </form>
        </EditorCard>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              05 · Layout
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Compose the Page</h2>
            <p className="mt-2 text-sm text-slate-400">
              Add typed canonical references, then move them into the exact persisted order.
            </p>
          </div>
          <button
            className={primaryButtonClassName}
            type="button"
            disabled={busy || !pageId.trim()}
            onClick={() => void saveComposition()}
          >
            {busyAction === 'save-composition' ? 'Saving…' : 'Save composition'}
          </button>
        </div>

        {library.length > 0 ? (
          <section aria-labelledby="creator-library-title" className="mt-6">
            <h3 id="creator-library-title" className="text-sm font-semibold text-slate-300">
              Created in this workspace
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {library.map((reference, index) => (
                <button
                  key={`${reference.kind}-${reference.id}-${index}`}
                  type="button"
                  className={secondaryButtonClassName}
                  disabled={busy}
                  onClick={() => setItems((current) => [...current, reference])}
                >
                  Add {referenceName(reference.kind)} · {reference.label}
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <form
          onSubmit={handleAddManualReference}
          className="mt-6 grid gap-3 border-t border-slate-800 pt-5 sm:grid-cols-[12rem_1fr_auto] sm:items-end"
        >
          <label className="block text-sm font-medium" htmlFor="creator-reference-kind">
            Reference kind
            <select
              id="creator-reference-kind"
              className={inputClassName}
              value={manualKind}
              disabled={busy}
              onChange={(event) => {
                if (isReferenceKind(event.target.value)) {
                  setManualKind(event.target.value);
                }
              }}
            >
              <option value="BLOCK">Block</option>
              <option value="KNOWLEDGE_RESOURCE">Knowledge Resource</option>
              <option value="MEDIA_ASSET">Media Asset</option>
            </select>
          </label>
          <label className="block text-sm font-medium" htmlFor="creator-reference-id">
            Canonical reference ID
            <input
              id="creator-reference-id"
              className={inputClassName}
              placeholder="UUID"
              value={manualId}
              disabled={busy}
              onChange={(event) => setManualId(event.target.value)}
            />
          </label>
          <button className={secondaryButtonClassName} type="submit" disabled={busy}>
            Add reference
          </button>
        </form>

        <ol aria-label="Page composition order" className="mt-6 space-y-3">
          {items.map((item, index) => (
            <li
              key={`${item.kind}-${item.id}-${index}`}
              className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4 sm:flex-row sm:items-center"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-300">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {referenceName(item.kind)}
                </p>
                <p className="truncate font-medium">{item.label}</p>
                <p className="truncate text-xs text-slate-600">{item.id}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || index === 0}
                  aria-label={`Move item ${index + 1} up`}
                  onClick={() => moveItem(index, -1)}
                >
                  ↑
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                  onClick={() => moveItem(index, 1)}
                >
                  ↓
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy}
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() =>
                    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                  }
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ol>

        {items.length === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
            No composition items yet. Create content above or add an existing canonical ID.
          </p>
        ) : null}
      </section>
    </div>
  );
}

export function CreatorWorkspace() {
  const { state, refreshSession } = useSession();

  switch (state.status) {
    case 'loading':
      return <p className="text-slate-400">Checking your creator session…</p>;
    case 'anonymous':
      return (
        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Sign in to create</h2>
          <p className="mt-2 text-slate-400">
            Creator operations require an authenticated Actor with the relevant owner Permissions.
          </p>
          <Link className={`${primaryButtonClassName} mt-5 inline-block`} href="/sign-in">
            Sign in
          </Link>
        </section>
      );
    case 'error':
      return (
        <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6">
          <p role="alert" className="text-rose-200">
            Creator session status is unavailable.
          </p>
          <button
            className={`${secondaryButtonClassName} mt-4`}
            type="button"
            onClick={() => void refreshSession()}
          >
            Try again
          </button>
        </section>
      );
    case 'authenticated':
      return <AuthenticatedCreatorWorkspace />;
  }
}
