function isUnsafeRedirectPath(path: string) {
  return path.startsWith('//') || path.startsWith('\\\\');
}

/**
 * Normalizes a login callback URL to a safe in-app relative path.
 * Accepts either a relative path or an absolute URL and returns `/`
 * for missing, invalid, or protocol-relative values.
 */
export function getRedirectPath(callbackUrl: string | null | undefined) {
  const normalizedCallbackUrl = callbackUrl?.trim();

  if (!normalizedCallbackUrl || isUnsafeRedirectPath(normalizedCallbackUrl)) {
    return '/';
  }

  if (normalizedCallbackUrl.startsWith('/')) {
    return normalizedCallbackUrl;
  }

  try {
    const { pathname, search, hash } = new URL(normalizedCallbackUrl);
    const redirectPath = `${pathname}${search}${hash}`;

    if (!redirectPath.startsWith('/') || isUnsafeRedirectPath(redirectPath)) {
      return '/';
    }

    return redirectPath;
  } catch {
    return '/';
  }
}
