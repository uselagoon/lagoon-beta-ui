'use client';

import { createContext, useContext, ReactNode } from 'react';

type EnvContextValue = Record<string, string | undefined>;

const EnvContext = createContext<EnvContextValue>({});

export function EnvProvider({ env, children }: { env: EnvContextValue; children: ReactNode }) {
  return <EnvContext.Provider value={env}>{children}</EnvContext.Provider>;
}

export function useEnvContext(): EnvContextValue {
  return useContext(EnvContext);
}
