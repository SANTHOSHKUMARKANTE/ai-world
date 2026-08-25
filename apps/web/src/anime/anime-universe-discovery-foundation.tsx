'use client';

import { useEffect, useState } from 'react';

import { listPublicKnowledgeDiscovery } from '../knowledge/public-knowledge-discovery-api';

type DiscoveryFoundationState =
  | { readonly status: 'connecting'; readonly count: 0 }
  | { readonly status: 'ready'; readonly count: number }
  | { readonly status: 'error'; readonly count: 0 };

export function AnimeUniverseDiscoveryFoundation() {
  const [state, setState] = useState<DiscoveryFoundationState>({
    status: 'connecting',
    count: 0,
  });

  useEffect(() => {
    let active = true;

    void listPublicKnowledgeDiscovery({
      universeKey: 'universe.anime',
      resourceType: 'anime.character',
      limit: 6,
    })
      .then((items) => {
        if (active) {
          setState({
            status: 'ready',
            count: items.length,
          });
        }
      })
      .catch(() => {
        if (active) {
          setState({
            status: 'error',
            count: 0,
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <span
      hidden
      data-uxp03a-discovery-foundation="true"
      data-discovery-status={state.status}
      data-discovery-count={String(state.count)}
    />
  );
}
