'use client';

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getCurrentSession, logoutCurrentSession, type WebSession } from './session-api';

export type SessionState =
  | {
      readonly status: 'loading';
    }
  | {
      readonly status: 'anonymous';
    }
  | {
      readonly status: 'authenticated';
      readonly session: WebSession;
    }
  | {
      readonly status: 'error';
    };

interface SessionContextValue {
  readonly state: SessionState;
  refreshSession(): Promise<void>;
  signOut(): Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

async function resolveSessionState(): Promise<SessionState> {
  try {
    const session = await getCurrentSession();

    if (!session) {
      return {
        status: 'anonymous',
      };
    }

    return {
      status: 'authenticated',
      session,
    };
  } catch {
    return {
      status: 'error',
    };
  }
}

export function SessionProvider({ children }: { readonly children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    status: 'loading',
  });

  const refreshSession = useCallback(async (): Promise<void> => {
    setState({
      status: 'loading',
    });

    const nextState = await resolveSessionState();

    setState(nextState);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    try {
      await logoutCurrentSession();

      setState({
        status: 'anonymous',
      });
    } catch {
      setState({
        status: 'error',
      });
    }
  }, []);

  useEffect(() => {
    let active = true;

    void resolveSessionState().then((nextState) => {
      if (active) {
        setState(nextState);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<SessionContextValue>(
    () => ({
      state,
      refreshSession,
      signOut,
    }),
    [refreshSession, signOut, state],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext);

  if (!context) {
    throw new Error('useSession must be used within SessionProvider.');
  }

  return context;
}
