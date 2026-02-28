'use client';

import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { useExtensions } from '@/contexts/ExtensionContext';

type Props = {
  route: string;
  children: ReactNode;
  fallbackUrl?: string;
};

export function ExtensionRouteGuard({ route, children, fallbackUrl = '/projects' }: Props) {
  const { canAccessRoute, getPageConfig } = useExtensions();

  if (!canAccessRoute(route)) {
    const pageConfig = getPageConfig(route);
    redirect(pageConfig?.accessDeniedRedirect || fallbackUrl);
  }

  return <>{children}</>;
}
