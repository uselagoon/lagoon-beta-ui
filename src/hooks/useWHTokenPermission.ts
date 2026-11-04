import { useEffect, useState } from 'react';

import projectWebhookTokenQuery from '@/lib/query/projectWebhookTokenQuery';
import { useQuery } from '@apollo/client';

const storageKey = 'lagoon:webhook-token-denied:';
const storageExpiry = 60 * 60 * 1000;

const tokenDenied = (projectName: string) => {
  try {
    const raw = window.sessionStorage.getItem(storageKey + projectName);
    if (!raw) return false;

    if (Date.now() - JSON.parse(raw).deniedAt < storageExpiry) return true;

    window.sessionStorage.removeItem(storageKey + projectName);
  } catch {
    return false;
  }
  return false;
};

export const clearWHTokenCache = () => {
  try {
    Object.keys(window.sessionStorage)
      .filter(key => key.startsWith(storageKey))
      .forEach(key => window.sessionStorage.removeItem(key));
  } catch {
    return;
  }
};

// hook to handle caching webhook token permission errors as we're currently using these to as a psuedo permission check - stops 'Unauthorized: You don't have permission to x' spam against the api
// temporary until we can surface perms in the ui
export function useWHTokenPermission(projectName: string) {
  const [cacheChecked, setCacheChecked] = useState(false);
  const [cachedDenied, setCachedDenied] = useState(false);

  useEffect(() => {
    setCachedDenied(tokenDenied(projectName));
    setCacheChecked(true);
  }, [projectName]);

  const { data, loading, error, refetch } = useQuery<{ webhookToken: string | null }>(projectWebhookTokenQuery, {
    variables: { name: projectName },
    skip: !cacheChecked || cachedDenied,
  });

  useEffect(() => {
    if (!error?.graphQLErrors.length) {
      return;
    } 
    try {
      window.sessionStorage.setItem(storageKey + projectName, JSON.stringify({ deniedAt: Date.now() }));
    } catch {
      return;
    }
  }, [error, projectName]);

  return {webhookToken: data?.webhookToken, loading: !cacheChecked || loading, denied: cachedDenied || !!error, refetch: refetch };
}
