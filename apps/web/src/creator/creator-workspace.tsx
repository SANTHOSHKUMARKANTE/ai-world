'use client';

import Link from 'next/link';
import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import {
  acceptCreatorKnowledgeCandidate,
  assignCreatorRole,
  archiveCreatorPage,
  createCreatorKnowledgeResource,
  createCreatorPage,
  createCreatorTextBlock,
  getCreatorPage,
  getCreatorPageComposition,
  listCreatorKnowledgeResources,
  listCreatorPages,
  publishCreatorPage,
  replaceCreatorPageComposition,
  suggestCreatorKnowledgeCandidate,
  uploadCreatorMediaAsset,
  type CreatorAdministrationRole,
  type CreatorAiKnowledgeCandidate,
  type CreatorCompositionItemKind,
  type CreatorKnowledgeResource,
  type CreatorPage,
} from './creator-api';
import { AnimeCharacterManager } from './anime-character-manager';
import { AnimeSeriesManager } from './anime-series-manager';
import { DevotionalDeityManager } from './devotional-deity-manager';
import { KnowledgeMediaManager } from './knowledge-media-manager';

interface ReferenceDraft {
  readonly kind: CreatorCompositionItemKind;
  readonly id: string;
  readonly label: string;
}

interface RoleAssignmentReview {
  readonly targetActorId: string;
  readonly roleKey: CreatorAdministrationRole;
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60';
const primaryButtonClassName =
  'rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButtonClassName =
  'rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50';

function administrationRoleLabel(role: CreatorAdministrationRole): string {
  return role === 'administrator' ? 'Administrator' : 'Knowledge editor';
}

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
  id,
  eyebrow,
  title,
  description,
  children,
}: {
  readonly id?: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
    >
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
  const [availablePages, setAvailablePages] = useState<readonly CreatorPage[]>([]);
  const [resourceType, setResourceType] = useState('devotional.deity');
  const [typedEntityEditor, setTypedEntityEditor] = useState<'anime' | 'deity'>('deity');
  const [animeEntityEditor, setAnimeEntityEditor] = useState<'character' | 'series'>('character');
  const [knowledgeResourceId, setKnowledgeResourceId] = useState('');
  const [activeKnowledgeResource, setActiveKnowledgeResource] =
    useState<CreatorKnowledgeResource | null>(null);
  const [availableKnowledgeResources, setAvailableKnowledgeResources] = useState<
    readonly CreatorKnowledgeResource[]
  >([]);
  const [knowledgeMediaManagerRevision, setKnowledgeMediaManagerRevision] = useState(0);
  const [aiRequest, setAiRequest] = useState('Suggest one useful Knowledge Resource type.');
  const [aiContextQuery, setAiContextQuery] = useState('deity');
  const [aiCandidate, setAiCandidate] = useState<CreatorAiKnowledgeCandidate | null>(null);
  const [blockText, setBlockText] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [manualKind, setManualKind] = useState<CreatorCompositionItemKind>('BLOCK');
  const [manualId, setManualId] = useState('');
  const [library, setLibrary] = useState<readonly ReferenceDraft[]>([]);
  const [items, setItems] = useState<readonly ReferenceDraft[]>([]);
  const [compositionDirty, setCompositionDirty] = useState(false);
  const [administrationTargetActorId, setAdministrationTargetActorId] = useState('');
  const [administrationRole, setAdministrationRole] =
    useState<CreatorAdministrationRole>('knowledge-editor');
  const [roleAssignmentReview, setRoleAssignmentReview] = useState<RoleAssignmentReview | null>(
    null,
  );
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const busy = busyAction !== null;
  const compositionLocked = activePage !== null && activePage.lifecycle !== 'DRAFT';

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

  function selectTypedEditorForResource(resource: CreatorKnowledgeResource): void {
    if (
      resource.universeKey === 'universe.devotional' &&
      resource.resourceType === 'devotional.deity'
    ) {
      setTypedEntityEditor('deity');
      return;
    }

    if (resource.universeKey !== 'universe.anime') {
      return;
    }

    setTypedEntityEditor('anime');

    if (resource.resourceType === 'anime.character') {
      setAnimeEntityEditor('character');
      return;
    }

    if (resource.resourceType === 'anime.series') {
      setAnimeEntityEditor('series');
    }
  }

  function handleReviewRoleAssignment(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const targetActorId = administrationTargetActorId.trim();

    if (!targetActorId) {
      setRoleAssignmentReview(null);
      setStatusMessage(null);
      setErrorMessage('Enter the target Actor ID before reviewing the Role assignment.');
      return;
    }

    setErrorMessage(null);
    setStatusMessage(null);
    setRoleAssignmentReview({
      targetActorId,
      roleKey: administrationRole,
    });
  }

  async function confirmRoleAssignment(): Promise<void> {
    if (!roleAssignmentReview) {
      return;
    }

    const review = roleAssignmentReview;
    await perform(
      'assign-role',
      () =>
        assignCreatorRole({
          targetActorId: review.targetActorId,
          roleKey: review.roleKey,
        }),
      () => {
        setRoleAssignmentReview(null);
        setStatusMessage(
          `Role “${administrationRoleLabel(review.roleKey)}” is assigned to Actor ${review.targetActorId}.`,
        );
      },
    );
  }

  async function handleCreatePage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await perform(
      'create-page',
      () => createCreatorPage({ universeKey, routePath, title: pageTitle }),
      (page) => {
        setActivePage(page);
        setPageId(page.id);
        setAvailablePages((current) => [
          page,
          ...current.filter((candidate) => candidate.id !== page.id),
        ]);
        setItems([]);
        setCompositionDirty(false);
        setStatusMessage(`Page “${page.title}” created as a DRAFT.`);
      },
    );
  }

  async function loadPage(id: string): Promise<void> {
    await perform(
      'load-page',
      async () => {
        const [page, composition] = await Promise.all([
          getCreatorPage(id),
          getCreatorPageComposition(id),
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
        setCompositionDirty(false);
        setStatusMessage(`Loaded ${composition.items.length} composition items.`);
      },
    );
  }

  async function handleLoadPage(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    await loadPage(pageId.trim());
  }

  async function refreshPages(): Promise<void> {
    await perform(
      'list-pages',
      () => listCreatorPages(universeKey),
      (pages) => {
        setAvailablePages(pages);
        setStatusMessage(
          pages.length === 0
            ? 'No Composition Pages exist in this Universe yet.'
            : `Found ${pages.length} Composition Pages in this Universe.`,
        );
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
        setKnowledgeResourceId(resource.id);
        setActiveKnowledgeResource(resource);
        setAvailableKnowledgeResources((current) => [
          resource,
          ...current.filter((candidate) => candidate.id !== resource.id),
        ]);
        selectTypedEditorForResource(resource);
        setKnowledgeMediaManagerRevision((revision) => revision + 1);
        setStatusMessage(`Knowledge draft “${resource.resourceType}” created.`);
      },
    );
  }

  async function refreshKnowledgeResources(): Promise<void> {
    await perform(
      'list-knowledge',
      () => listCreatorKnowledgeResources(universeKey),
      (resources) => {
        setAvailableKnowledgeResources(resources);
        setStatusMessage(
          resources.length === 0
            ? 'No Knowledge Resources exist in this Universe yet.'
            : `Found ${resources.length} Knowledge Resources in this Universe.`,
        );
      },
    );
  }

  function selectKnowledgeResource(id: string): void {
    const resource = availableKnowledgeResources.find((candidate) => candidate.id === id) ?? null;
    setKnowledgeResourceId(id);
    setActiveKnowledgeResource(resource);
    if (resource) {
      setUniverseKey(resource.universeKey);
      setResourceType(resource.resourceType);
      selectTypedEditorForResource(resource);
      setKnowledgeMediaManagerRevision((revision) => revision + 1);
      setStatusMessage(`Selected ${resource.resourceType} for Entity and Media management.`);
    }
  }

  async function handleSuggestKnowledge(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setAiCandidate(null);
    await perform(
      'suggest-knowledge',
      () =>
        suggestCreatorKnowledgeCandidate({
          universeKey,
          request: aiRequest,
          contextQuery: aiContextQuery,
        }),
      (candidate) => {
        setAiCandidate(candidate);
        setStatusMessage(
          `AI suggested “${candidate.resourceType}”. Review it before canonical acceptance.`,
        );
      },
    );
  }

  async function acceptAiKnowledgeCandidate(): Promise<void> {
    if (!aiCandidate) {
      return;
    }

    await perform(
      'accept-knowledge',
      () => acceptCreatorKnowledgeCandidate(aiCandidate.generationId),
      (accepted) => {
        registerReference({
          kind: 'KNOWLEDGE_RESOURCE',
          id: accepted.resource.id,
          label: accepted.resource.resourceType,
        });
        setKnowledgeResourceId(accepted.resource.id);
        setActiveKnowledgeResource(accepted.resource);
        selectTypedEditorForResource(accepted.resource);
        setKnowledgeMediaManagerRevision((revision) => revision + 1);
        setAiCandidate(null);
        setStatusMessage(
          `AI suggestion “${accepted.resource.resourceType}” accepted as a canonical Knowledge draft.`,
        );
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
      setErrorMessage('Choose an image or Experience audio file before uploading.');
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
    if (compositionLocked) {
      setErrorMessage('Published or archived Page composition cannot be edited.');
      return;
    }
    const id = manualId.trim();
    if (!id) {
      setErrorMessage('Enter a canonical reference ID.');
      return;
    }
    setItems((current) => [
      ...current,
      { kind: manualKind, id, label: `${referenceName(manualKind)} ${id.slice(0, 8)}` },
    ]);
    setCompositionDirty(true);
    setManualId('');
    setErrorMessage(null);
    setStatusMessage(`${referenceName(manualKind)} reference added to the draft order.`);
  }

  function moveItem(index: number, direction: -1 | 1): void {
    if (compositionLocked) {
      return;
    }
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
    setCompositionDirty(true);
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
        setCompositionDirty(false);
        setStatusMessage(`Saved ${composition.items.length} ordered composition items.`);
      },
    );
  }

  async function publishPage(): Promise<void> {
    const id = pageId.trim();
    if (!id || !activePage) {
      setErrorMessage('Create or load a Page before publishing.');
      return;
    }
    if (compositionDirty) {
      setErrorMessage('Save the current composition before publishing.');
      return;
    }
    await perform(
      'publish-page',
      () => publishCreatorPage(id),
      (page) => {
        setActivePage(page);
        setStatusMessage(`Page “${page.title}” published.`);
      },
    );
  }

  async function archivePage(): Promise<void> {
    const id = pageId.trim();
    if (!id || !activePage) {
      setErrorMessage('Load a published Page before archiving.');
      return;
    }
    await perform(
      'archive-page',
      () => archiveCreatorPage(id),
      (page) => {
        setActivePage(page);
        setStatusMessage(`Page “${page.title}” archived.`);
      },
    );
  }

  return (
    <div className="aw-creator-workspace">
      <nav aria-label="Creator Studio tasks" className="aw-creator-task-nav">
        <p>Studio tasks</p>
        <div>
          <a href="#creator-page-task">Pages</a>
          <a href="#creator-knowledge-task">Knowledge</a>
          <a href="#creator-entity-task">Entities</a>
          <a href="#creator-media-task">Media</a>
          <a href="#creator-ai-task">AI review</a>
          <a href="#creator-administration-task">Administration</a>
          <a href="#creator-composition-task">Composition</a>
        </div>
      </nav>

      <section aria-labelledby="creator-work-context-title" className="aw-creator-work-context">
        <div>
          <p className="aw-eyebrow">Current work</p>
          <h2 id="creator-work-context-title">Studio context</h2>
        </div>
        <dl>
          <div>
            <dt>Page</dt>
            <dd>{activePage?.title ?? 'No Page selected'}</dd>
            <dd>
              {activePage ? `Page status: ${activePage.lifecycle}` : 'Choose or create a Page'}
            </dd>
          </div>
          <div>
            <dt>Knowledge</dt>
            <dd>{activeKnowledgeResource?.resourceType ?? 'No Resource selected'}</dd>
            <dd>
              {activeKnowledgeResource
                ? `Knowledge status: ${activeKnowledgeResource.lifecycle}`
                : 'Choose or create Knowledge'}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-5">
        <label className="text-sm font-semibold text-cyan-100" htmlFor="creator-universe-key">
          Active Universe
        </label>
        <input
          id="creator-universe-key"
          className={inputClassName}
          value={universeKey}
          disabled={busy}
          onChange={(event) => {
            setUniverseKey(event.target.value);
            setAiCandidate(null);
          }}
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
          id="creator-page-task"
          eyebrow="01 · Page"
          title="Create or load a Page"
          description="Pages move through the Composition-owned DRAFT, PUBLISHED, and ARCHIVED lifecycle."
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

          <div className="mt-6 border-t border-slate-800 pt-5">
            <label className="block text-sm font-medium" htmlFor="creator-existing-page">
              Existing Composition Pages
              <select
                id="creator-existing-page"
                className={inputClassName}
                value={availablePages.some((page) => page.id === pageId) ? pageId : ''}
                disabled={busy}
                onChange={(event) => {
                  const id = event.target.value;
                  setPageId(id);
                  if (id) void loadPage(id);
                }}
              >
                <option value="">Select a saved Page</option>
                {availablePages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title} — {page.lifecycle} — {page.routePath}
                  </option>
                ))}
              </select>
            </label>
            <button
              className={`${secondaryButtonClassName} mt-3`}
              type="button"
              disabled={busy}
              onClick={() => void refreshPages()}
            >
              {busyAction === 'list-pages' ? 'Refreshing…' : 'Refresh Composition Pages'}
            </button>
          </div>

          <form onSubmit={handleLoadPage} className="mt-6 border-t border-slate-800 pt-5">
            <label className="block text-sm font-medium" htmlFor="creator-page-id">
              Active Page ID
              <input
                id="creator-page-id"
                className={inputClassName}
                placeholder="UUID"
                value={pageId}
                disabled={busy}
                onChange={(event) => {
                  setPageId(event.target.value);
                  setActivePage(null);
                  setItems([]);
                  setCompositionDirty(false);
                }}
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
            <div className="mt-5 rounded-xl bg-slate-950/70 p-4 text-sm">
              <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                <dt className="text-slate-500">Lifecycle</dt>
                <dd>{activePage.lifecycle}</dd>
                <dt className="text-slate-500">Universe</dt>
                <dd className="break-all">{activePage.universeKey}</dd>
                <dt className="text-slate-500">Route</dt>
                <dd className="break-all">{activePage.routePath}</dd>
              </dl>
              <div className="mt-4 border-t border-slate-800 pt-4">
                {activePage.lifecycle === 'DRAFT' ? (
                  <button
                    className={primaryButtonClassName}
                    type="button"
                    disabled={busy || compositionDirty}
                    onClick={() => void publishPage()}
                  >
                    {busyAction === 'publish-page' ? 'Publishing…' : 'Publish Page'}
                  </button>
                ) : null}
                {activePage.lifecycle === 'PUBLISHED' ? (
                  <div className="flex flex-wrap gap-3">
                    <Link
                      className={primaryButtonClassName}
                      href={`/experiences/${encodeURIComponent(activePage.id)}`}
                    >
                      View published experience
                    </Link>
                    <button
                      className={secondaryButtonClassName}
                      type="button"
                      disabled={busy}
                      onClick={() => void archivePage()}
                    >
                      {busyAction === 'archive-page' ? 'Archiving…' : 'Archive Page'}
                    </button>
                  </div>
                ) : null}
                {activePage.lifecycle === 'ARCHIVED' ? (
                  <p className="text-slate-400">Archived Pages are terminal and read-only.</p>
                ) : null}
                {compositionDirty && activePage.lifecycle === 'DRAFT' ? (
                  <p className="mt-2 text-amber-200">Save composition changes before publishing.</p>
                ) : null}
              </div>
            </div>
          ) : null}
        </EditorCard>

        <EditorCard
          id="creator-knowledge-task"
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
          <div className="mt-6 border-t border-slate-800 pt-5">
            <div className="flex flex-wrap items-end gap-3">
              <label
                className="min-w-0 flex-1 text-sm font-medium"
                htmlFor="creator-knowledge-picker"
              >
                Existing Knowledge Resources
                <select
                  id="creator-knowledge-picker"
                  className={inputClassName}
                  value={knowledgeResourceId}
                  disabled={busy || availableKnowledgeResources.length === 0}
                  onChange={(event) => selectKnowledgeResource(event.target.value)}
                >
                  <option value="">Select a Knowledge Resource</option>
                  {availableKnowledgeResources.map((resource) => (
                    <option key={resource.id} value={resource.id}>
                      {resource.resourceType} — {resource.lifecycle}
                    </option>
                  ))}
                </select>
              </label>
              <button
                className={secondaryButtonClassName}
                type="button"
                disabled={busy || !universeKey.trim()}
                onClick={() => void refreshKnowledgeResources()}
              >
                {busyAction === 'list-knowledge' ? 'Refreshing…' : 'Refresh list'}
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Selecting a Resource carries it into the typed Entity and Media managers below.
            </p>
          </div>
        </EditorCard>

        <EditorCard
          id="creator-ai-task"
          eyebrow="03 · AI assistance"
          title="Suggest a Knowledge draft type"
          description="AI / Creator uses authorized published context. Its Generation stays non-canonical until you explicitly accept the candidate."
        >
          <form onSubmit={handleSuggestKnowledge} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-ai-request">
              Assistance request
              <textarea
                id="creator-ai-request"
                className={`${inputClassName} min-h-24 resize-y`}
                value={aiRequest}
                disabled={busy}
                onChange={(event) => setAiRequest(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium" htmlFor="creator-ai-context-query">
              Published Knowledge context search
              <input
                id="creator-ai-context-query"
                className={inputClassName}
                value={aiContextQuery}
                disabled={busy}
                onChange={(event) => setAiContextQuery(event.target.value)}
              />
            </label>
            <button
              className={primaryButtonClassName}
              type="submit"
              disabled={busy || !aiRequest.trim()}
            >
              {busyAction === 'suggest-knowledge' ? 'Generating…' : 'Generate AI suggestion'}
            </button>
          </form>

          {aiCandidate ? (
            <section
              aria-labelledby="creator-ai-candidate-title"
              className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4"
            >
              <p
                id="creator-ai-candidate-title"
                className="text-xs font-semibold uppercase tracking-wider text-amber-200"
              >
                Non-canonical suggestion
              </p>
              <p className="mt-2 text-lg font-semibold text-amber-50">{aiCandidate.resourceType}</p>
              <p className="mt-2 text-sm leading-6 text-amber-100/75">
                Review this model output. No Knowledge Resource exists until you accept it.
              </p>
              <button
                className={`${secondaryButtonClassName} mt-4`}
                type="button"
                disabled={busy}
                onClick={() => void acceptAiKnowledgeCandidate()}
              >
                {busyAction === 'accept-knowledge' ? 'Accepting…' : 'Accept as Knowledge draft'}
              </button>
            </section>
          ) : null}
        </EditorCard>

        <EditorCard
          id="creator-media-task"
          eyebrow="04 · Media"
          title="Upload a Media Asset"
          description="Binary storage and Asset lifecycle remain Media-owned. The workspace receives only the canonical Asset ID."
        >
          <p className="mb-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm leading-6 text-amber-100/85">
            Experience audio must be original, owned, properly licensed, royalty-cleared, or
            otherwise rights-verified. Uploaded ACTIVE Media is public by Asset ID immediately, even
            before a Page is published.
          </p>
          <form onSubmit={handleUploadMedia} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-media-file">
              Image or Experience audio file
              <input
                id="creator-media-file"
                className={inputClassName}
                type="file"
                accept="image/png,image/jpeg,audio/mp4"
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
          eyebrow="05 · Block"
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

        <EditorCard
          id="creator-administration-task"
          eyebrow="06 · Administration"
          title="Assign an accepted Role"
          description="Identity & Access owns Role assignment. Server authorization remains authoritative."
        >
          <form onSubmit={handleReviewRoleAssignment} className="space-y-4">
            <label className="block text-sm font-medium" htmlFor="creator-administration-actor-id">
              Target Actor ID
              <input
                id="creator-administration-actor-id"
                className={inputClassName}
                placeholder="UUID"
                value={administrationTargetActorId}
                disabled={busy}
                onChange={(event) => {
                  setAdministrationTargetActorId(event.target.value);
                  setRoleAssignmentReview(null);
                }}
              />
            </label>
            <label className="block text-sm font-medium" htmlFor="creator-administration-role">
              Role to assign
              <select
                id="creator-administration-role"
                className={inputClassName}
                value={administrationRole}
                disabled={busy}
                onChange={(event) => {
                  const role =
                    event.target.value === 'administrator' ? 'administrator' : 'knowledge-editor';
                  setAdministrationRole(role);
                  setRoleAssignmentReview(null);
                }}
              >
                <option value="knowledge-editor">Knowledge editor</option>
                <option value="administrator">Administrator</option>
              </select>
            </label>
            <button
              className={secondaryButtonClassName}
              type="submit"
              disabled={busy || !administrationTargetActorId.trim()}
            >
              Review Role assignment
            </button>
          </form>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            This Studio control does not decide who is an Administrator. The authenticated Session
            is evaluated by Identity & Access before any target Actor or Role mutation.
          </p>

          {roleAssignmentReview ? (
            <section
              aria-labelledby="creator-role-assignment-review-title"
              className="mt-5 rounded-xl border border-amber-400/30 bg-amber-400/10 p-4"
            >
              <h3
                id="creator-role-assignment-review-title"
                className="text-sm font-semibold text-amber-100"
              >
                Confirm Role assignment
              </h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div>
                  <dt className="text-slate-400">Target Actor</dt>
                  <dd className="break-all font-medium text-slate-100">
                    {roleAssignmentReview.targetActorId}
                  </dd>
                </div>
                <div>
                  <dt className="text-slate-400">Role</dt>
                  <dd className="font-medium text-slate-100">
                    {administrationRoleLabel(roleAssignmentReview.roleKey)}
                  </dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  className={primaryButtonClassName}
                  type="button"
                  disabled={busy}
                  onClick={() => void confirmRoleAssignment()}
                >
                  {busyAction === 'assign-role' ? 'Assigning…' : 'Confirm Role assignment'}
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy}
                  onClick={() => setRoleAssignmentReview(null)}
                >
                  Change selection
                </button>
              </div>
            </section>
          ) : null}
        </EditorCard>
      </div>

      <section
        id="creator-entity-task"
        aria-labelledby="creator-devotional-deity-editor-title"
        className="mt-6 scroll-mt-24 rounded-2xl border border-amber-400/20 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
          Devotional · Entity editor
        </p>
        <h2 id="creator-devotional-deity-editor-title" className="mt-2 text-xl font-semibold">
          Devotional Deity manager
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Deity management reuses the existing generic Creator Entity and Knowledge Media APIs.
        </p>
        <button
          className={`${secondaryButtonClassName} mt-4`}
          type="button"
          onClick={() => {
            setTypedEntityEditor('deity');
            setUniverseKey('universe.devotional');
            setResourceType('devotional.deity');
          }}
        >
          Use Deity manager
        </button>
      </section>

      <section
        aria-labelledby="creator-anime-entity-editor-title"
        className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-300">
          Anime · Entity editor
        </p>
        <h2 id="creator-anime-entity-editor-title" className="mt-2 text-xl font-semibold">
          Choose the typed Anime manager
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          Character and Series reuse the same Creator Knowledge APIs while keeping their accepted
          Entity vocabulary explicit.
        </p>
        <label
          className="mt-4 block max-w-sm text-sm font-medium"
          htmlFor="creator-anime-entity-editor"
        >
          Anime Entity editor
          <select
            id="creator-anime-entity-editor"
            className={inputClassName}
            value={animeEntityEditor}
            onChange={(event) => {
              const editor = event.target.value === 'series' ? 'series' : 'character';
              setTypedEntityEditor('anime');
              setAnimeEntityEditor(editor);
              setUniverseKey('universe.anime');
              setResourceType(editor === 'series' ? 'anime.series' : 'anime.character');
            }}
          >
            <option value="character">Character</option>
            <option value="series">Series</option>
          </select>
        </label>
        <button
          className={`${secondaryButtonClassName} mt-3`}
          type="button"
          onClick={() => {
            setTypedEntityEditor('anime');
            setUniverseKey('universe.anime');
            setResourceType(animeEntityEditor === 'series' ? 'anime.series' : 'anime.character');
          }}
        >
          Use selected Anime manager
        </button>
      </section>

      {typedEntityEditor === 'deity' ? (
        <DevotionalDeityManager
          key={`deity-${knowledgeMediaManagerRevision}`}
          knowledgeResourceId={knowledgeResourceId}
          initialResource={activeKnowledgeResource}
          onKnowledgeResourceIdChange={(id) => {
            setKnowledgeResourceId(id);
            if (activeKnowledgeResource?.id !== id) {
              setActiveKnowledgeResource(null);
            }
          }}
          onResourceChange={setActiveKnowledgeResource}
        />
      ) : animeEntityEditor === 'character' ? (
        <AnimeCharacterManager
          key={`character-${knowledgeMediaManagerRevision}`}
          knowledgeResourceId={knowledgeResourceId}
          initialResource={activeKnowledgeResource}
          onKnowledgeResourceIdChange={(id) => {
            setKnowledgeResourceId(id);
            if (activeKnowledgeResource?.id !== id) {
              setActiveKnowledgeResource(null);
            }
          }}
          onResourceChange={setActiveKnowledgeResource}
        />
      ) : (
        <AnimeSeriesManager
          key={`series-${knowledgeMediaManagerRevision}`}
          knowledgeResourceId={knowledgeResourceId}
          initialResource={activeKnowledgeResource}
          onKnowledgeResourceIdChange={(id) => {
            setKnowledgeResourceId(id);
            if (activeKnowledgeResource?.id !== id) {
              setActiveKnowledgeResource(null);
            }
          }}
          onResourceChange={setActiveKnowledgeResource}
        />
      )}

      <KnowledgeMediaManager
        key={knowledgeMediaManagerRevision}
        knowledgeResourceId={knowledgeResourceId}
        onKnowledgeResourceIdChange={(id) => {
          setKnowledgeResourceId(id);
          if (activeKnowledgeResource?.id !== id) {
            setActiveKnowledgeResource(null);
          }
        }}
      />

      <section
        id="creator-composition-task"
        className="mt-6 scroll-mt-24 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
              07 · Layout
            </p>
            <h2 className="mt-2 text-2xl font-semibold">Compose the Page</h2>
            <p className="mt-2 text-sm text-slate-400">
              Add typed canonical references, then move them into the exact persisted order.
            </p>
          </div>
          <button
            className={primaryButtonClassName}
            type="button"
            disabled={busy || !pageId.trim() || compositionLocked}
            onClick={() => void saveComposition()}
          >
            {busyAction === 'save-composition' ? 'Saving…' : 'Save composition'}
          </button>
        </div>

        {pageId.trim() ? (
          <div className="mt-4 flex flex-col gap-2 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-amber-100/80">
              Preview and publishing read the last saved composition. Save changes first.
            </p>
            <Link
              className={`${secondaryButtonClassName} shrink-0 text-center`}
              href={`/creator/preview/${encodeURIComponent(pageId.trim())}`}
            >
              Open saved preview
            </Link>
          </div>
        ) : null}

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
                  disabled={busy || compositionLocked}
                  onClick={() => {
                    setItems((current) => [...current, reference]);
                    setCompositionDirty(true);
                  }}
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
              disabled={busy || compositionLocked}
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
              disabled={busy || compositionLocked}
              onChange={(event) => setManualId(event.target.value)}
            />
          </label>
          <button
            className={secondaryButtonClassName}
            type="submit"
            disabled={busy || compositionLocked}
          >
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
                  disabled={busy || compositionLocked || index === 0}
                  aria-label={`Move item ${index + 1} up`}
                  onClick={() => moveItem(index, -1)}
                >
                  ↑
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || compositionLocked || index === items.length - 1}
                  aria-label={`Move item ${index + 1} down`}
                  onClick={() => moveItem(index, 1)}
                >
                  ↓
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || compositionLocked}
                  aria-label={`Remove item ${index + 1}`}
                  onClick={() => {
                    setItems((current) => current.filter((_, itemIndex) => itemIndex !== index));
                    setCompositionDirty(true);
                  }}
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
