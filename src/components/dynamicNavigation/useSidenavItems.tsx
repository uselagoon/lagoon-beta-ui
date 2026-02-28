import { useEffect, useState } from 'react';

import { useEnvContext } from 'next-runtime-env';
import { ParamValue } from 'next/dist/server/request/params';
import { usePathname } from 'next/navigation';

import { SidebarSection } from '@/contexts/AppContext';
import environmentWithProblems from '@/lib/query/environmentWithProblems';
import projectByNameQuery from '@/lib/query/projectByNameQuery';
import { useQuery } from '@apollo/client';
import { BriefcaseBusiness, FolderGit2, KeyRound, ListChecks, ServerCog } from 'lucide-react';

import { getOrgNav, getProjectNav } from './DynamicNavigation';
import { useExtensions } from '@/contexts/ExtensionContext';
import { resolveIcon } from '@/lib/extensions/icons';

const getBaseSidenavItems = (kcUrl: string): SidebarSection[] => [
  {
    section: 'Projects',
    sectionItems: [{ title: 'Projects', url: '/projects', icon: FolderGit2 }],
  },
  {
    section: 'Deployments',
    sectionItems: [{ title: 'Active Deployments', url: '/alldeployments', icon: ServerCog }],
  },
  {
    section: 'Organizations',
    sectionItems: [{ title: 'Organizations', url: '/organizations', icon: BriefcaseBusiness }],
  },
  {
    section: 'Settings',
    sectionItems: [
      {
        title: 'SSH Keys',
        url: '/settings',
        icon: KeyRound,
      },
      {
        title: 'Preferences',
        url: '/settings/preferences',
        icon: ListChecks,
      },
    ],
  },
];
export function useSidenavItems(
  kcUrl: string,
  projectSlug: ParamValue,
  environmentSlug: ParamValue,
  organizationSlug: ParamValue
) {
  const [sidenavItems, setSidenavItems] = useState(() => getBaseSidenavItems(kcUrl));

  const pathname = usePathname();

  const { LAGOON_UI_VIEW_ENV_VARIABLES } = useEnvContext();
  const { getNavItemsForTarget, getSidebarSections } = useExtensions();

  const { data: projectData, loading: projectLoading } = useQuery(projectByNameQuery, {
    variables: { name: projectSlug },
    skip: !projectSlug,
  });

  const { data: environmentData, loading: envLoading } = useQuery(environmentWithProblems, {
    variables: { openshiftProjectName: environmentSlug },
    skip: !environmentSlug,
  });

  useEffect(() => {
    const items = getBaseSidenavItems(kcUrl);

    if (projectSlug) {
      const projectChildren = getProjectNav(
        projectSlug,
        environmentSlug,
        projectData,
        environmentData,
        projectLoading,
        envLoading
      );
      items[0].sectionItems[0].children = projectChildren;
    }

    if (organizationSlug) {
      const showVariables = LAGOON_UI_VIEW_ENV_VARIABLES == null ? true : false;
      const orgChildren = getOrgNav(organizationSlug, showVariables);
      items[2].sectionItems[0].children = orgChildren;
    }

    // Add extension sidebar sections
    const extensionSections = getSidebarSections();
    for (const section of extensionSections) {
      const newSection = {
        section: section.section,
        sectionItems: section.items.map(item => ({
          title: item.label,
          url: item.href,
          icon: resolveIcon(item.icon),
        })),
      };
      if (section.position === 'start') {
        items.unshift(newSection);
      } else if (typeof section.position === 'number') {
        items.splice(section.position, 0, newSection);
      } else {
        items.push(newSection);
      }
    }

    // Add extension items to existing sections
    const targetToIndex: Record<string, number> = {
      'sidebar-projects': 0,
      'sidebar-deployments': 1,
      'sidebar-organizations': 2,
      'sidebar-settings': 3,
    };
    for (const [target, idx] of Object.entries(targetToIndex)) {
      const extItems = getNavItemsForTarget(target as any);
      if (extItems.length > 0 && items[idx]) {
        for (const extItem of extItems) {
          let href = extItem.href;
          if (projectSlug) {
            href = href.replace('[projectSlug]', projectSlug as string);
          }
          if (environmentSlug) {
            href = href.replace('[environmentSlug]', environmentSlug as string);
          }
          const navItem = { title: extItem.label, url: href, icon: resolveIcon(extItem.icon) };
          if (extItem.position === 'start') {
            items[idx].sectionItems.unshift(navItem);
          } else {
            items[idx].sectionItems.push(navItem);
          }
        }
      }
    }

    setSidenavItems(items);
  }, [kcUrl, pathname, projectSlug, environmentSlug, organizationSlug, projectData, environmentData, getNavItemsForTarget, getSidebarSections, LAGOON_UI_VIEW_ENV_VARIABLES]);

  return sidenavItems;
}
