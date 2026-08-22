'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import { Button } from '../ui/primitives';
import {
  createCollection,
  listCollectionResources,
  listCollections,
  listFavorites,
  removeCollectionResource,
  removeFavorite,
  type Collection,
  type CollectionResource,
  type Favorite,
} from './engagement-api';

interface CollectionView {
  readonly collection: Collection;
  readonly resources: readonly CollectionResource[];
}

type SavedState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly actorId: string;
      readonly favorites: readonly Favorite[];
      readonly collections: readonly CollectionView[];
    }
  | { readonly status: 'error'; readonly actorId: string; readonly message: string };

export function SavedExperience() {
  const { state: session } = useSession();
  const [state, setState] = useState<SavedState>({ status: 'loading' });
  const [collectionName, setCollectionName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const sessionActorId = session.status === 'authenticated' ? session.session.actorId : null;

  useEffect(() => {
    let active = true;

    if (!sessionActorId) {
      return () => {
        active = false;
      };
    }

    void Promise.all([listFavorites(), listCollections()])
      .then(async ([favorites, collections]) => {
        const resources = await Promise.all(
          collections.map(async (collection) => ({
            collection,
            resources: await listCollectionResources(collection.id),
          })),
        );

        if (active) {
          setState({
            status: 'ready',
            actorId: sessionActorId,
            favorites,
            collections: resources,
          });
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            actorId: sessionActorId,
            message: getApiErrorMessage(error),
          });
        }
      });

    return () => {
      active = false;
    };
  }, [sessionActorId]);

  if (session.status === 'loading') {
    return <p role="status">Checking your account…</p>;
  }

  if (session.status === 'anonymous') {
    return (
      <div className="aw-empty-state">
        <h2>Sign in to see your saved Knowledge</h2>
        <p>Favorites and Collections belong to your authenticated AI World account.</p>
        <Link className="aw-text-link" href="/sign-in">
          Sign in
        </Link>
      </div>
    );
  }

  if (session.status === 'error') {
    return <p role="alert">Your saved Knowledge is temporarily unavailable.</p>;
  }

  if (state.status === 'loading' || state.actorId !== session.session.actorId) {
    return <p role="status">Loading Favorites and Collections…</p>;
  }

  if (state.status === 'error') {
    return <p role="alert">{state.message}</p>;
  }

  async function createNewCollection(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (!collectionName.trim() || state.status !== 'ready') return;

    setBusy(true);
    setMessage(null);
    try {
      const collection = await createCollection(collectionName);
      setState({
        ...state,
        collections: [...state.collections, { collection, resources: [] }],
      });
      setCollectionName('');
      setMessage(`Collection “${collection.name}” created.`);
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function deleteFavorite(resourceId: string): Promise<void> {
    if (state.status !== 'ready') return;

    setBusy(true);
    setMessage(null);
    try {
      await removeFavorite(resourceId);
      setState({
        ...state,
        favorites: state.favorites.filter((item) => item.resourceId !== resourceId),
      });
      setMessage('Favorite removed.');
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function removeResource(collectionId: string, resourceId: string): Promise<void> {
    if (state.status !== 'ready') return;

    setBusy(true);
    setMessage(null);
    try {
      await removeCollectionResource(collectionId, resourceId);
      setState({
        ...state,
        collections: state.collections.map((item) =>
          item.collection.id === collectionId
            ? {
                ...item,
                resources: item.resources.filter((resource) => resource.resourceId !== resourceId),
              }
            : item,
        ),
      });
      setMessage('Resource removed from Collection.');
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="aw-saved-layout">
      {message ? (
        <p className="aw-saved-message" role="status">
          {message}
        </p>
      ) : null}

      <section className="aw-saved-panel" aria-labelledby="favorites-heading">
        <div className="aw-saved-panel__header">
          <div>
            <p className="aw-eyebrow">Quick access</p>
            <h2 id="favorites-heading">Favorites</h2>
          </div>
          <span>{state.favorites.length} saved</span>
        </div>

        {state.favorites.length === 0 ? (
          <div className="aw-empty-state">
            <p>No Favorites yet. Open a published Resource and save it for later.</p>
            <Link className="aw-text-link" href="/knowledge">
              Explore published Knowledge
            </Link>
          </div>
        ) : (
          <ul className="aw-saved-resource-list">
            {state.favorites.map((favorite) => (
              <li key={favorite.id}>
                <Link
                  className="aw-text-link"
                  href={`/knowledge/resources/${encodeURIComponent(favorite.resourceId)}`}
                >
                  {favorite.resourceId}
                </Link>
                <Button
                  variant="secondary"
                  compact
                  disabled={busy}
                  onClick={() => void deleteFavorite(favorite.resourceId)}
                >
                  Remove favorite
                </Button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="aw-saved-panel" aria-labelledby="collections-heading">
        <div className="aw-saved-panel__header">
          <div>
            <p className="aw-eyebrow">Organize</p>
            <h2 id="collections-heading">Collections</h2>
          </div>
          <span>{state.collections.length} collections</span>
        </div>

        <form className="aw-inline-save-form" onSubmit={(event) => void createNewCollection(event)}>
          <label>
            <span>Collection name</span>
            <input
              maxLength={120}
              value={collectionName}
              onChange={(event) => setCollectionName(event.target.value)}
              placeholder="Reading list"
            />
          </label>
          <Button type="submit" disabled={busy || !collectionName.trim()}>
            Create collection
          </Button>
        </form>

        {state.collections.length === 0 ? (
          <p className="aw-empty-state">Create your first Collection to organize Resources.</p>
        ) : (
          <div className="aw-collection-list">
            {state.collections.map(({ collection, resources }) => (
              <article className="aw-collection-card" key={collection.id}>
                <header>
                  <h3>{collection.name}</h3>
                  <span>{resources.length} resources</span>
                </header>

                {resources.length === 0 ? (
                  <div className="aw-empty-state">
                    <p>This Collection is empty. Add Resources while you explore.</p>
                    <Link className="aw-text-link" href="/knowledge">
                      Explore published Knowledge
                    </Link>
                  </div>
                ) : (
                  <ul className="aw-saved-resource-list">
                    {resources.map((resource) => (
                      <li key={resource.resourceId}>
                        <Link
                          className="aw-text-link"
                          href={`/knowledge/resources/${encodeURIComponent(resource.resourceId)}`}
                        >
                          {resource.resourceId}
                        </Link>
                        <Button
                          variant="secondary"
                          compact
                          disabled={busy}
                          onClick={() => void removeResource(collection.id, resource.resourceId)}
                        >
                          Remove from collection
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
