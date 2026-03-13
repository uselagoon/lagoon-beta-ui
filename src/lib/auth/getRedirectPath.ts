export function getRedirectPath(callbackUrl: string | null) {
  if (!callbackUrl || callbackUrl.startsWith('//')) {
    return '/';
  }

  if (callbackUrl.startsWith('/')) {
    return callbackUrl;
  }

  try {
    const { pathname, search, hash } = new URL(callbackUrl);
    const redirectPath = `${pathname}${search}${hash}`;

    return redirectPath.startsWith('//') ? '/' : redirectPath || '/';
  } catch {
    return '/';
  }
}
