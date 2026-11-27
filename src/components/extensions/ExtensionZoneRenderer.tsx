'use client';

import React, { Suspense, lazy, ComponentType, useMemo, useRef } from 'react';
import { useExtensions } from '@/contexts/ExtensionContext';
import { ExtensionZoneLocation, ZoneDataMap } from '@/lib/extensions/types';
import { extensionComponentRegistry } from './registry';

type Props<Zone extends ExtensionZoneLocation> = {
  zone: Zone;
  data?: ZoneDataMap[Zone];
};

type RegistryModule = typeof extensionComponentRegistry;

// this resolves a component from the registry as we can't use the lazy dynamic imports with variable paths
function resolveComponent(comp: any, componentName: string): ComponentType<Record<string, unknown>> | null {
  if (comp?.default) return comp.default;
  if (comp?.[componentName]) return comp[componentName];
  return null;
}

// lazy was being called multiple times per render, causing some wild flashing (mounts/unmounts) - this stores the lazy reference so it's only called once
const lazyComponentCache = new Map<string, React.LazyExoticComponent<ComponentType<any>>>();

function getLazyComponent(registryKey: string, componentName: string, registry: RegistryModule): React.LazyExoticComponent<ComponentType<any>> {
  if (!lazyComponentCache.has(registryKey)) {
    const LazyComponent = lazy((): Promise<{ default: ComponentType<any> }> =>
      registry[registryKey as keyof RegistryModule]().then((mod) => {
        const resolved = resolveComponent(mod, componentName);
        if (!resolved) {
          console.warn(`No export for the component "${componentName}"`);
          return { default: () => null };
        }
        return { default: resolved };
      })
    );
    lazyComponentCache.set(registryKey, LazyComponent);
  }
  return lazyComponentCache.get(registryKey)!;
}

export function ExtensionZoneRenderer<Zone extends ExtensionZoneLocation>({ zone, data }: Props<Zone>) {
  const { getZonesForLocation } = useExtensions();
  const zoneEntries = getZonesForLocation(zone);

  // stops the component remounting when the data is passed
  const dataRef = useRef(data);
  const currentData = useMemo(() => {
    const prev = dataRef.current as Record<string, unknown> | undefined;
    const next = data as Record<string, unknown> | undefined;
    // basic check to see if the data has actually changed
    if (prev === next) return prev ?? {};
    if (prev && next && Object.keys(prev).length === Object.keys(next).length) {
      const changed = Object.keys(next).some(k => next[k] !== prev[k]);
      if (!changed) return prev;
    }
    dataRef.current = data;
    return next ?? {};
  }, [data]);

  if (zoneEntries.length === 0) return null;

  return (
    <>
      {zoneEntries.map(entry => {
        const registryKey = Object.keys(extensionComponentRegistry).find(
          key => key.endsWith(`/${entry.component}`)
        );

        if (!registryKey) {
          console.warn(`No registry entry found for component "${entry.component}" in zone "${zone}"`);
          return null;
        }

        const LazyComponent = getLazyComponent(registryKey, entry.component, extensionComponentRegistry);
        const props = { ...entry.props, ...currentData } as Record<string, unknown>;

        return (
          <Suspense key={entry.id} fallback={null}>
            <LazyComponent {...props} />
          </Suspense>
        );
      })}
    </>
  );
}
