'use client';

import { createContext, useContext, ReactNode, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
  ExtensionsConfig,
  ExtensionNavItem,
  ExtensionZone,
  ExtensionSidebarSection,
  ExtensionPage,
} from '@/lib/extensions/types';
import { hasAccess } from '@/lib/extensions/rbac';

type ExtensionContextValue = {
  getNavItemsForTarget: (target: ExtensionNavItem['target']) => ExtensionNavItem[];
  getSidebarSections: () => ExtensionSidebarSection[];
  getZonesForLocation: (location: ExtensionZone['zone']) => ExtensionZone[];
  hasFeature: (flag: string) => boolean;
  getPageConfig: (route: string) => ExtensionPage | undefined;
  canAccessRoute: (route: string) => boolean;
};

const ExtensionContext = createContext<ExtensionContextValue>({
  getNavItemsForTarget: () => [],
  getSidebarSections: () => [],
  getZonesForLocation: () => [],
  hasFeature: () => false,
  getPageConfig: () => undefined,
  canAccessRoute: () => true,
});

export function ExtensionProvider({
  children,
  extensions,
}: {
  children: ReactNode;
  extensions: ExtensionsConfig;
}) {
  const { data: session } = useSession();
  const userRoles = session?.roles;

  const value = useMemo<ExtensionContextValue>(() => {
    const sortByPosition = <T extends { position?: 'start' | 'end' | number }>(items: T[]): T[] =>
      items.sort((a, b) => {
        const posA = a.position === 'start' ? -1000 : a.position === 'end' ? 1000 : (a.position ?? 500);
        const posB = b.position === 'start' ? -1000 : b.position === 'end' ? 1000 : (b.position ?? 500);
        return posA - posB;
      });

    const getNavItemsForTarget = (target: ExtensionNavItem['target']): ExtensionNavItem[] => {
      const items: ExtensionNavItem[] = [];
      for (const ext of extensions.extensions) {
        ext.navigation?.items?.forEach(item => {
          if (item.target === target && hasAccess(userRoles, item.requiredRoles, item.excludeRoles)) {
            items.push(item);
          }
        });
      }
      return sortByPosition(items);
    };

    const getSidebarSections = (): ExtensionSidebarSection[] => {
      const sections: ExtensionSidebarSection[] = [];
      for (const ext of extensions.extensions) {
        ext.navigation?.sections?.forEach(section => {
          if (hasAccess(userRoles, section.requiredRoles)) {
            const filteredItems = section.items.filter(item =>
              hasAccess(userRoles, item.requiredRoles, item.excludeRoles)
            );
            if (filteredItems.length > 0) {
              sections.push({ ...section, items: filteredItems });
            }
          }
        });
      }
      return sortByPosition(sections);
    };

    const getZonesForLocation = (location: ExtensionZone['zone']): ExtensionZone[] => {
      const zones: ExtensionZone[] = [];
      for (const ext of extensions.extensions) {
        ext.zones?.forEach(zone => {
          if (zone.zone === location && hasAccess(userRoles, zone.requiredRoles)) {
            zones.push(zone);
          }
        });
      }
      return zones;
    };

    const hasFeature = (flag: string): boolean =>
      extensions.extensions.some(ext => ext.features?.[flag]);

    const getPageConfig = (route: string): ExtensionPage | undefined => {
      for (const ext of extensions.extensions) {
        const page = ext.pages?.find(p => p.route === route);
        if (page) return page;
      }
      return undefined;
    };

    const canAccessRoute = (route: string): boolean => {
      const pageConfig = getPageConfig(route);
      if (!pageConfig) return true;
      return hasAccess(userRoles, pageConfig.requiredRoles, pageConfig.excludeRoles);
    };

    return { getNavItemsForTarget, getSidebarSections, getZonesForLocation, hasFeature, getPageConfig, canAccessRoute };
  }, [extensions, userRoles]);

  return <ExtensionContext.Provider value={value}>{children}</ExtensionContext.Provider>;
}

export function useExtensions() {
  return useContext(ExtensionContext);
}
