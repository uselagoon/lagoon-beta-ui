'use client';

import { useMemo } from 'react';
import type { SidebarItem, SidebarSection } from './Sidenav';

const useActivePaths = (sidenavItems: SidebarSection[], currentPath: string) => {
	const activePaths = useMemo(() => {
		const paths = new Set<string>();

		const markActive = (item: SidebarItem, parentUrl?: string): boolean => {
			const hasChildren = Array.isArray(item.children) && item.children.length > 0;
			const exactMatch = currentPath === item.url;
			const isDuplicateOfParent = parentUrl !== undefined && item.url === parentUrl;

			const hasDuplicateChild = hasChildren && item.children!.some((child) => child.url === item.url);

			let childActive = false;
			let exactChildMatch = false;

			if (hasChildren) {
				for (const child of item.children!) {
					const childResult = markActive(child, item.url);
					if (childResult) {
						childActive = true;
					}
					if (currentPath === child.url) {
						exactChildMatch = true;
					}
				}
			}

			let shouldBeActive = false;

			if (exactMatch) {
				shouldBeActive = true;
			} else if (isDuplicateOfParent) {
				shouldBeActive = false;
			} else if (hasChildren && childActive) {
				if (hasDuplicateChild) {
					if (exactChildMatch && currentPath === item.url) {
						shouldBeActive = true;
					} else {
						paths.add(`${item.url}:parent`);
						shouldBeActive = false;
					}
				} else {
					shouldBeActive = true;
				}
			} else if (item.url !== '/' && currentPath.startsWith(`${item.url}/`)) {
				shouldBeActive = true;
			}

			if (shouldBeActive) {
				paths.add(item.url);
			}

			return shouldBeActive || childActive;
		};

		sidenavItems.forEach((section) => {
			section.sectionItems.forEach((item) => markActive(item));
		});

		return paths;
	}, [sidenavItems, currentPath]);

	return activePaths;
};

export default useActivePaths;
