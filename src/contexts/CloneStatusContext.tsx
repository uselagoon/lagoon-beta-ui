'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import projectCloneStatus from '@/lib/query/organizations/projectCloneStatus';
import projectCloneChangedSubscription from '@/lib/subscription/organizations/projectCloneChanged';

const LOCAL_STORAGE_KEY = 'lagoon-active-clones';
export const STATUSES = ['COMPLETE', 'FAILED', 'CANCELLED'];

type CloneEntry = {
  projectName: string;
  status: string;
  lastUpdated: number;
};

type CloneStatusContextValue = {
  registerClone: (projectName: string, initialStatus?: string) => void;
  unregisterClone: (projectName: string) => void;
  getCloneStatus: (projectName: string) => string | undefined;
  isCloning: (projectName: string) => boolean;
  isActionsDisabled: (projectName: string) => boolean;
};

const CloneStatusContext = createContext<CloneStatusContextValue | null>(null);

function loadFromStorage(): Map<string, CloneEntry> {
  if (typeof window === 'undefined') return new Map();
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return new Map();
    const entries: CloneEntry[] = JSON.parse(raw);
    const active = entries.filter(e => !STATUSES.includes(e.status));
    return new Map(active.map(e => [e.projectName, e]));
  } catch {
    return new Map();
  }
}

function saveToStorage(clones: Map<string, CloneEntry>) {
  if (typeof window === 'undefined') return;
  const entries = Array.from(clones.values());
  window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries));
}

export function CloneStatusProvider({ children }: { children: React.ReactNode }) {
  const [clones, setClones] = useState<Map<string, CloneEntry>>(() => loadFromStorage());
  const apolloClient = useApolloClient();
  const subscriptionsRef = useRef<Map<string, { unsubscribe: () => void }>>(new Map());
  const clonesRef = useRef(clones);
  clonesRef.current = clones;

  const updateClone = useCallback((projectName: string, status: string) => {
    setClones(prev => {
      const next = new Map(prev);
      next.set(projectName, { projectName, status, lastUpdated: Date.now() });
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeClone = useCallback((projectName: string) => {
    setClones(prev => {
      const next = new Map(prev);
      next.delete(projectName);
      saveToStorage(next);
      return next;
    });
  }, []);

  const unsubscribe = useCallback((projectName: string) => {
    const sub = subscriptionsRef.current.get(projectName);
    if (sub) {
      sub.unsubscribe();
      subscriptionsRef.current.delete(projectName);
    }
  }, []);

  const handleStatusChange = useCallback((projectName: string, status: string) => {
      setClones(prev => {
        const next = new Map(prev);
        const existing = next.get(projectName);
        if (existing) {
          next.set(projectName, { ...existing, status });
          const storage = new Map(next);
          storage.delete(projectName);
          saveToStorage(storage);
        }
        return next;
      });
      unsubscribe(projectName);
    },
    [unsubscribe]
  );

  const startSubscription = useCallback((projectName: string) => {
      if (subscriptionsRef.current.has(projectName)) return;

      const observable = apolloClient.subscribe({
        query: projectCloneChangedSubscription,
        variables: { project: projectName },
      });

      const sub = observable.subscribe({
        next: ({ data }) => {
          const status: string | undefined = data?.projectCloneChanged?.status;
          if (status) {
            if (STATUSES.includes(status)) {
              handleStatusChange(projectName, status);
            } else {
              updateClone(projectName, status);
            }
          }
        },
        error: err => {
          console.error(`Clone subscription error for project ${projectName}:`, err);
        },
      });

      subscriptionsRef.current.set(projectName, sub);
    },
    [apolloClient, handleStatusChange, updateClone]
  );

  const registerClone = useCallback(
    (projectName: string, initialStatus?: string) => {
      setClones(prev => {
        if (prev.has(projectName)) return prev;
        const next = new Map(prev);
        next.set(projectName, {
          projectName,
          status: initialStatus ?? 'PENDING',
          lastUpdated: Date.now(),
        });
        saveToStorage(next);
        return next;
      });
      const existingStatus = initialStatus ?? 'PENDING';
      if (!STATUSES.includes(existingStatus)) {
        startSubscription(projectName);
      }
    },
    [startSubscription]
  );

  const unregisterClone = useCallback(
    (projectName: string) => {
      unsubscribe(projectName);
      removeClone(projectName);
    },
    [unsubscribe, removeClone]
  );

  const getCloneStatus = useCallback(
    (projectName: string): string | undefined => {
      return clones.get(projectName)?.status;
    },
    [clones]
  );

  const isCloning = useCallback(
    (projectName: string): boolean => {
      const status = clones.get(projectName)?.status;
      return !!status && !STATUSES.includes(status);
    },
    [clones]
  );

  const isActionsDisabled = useCallback(
    (projectName: string): boolean => {
      return isCloning(projectName);
    },
    [isCloning]
  );

  useEffect(() => {
    const persisted = Array.from(clones.values());
    const nonTerminal = persisted.filter(e => !STATUSES.includes(e.status));
    if (nonTerminal.length === 0) return;

    nonTerminal.forEach(entry => {
      apolloClient
        .query({
          query: projectCloneStatus,
          variables: { name: entry.projectName },
          fetchPolicy: 'network-only',
        })
        .then(({ data }) => {
          const status: string | undefined = data?.project?.clone?.status;
          if (!status) {
            removeClone(entry.projectName);
          } else if (STATUSES.includes(status)) {
            handleStatusChange(entry.projectName, status);
          } else {
            if (status !== entry.status) {
              updateClone(entry.projectName, status);
            }
            startSubscription(entry.projectName);
          }
        })
        .catch(() => {
          console.error(`clone status fetch failed for project ${entry.projectName}`);
        });
    });
  }, []);

  useEffect(() => {
    return () => {
      subscriptionsRef.current.forEach(sub => sub.unsubscribe());
      subscriptionsRef.current.clear();
    };
  }, []);

  return (
    <CloneStatusContext.Provider
      value={{ registerClone, unregisterClone, getCloneStatus, isCloning, isActionsDisabled }}
    >
      {children}
    </CloneStatusContext.Provider>
  );
}

export function useCloneStatusContext(): CloneStatusContextValue {
  const ctx = useContext(CloneStatusContext);
  if (!ctx) {
    throw new Error('useCloneStatusContext must be used within a CloneStatusProvider');
  }
  return ctx;
}
