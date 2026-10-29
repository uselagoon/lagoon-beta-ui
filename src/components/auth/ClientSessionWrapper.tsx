'use client';

import { ReactNode, useEffect } from 'react';

import { signIn, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';

/**
 *
 * A wrapper component used to initiate a forced keycloak auth on the client
 * workaround for logging out of multiple open tabs
 *
 * actually show sign in failures instead of looping back to keycloak endlessly
 */
export default function ClientSessionWrapper({
  children,
  publicContent,
}: {
  children: ReactNode;
  publicContent?: ReactNode;
}) {
  const { data: session, status } = useSession();
  const isAuthErrorPage = usePathname() === '/autherror';

  useEffect(() => {
    if (status !== 'loading' && !session && !isAuthErrorPage) {
      signIn('keycloak'); // force sign in on the client
    }
  }, [status, session, isAuthErrorPage]);

  if (status === 'unauthenticated' && isAuthErrorPage) {
    return <>{publicContent}</>;
  }

  if (status !== 'authenticated') {
    return null;
  }
  return <>{children}</>;
}
