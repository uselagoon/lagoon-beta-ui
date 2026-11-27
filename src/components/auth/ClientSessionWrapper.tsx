'use client';

import { ReactNode, useEffect } from 'react';

import { signIn, useSession } from 'next-auth/react';

/**
 *
 * A wrapper component used to initiate a forced keycloak auth on the client
 * workaround for logging out of multiple open tabs
 */
export default function ClientSessionWrapper({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && !session) {
      signIn('keycloak'); // force sign in on the client
    }
  }, [status, session]);

  if (status !== 'authenticated') {
    return null;
  }
  return <>{children}</>;
}
