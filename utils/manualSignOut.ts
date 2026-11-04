import { signOut } from 'next-auth/react';

import { clearWHTokenCache } from '@/hooks/useWHTokenPermission';

export default async function manualSignOut() {
  clearWHTokenCache();
  const response = await fetch('/api/logout', {
    method: 'GET',
    next: {
      tags: ['logout'],
    },
  });
  if (response.ok) {
    await signOut({ redirectTo: '/', redirect: true });
  } else {
    console.error('Failed to sign out');
    // we get here if keycloak errors out - force signout
    await signOut({ redirectTo: '/', redirect: true });
  }
}
