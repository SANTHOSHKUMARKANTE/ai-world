'use client';

import { type FormEvent, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import {
  getCreatorKnowledgeMedia,
  replaceCreatorKnowledgeMedia,
  uploadCreatorMediaAsset,
  type CreatorKnowledgeMediaPlacement,
  type CreatorKnowledgeMediaRole,
} from './creator-api';

type ManagedAssetType = 'IMAGE' | 'VIDEO';

interface PlacementDraft {
  readonly assetId: string;
  readonly assetType: ManagedAssetType;
  readonly playback: 'STILL' | 'SHORT_LOOP';
  readonly role: CreatorKnowledgeMediaRole;
  readonly altText: string;
  readonly caption: string;
  readonly posterAssetId: string;
}

export interface KnowledgeMediaManagerProps {
  readonly knowledgeResourceId: string;
  readonly onKnowledgeResourceIdChange: (id: string) => void;
}

const inputClassName =
  'mt-2 w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 disabled:opacity-60';
const primaryButtonClassName =
  'rounded-xl bg-cyan-400 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50';
const secondaryButtonClassName =
  'rounded-xl border border-slate-700 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50';

function toDraft(placement: CreatorKnowledgeMediaPlacement): PlacementDraft {
  const assetType: ManagedAssetType = placement.playback === 'SHORT_LOOP' ? 'VIDEO' : 'IMAGE';

  return {
    assetId: placement.assetId,
    assetType,
    playback: assetType === 'VIDEO' ? 'SHORT_LOOP' : 'STILL',
    role: placement.role,
    altText: placement.altText ?? '',
    caption: placement.caption ?? '',
    posterAssetId: placement.posterAssetId ?? '',
  };
}

export function KnowledgeMediaManager({
  knowledgeResourceId,
  onKnowledgeResourceIdChange,
}: KnowledgeMediaManagerProps) {
  const [placements, setPlacements] = useState<readonly PlacementDraft[]>([]);
  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [existingAssetId, setExistingAssetId] = useState('');
  const [existingAssetType, setExistingAssetType] = useState<ManagedAssetType>('IMAGE');
  const [existingPosterAssetId, setExistingPosterAssetId] = useState('');
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const busy = busyAction !== null;

  function appendPlacement(input: {
    readonly assetId: string;
    readonly assetType: ManagedAssetType;
    readonly posterAssetId?: string;
  }): void {
    if (placements.some((placement) => placement.assetId === input.assetId)) {
      throw new Error('That Media Asset is already present in this Knowledge media draft.');
    }

    const first = placements.length === 0;
    setPlacements((current) => [
      ...current,
      {
        assetId: input.assetId,
        assetType: input.assetType,
        playback: input.assetType === 'VIDEO' ? 'SHORT_LOOP' : 'STILL',
        role: first ? 'HERO' : 'GALLERY',
        altText: '',
        caption: '',
        posterAssetId: input.posterAssetId ?? '',
      },
    ]);
  }

  function changeKnowledgeResourceId(id: string): void {
    setPlacements([]);
    setStatusMessage(null);
    setErrorMessage(null);
    onKnowledgeResourceIdChange(id);
  }

  async function loadPlacements(): Promise<void> {
    const id = knowledgeResourceId.trim();
    if (!id) {
      setErrorMessage('Enter or create a Knowledge Resource ID before loading media.');
      return;
    }

    setBusyAction('load');
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const response = await getCreatorKnowledgeMedia(id);
      setPlacements(
        [...response.placements].sort((left, right) => left.position - right.position).map(toDraft),
      );
      setStatusMessage(`Loaded ${response.placements.length} Knowledge media placements.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  async function uploadPlacement(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    if (!primaryFile) {
      setErrorMessage('Choose a PNG, JPEG, or bounded MP4 file first.');
      return;
    }

    let assetType: ManagedAssetType;
    if (primaryFile.type === 'video/mp4') {
      assetType = 'VIDEO';
    } else if (primaryFile.type === 'image/png' || primaryFile.type === 'image/jpeg') {
      assetType = 'IMAGE';
    } else {
      setErrorMessage('Placement upload supports PNG, JPEG, or bounded MP4 only.');
      return;
    }

    if (assetType === 'VIDEO' && !posterFile) {
      setErrorMessage('A VIDEO short loop requires a PNG or JPEG poster image.');
      return;
    }

    if (posterFile && posterFile.type !== 'image/png' && posterFile.type !== 'image/jpeg') {
      setErrorMessage('The VIDEO poster must be a PNG or JPEG image.');
      return;
    }

    setBusyAction('upload');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const primary = await uploadCreatorMediaAsset(primaryFile);
      if (primary.assetType !== assetType) {
        throw new Error('Uploaded Media type did not match the selected file.');
      }

      let posterAssetId = '';
      if (assetType === 'VIDEO' && posterFile) {
        const poster = await uploadCreatorMediaAsset(posterFile);
        if (poster.assetType !== 'IMAGE') {
          throw new Error('VIDEO poster upload did not resolve to an IMAGE Asset.');
        }
        posterAssetId = poster.id;
      }

      appendPlacement({
        assetId: primary.id,
        assetType,
        ...(posterAssetId ? { posterAssetId } : {}),
      });

      setPrimaryFile(null);
      setPosterFile(null);
      setStatusMessage(
        `Added ${assetType === 'VIDEO' ? 'short-motion VIDEO' : 'IMAGE'} to the placement draft.`,
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  function addExistingPlacement(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const assetId = existingAssetId.trim();
    const posterAssetId = existingPosterAssetId.trim();

    if (!assetId) {
      setErrorMessage('Enter an existing canonical Media Asset ID.');
      return;
    }
    if (existingAssetType === 'VIDEO' && !posterAssetId) {
      setErrorMessage('An existing VIDEO placement requires an IMAGE poster Asset ID.');
      return;
    }

    try {
      appendPlacement({
        assetId,
        assetType: existingAssetType,
        ...(posterAssetId ? { posterAssetId } : {}),
      });
      setExistingAssetId('');
      setExistingPosterAssetId('');
      setErrorMessage(null);
      setStatusMessage('Existing Media Asset added to the placement draft.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  function updatePlacement(
    index: number,
    update: (placement: PlacementDraft) => PlacementDraft,
  ): void {
    setPlacements((current) =>
      current.map((placement, placementIndex) =>
        placementIndex === index ? update(placement) : placement,
      ),
    );
  }

  function movePlacement(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= placements.length) {
      return;
    }

    setPlacements((current) => {
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

  async function savePlacements(): Promise<void> {
    const id = knowledgeResourceId.trim();
    if (!id) {
      setErrorMessage('Enter or create a Knowledge Resource ID before saving media.');
      return;
    }

    if (placements.filter((placement) => placement.role === 'HERO').length > 1) {
      setErrorMessage('Only one Knowledge media placement can have the HERO role.');
      return;
    }

    if (placements.some((placement) => placement.altText.trim().length === 0)) {
      setErrorMessage('Every Knowledge media placement requires meaningful alt text.');
      return;
    }

    if (
      placements.some(
        (placement) =>
          placement.assetType === 'VIDEO' && placement.posterAssetId.trim().length === 0,
      )
    ) {
      setErrorMessage('Every VIDEO short loop requires an IMAGE poster Asset ID.');
      return;
    }

    setBusyAction('save');
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const response = await replaceCreatorKnowledgeMedia(
        id,
        placements.map((placement) => ({
          assetId: placement.assetId,
          role: placement.role,
          playback: placement.playback,
          altText: placement.altText.trim(),
          caption: placement.caption.trim() || null,
          posterAssetId:
            placement.assetType === 'VIDEO' ? placement.posterAssetId.trim() || null : null,
        })),
      );

      setPlacements(response.placements.map(toDraft));
      setStatusMessage(`Saved ${response.placements.length} Knowledge media placements.`);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    } finally {
      setBusyAction(null);
    }
  }

  return (
    <section
      aria-labelledby="creator-knowledge-media-title"
      className="mt-6 rounded-2xl border border-cyan-500/25 bg-slate-900/80 p-5 shadow-xl shadow-black/10"
    >
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Knowledge · Media
          </p>
          <h2 id="creator-knowledge-media-title" className="mt-2 text-2xl font-semibold">
            Knowledge media placements
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Manage only the contextual Media fields proven by the shared Entity foundation. Media
            remains Asset owner; Knowledge owns role, order, alt text, caption, playback, and VIDEO
            poster selection.
          </p>
        </div>
        <button
          className={primaryButtonClassName}
          type="button"
          disabled={busy}
          onClick={() => void savePlacements()}
        >
          {busyAction === 'save' ? 'Saving…' : 'Save media placements'}
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block text-sm font-medium" htmlFor="creator-knowledge-media-resource-id">
          Active Knowledge Resource ID
          <input
            id="creator-knowledge-media-resource-id"
            className={inputClassName}
            placeholder="UUID"
            value={knowledgeResourceId}
            disabled={busy}
            onChange={(event) => changeKnowledgeResourceId(event.target.value)}
          />
        </label>
        <button
          className={secondaryButtonClassName}
          type="button"
          disabled={busy || !knowledgeResourceId.trim()}
          onClick={() => void loadPlacements()}
        >
          {busyAction === 'load' ? 'Loading…' : 'Load media placements'}
        </button>
      </div>

      {statusMessage ? (
        <p
          role="status"
          className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200"
        >
          {statusMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <form
          onSubmit={(event) => void uploadPlacement(event)}
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
        >
          <h3 className="font-semibold">Upload into placement draft</h3>
          <p className="mt-1 text-sm text-slate-500">
            PNG/JPEG becomes STILL. A bounded MP4 becomes SHORT_LOOP and requires a poster.
          </p>
          <label className="mt-4 block text-sm font-medium" htmlFor="creator-placement-primary">
            Primary Media file
            <input
              id="creator-placement-primary"
              className={inputClassName}
              type="file"
              accept="image/png,image/jpeg,video/mp4"
              disabled={busy}
              onChange={(event) => setPrimaryFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <label className="mt-4 block text-sm font-medium" htmlFor="creator-placement-poster">
            VIDEO poster image
            <input
              id="creator-placement-poster"
              className={inputClassName}
              type="file"
              accept="image/png,image/jpeg"
              disabled={busy}
              onChange={(event) => setPosterFile(event.target.files?.[0] ?? null)}
            />
          </label>
          <button
            className={`${secondaryButtonClassName} mt-4`}
            type="submit"
            disabled={busy || !primaryFile}
          >
            {busyAction === 'upload' ? 'Uploading…' : 'Add uploaded media'}
          </button>
        </form>

        <form
          onSubmit={addExistingPlacement}
          className="rounded-xl border border-slate-800 bg-slate-950/60 p-4"
        >
          <h3 className="font-semibold">Select an existing Asset</h3>
          <p className="mt-1 text-sm text-slate-500">
            Use a canonical Media Asset ID when the Asset already exists.
          </p>
          <label className="mt-4 block text-sm font-medium" htmlFor="creator-existing-asset-id">
            Existing Asset ID
            <input
              id="creator-existing-asset-id"
              className={inputClassName}
              value={existingAssetId}
              disabled={busy}
              onChange={(event) => setExistingAssetId(event.target.value)}
            />
          </label>
          <label className="mt-4 block text-sm font-medium" htmlFor="creator-existing-asset-type">
            Existing Asset type
            <select
              id="creator-existing-asset-type"
              className={inputClassName}
              value={existingAssetType}
              disabled={busy}
              onChange={(event) =>
                setExistingAssetType(event.target.value === 'VIDEO' ? 'VIDEO' : 'IMAGE')
              }
            >
              <option value="IMAGE">IMAGE · STILL</option>
              <option value="VIDEO">VIDEO · SHORT_LOOP</option>
            </select>
          </label>
          {existingAssetType === 'VIDEO' ? (
            <label className="mt-4 block text-sm font-medium" htmlFor="creator-existing-poster-id">
              Existing poster Asset ID
              <input
                id="creator-existing-poster-id"
                className={inputClassName}
                value={existingPosterAssetId}
                disabled={busy}
                onChange={(event) => setExistingPosterAssetId(event.target.value)}
              />
            </label>
          ) : null}
          <button
            className={`${secondaryButtonClassName} mt-4`}
            type="submit"
            disabled={busy || !existingAssetId.trim()}
          >
            Add existing Asset
          </button>
        </form>
      </div>

      <ol aria-label="Knowledge media placement order" className="mt-6 space-y-4">
        {placements.map((placement, index) => (
          <li
            key={placement.assetId}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-semibold text-cyan-300">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {placement.assetType} · {placement.playback}
                </p>
                <p className="truncate text-xs text-slate-600">{placement.assetId}</p>
              </div>
              <div className="flex gap-2">
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || index === 0}
                  aria-label={`Move media ${index + 1} up`}
                  onClick={() => movePlacement(index, -1)}
                >
                  ↑
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy || index === placements.length - 1}
                  aria-label={`Move media ${index + 1} down`}
                  onClick={() => movePlacement(index, 1)}
                >
                  ↓
                </button>
                <button
                  className={secondaryButtonClassName}
                  type="button"
                  disabled={busy}
                  aria-label={`Remove media ${index + 1}`}
                  onClick={() =>
                    setPlacements((current) =>
                      current.filter((_, placementIndex) => placementIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium">
                Role for media {index + 1}
                <select
                  className={inputClassName}
                  value={placement.role}
                  disabled={busy}
                  onChange={(event) => {
                    const value = event.target.value as CreatorKnowledgeMediaRole;
                    updatePlacement(index, (current) => ({ ...current, role: value }));
                  }}
                >
                  <option value="HERO">HERO</option>
                  <option value="GALLERY">GALLERY</option>
                  <option value="HIGHLIGHT">HIGHLIGHT</option>
                </select>
              </label>
              <label className="block text-sm font-medium">
                Alt text for media {index + 1}
                <input
                  className={inputClassName}
                  value={placement.altText}
                  disabled={busy}
                  onChange={(event) =>
                    updatePlacement(index, (current) => ({
                      ...current,
                      altText: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block text-sm font-medium">
                Caption for media {index + 1}
                <input
                  className={inputClassName}
                  value={placement.caption}
                  disabled={busy}
                  onChange={(event) =>
                    updatePlacement(index, (current) => ({
                      ...current,
                      caption: event.target.value,
                    }))
                  }
                />
              </label>
              {placement.assetType === 'VIDEO' ? (
                <label className="block text-sm font-medium">
                  Poster Asset ID for media {index + 1}
                  <input
                    className={inputClassName}
                    value={placement.posterAssetId}
                    disabled={busy}
                    onChange={(event) =>
                      updatePlacement(index, (current) => ({
                        ...current,
                        posterAssetId: event.target.value,
                      }))
                    }
                  />
                </label>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      {placements.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center text-sm text-slate-500">
          No Knowledge media placements loaded yet.
        </p>
      ) : null}
    </section>
  );
}
