'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getApiErrorMessage } from '../api/api-error-message';
import { useSession } from '../session/session-provider';
import { Button } from '../ui/primitives';
import {
  addCollectionResource,
  addFavorite,
  listCollections,
  listFavorites,
  removeFavorite,
  type Collection,
} from './engagement-api';

type ControlState =
  | { readonly status: 'loading' }
  | {
      readonly status: 'ready';
      readonly actorId: string;
      readonly favorite: boolean;
      readonly collections: readonly Collection[];
    }
  | { readonly status: 'error'; readonly actorId: string; readonly message: string };

export function ResourceEngagementControls({ resourceId }: { readonly resourceId: string }) {
  const { state: session } = useSession();
  const [state, setState] = useState<ControlState>({ status: 'loading' });
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
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
      .then(([favorites, collections]) => {
        if (!active) return;

        setState({
          status: 'ready',
          actorId: sessionActorId,
          favorite: favorites.some((favorite) => favorite.resourceId === resourceId),
          collections,
        });
        setSelectedCollectionId(collections[0]?.id ?? '');
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
  }, [resourceId, sessionActorId]);

  if (session.status === 'loading') {
    return <p role="status">Checking your saved items…</p>;
  }

  if (session.status === 'anonymous') {
    return (
      <aside className="aw-engagement-callout">
        <p>
          <Link className="aw-text-link" href="/sign-in">
            Sign in
          </Link>{' '}
          to favorite this Resource or add it to a Collection.
        </p>
      </aside>
    );
  }

  if (session.status === 'error') {
    return <p role="alert">Your saved items are temporarily unavailable.</p>;
  }

  if (state.status === 'loading' || state.actorId !== session.session.actorId) {
    return <p role="status">Loading your saved items…</p>;
  }

  if (state.status === 'error') {
    return <p role="alert">{state.message}</p>;
  }

  async function toggleFavorite(): Promise<void> {
    setBusy(true);
    setMessage(null);
    try {
      if (state.status !== 'ready') return;

      if (state.favorite) {
        await removeFavorite(resourceId);
        setState({ ...state, favorite: false });
        setMessage('Removed from Favorites.');
      } else {
        await addFavorite(resourceId);
        setState({ ...state, favorite: true });
        setMessage('Saved to Favorites.');
      }
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function saveToCollection(): Promise<void> {
    if (!selectedCollectionId) return;

    setBusy(true);
    setMessage(null);
    try {
      await addCollectionResource(selectedCollectionId, resourceId);
      setMessage('Added to Collection.');
    } catch (error) {
      setMessage(getApiErrorMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <aside className="aw-resource-engagement" aria-label="Save this resource">
      <div>
        <p className="aw-eyebrow">Your library</p>
        <h2>Save for later</h2>
      </div>

      <div className="aw-engagement-actions">
        <Button
          variant={state.favorite ? 'secondary' : 'primary'}
          disabled={busy}
          onClick={() => void toggleFavorite()}
        >
          {state.favorite ? 'Remove favorite' : 'Add to Favorites'}
        </Button>

        {state.collections.length > 0 ? (
          <>
            <label>
              <span>Collection</span>
              <select
                value={selectedCollectionId}
                disabled={busy}
                onChange={(event) => setSelectedCollectionId(event.target.value)}
              >
                {state.collections.map((collection) => (
                  <option key={collection.id} value={collection.id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </label>
            <Button
              variant="secondary"
              disabled={busy || !selectedCollectionId}
              onClick={() => void saveToCollection()}
            >
              Add to Collection
            </Button>
          </>
        ) : (
          <Link className="aw-text-link" href="/saved">
            Create a Collection
          </Link>
        )}
      </div>

      {message ? <p role="status">{message}</p> : null}
    </aside>
  );
}
