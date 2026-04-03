'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useApolloClient } from '@apollo/client';
import projectCloneStatus from '@/lib/query/organizations/projectCloneStatus';

const POLL_INTERVAL = 20000;
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
    return new Map(entries.map(e => [e.projectName, e]));
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
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // using a ref to track current reqs to stop duplicate fetches
  const inflightRef = useRef<Set<string>>(new Set());

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
    inflightRef.current.delete(projectName);
  }, []);

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
    },
    []
  );

  const unregisterClone = useCallback(
    (projectName: string) => {
      removeClone(projectName);
    },
    [removeClone]
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
    const poll = async () => {
      const activeClones = Array.from(clones.values()).filter(
        entry => !STATUSES.includes(entry.status)
      );

      for (const entry of activeClones) {
        if (inflightRef.current.has(entry.projectName)) continue;
        inflightRef.current.add(entry.projectName);

        // need to use this directly instead of the hook so we can dynamically poll
        apolloClient
          .query({
            query: projectCloneStatus,
            variables: { name: entry.projectName },
            fetchPolicy: 'network-only',
          })
          .then(({ data }) => {
            const status: string | undefined = data?.project?.clone?.status;
            if (status) {
              updateClone(entry.projectName, status);
              if (STATUSES.includes(status)) {
                setClones(prev => {
                  const next = new Map(prev);
                  const existing = next.get(entry.projectName);
                  if (existing) {
                    next.set(entry.projectName, { ...existing, status });
                    const forStorage = new Map(next);
                    forStorage.delete(entry.projectName);
                    saveToStorage(forStorage);
                  }
                  return next;
                });
              }
            }
          })
          .catch(() => {
            console.error(`clone status fetch failed for project ${entry.projectName}`);
          })
          .finally(() => {
            inflightRef.current.delete(entry.projectName);
          });
      }
    };

    if (pollingRef.current) {
      clearInterval(pollingRef.current);
    }

    const hasActiveClones = Array.from(clones.values()).some(
      entry => !STATUSES.includes(entry.status)
    );

    if (hasActiveClones) {
      pollingRef.current = setInterval(poll, POLL_INTERVAL);
    }

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [clones, apolloClient, updateClone]);

  useEffect(() => {
    const persisted = Array.from(clones.values());
    if (persisted.length === 0) return;

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
          } else if (status !== entry.status) {
            updateClone(entry.projectName, status);
            if (STATUSES.includes(status)) {
              setClones(prev => {
                const next = new Map(prev);
                const existing = next.get(entry.projectName);
                if (existing) {
                  next.set(entry.projectName, { ...existing, status });
                  const forStorage = new Map(next);
                  forStorage.delete(entry.projectName);
                  saveToStorage(forStorage);
                }
                return next;
              });
            }
          }
        })
        .catch(() => {
          console.error(`clone status fetch failed for project ${entry.projectName}`);
        });
    });
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
