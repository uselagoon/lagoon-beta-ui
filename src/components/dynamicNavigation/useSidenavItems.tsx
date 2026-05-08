import { useEffect, useState } from 'react';

import { useEnvContext } from '@/contexts/EnvContext';
import { ParamValue } from 'next/dist/server/request/params';
import { usePathname } from 'next/navigation';

// import { SidebarItem } from '@/contexts/AppContext';
import environmentWithProblems from '@/lib/query/environmentWithProblems';
import projectByNameQuery from '@/lib/query/projectByNameQuery';
import { useQuery } from '@apollo/client';
import { BriefcaseBusiness, FolderGit2, KeyRound, LifeBuoy, ListChecks, ServerCog, UserRoundCog } from 'lucide-react';
import { SidebarSection, FooterItem, SidebarItem } from '@/ui-library';
import { useOverrides } from "@/contexts/OverrideContext";

import { getOrgNav, getProjectNav } from './DynamicNavigation';
import { useExtensions } from '@/contexts/ExtensionContext';
import { resolveIcon } from '@/lib/extensions/icons';

const disableAccountLink = Boolean(process.env.LAGOON_UI_YOUR_ACCOUNT_DISABLED);

function getSection(items: SidebarItem[], url: string): SidebarItem | null {
  for (const item of items) {
    if (item.url === url) return item;
    if (item.children?.length) {
      const found = getSection(item.children, url);
      if (found) return found;
    }
  }
  return null;
}

const getBaseSidenavItems = (kcUrl: string): SidebarSection[] => [
  {
    section: 'Projects',
    sectionItems: [{ title: 'Projects', url: '/projects', icon: FolderGit2, collapsible: false }],
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

const useFooterSidenavItems = (kcUrl: string, disableAccountLink: boolean): FooterItem[] => {
  const overrides = useOverrides();

  return [
    { 
      title: 'Documentation', 
      url: overrides?.global?.documentationUrl || 'https://docs.lagoon.sh', 
      icon: LifeBuoy,
      target: 'blank'
    },
    ...(!disableAccountLink ? [{ 
      title: 'My Account', 
      url: `${kcUrl}/account`, 
      icon: UserRoundCog,
      target: 'blank'
    }] : []),
  ];
}

export function useSidenavItems(
  kcUrl: string,
  projectSlug: ParamValue,
  environmentSlug: ParamValue,
  organizationSlug: ParamValue
): [SidebarSection[], FooterItem[]] {
  const [sidenavItems, setSidenavItems] = useState(() => getBaseSidenavItems(kcUrl));

  const pathname = usePathname();

  const { LAGOON_UI_VIEW_ENV_VARIABLES } = useEnvContext();
  const footerItems = useFooterSidenavItems(kcUrl, disableAccountLink);
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
      'sidebar-environments': 0,
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
          if (organizationSlug) {
            href = href.replace('[organizationSlug]', organizationSlug as string);
          }
          if (/\[.+\]/.test(href)) continue;
          const navItem = { title: extItem.label, url: href, icon: resolveIcon(extItem.icon) };
          if (target === 'sidebar-projects' || target === 'sidebar-environments' || target === 'sidebar-organizations') {
            // match the parent section to the extension href so we can set the nav item at the proper level
            const parentUrl = href.split('/').slice(0, -1).join('/') || '/';
            const parentSection = getSection(items[idx].sectionItems, parentUrl);
            if (parentSection) {
              parentSection.children ??= [];
              if (extItem.position === 'start') {
                parentSection.children.unshift(navItem);
              } else {
                parentSection.children.push(navItem);
              }
            }
          } else {
            if (extItem.position === 'start') {
              items[idx].sectionItems.unshift(navItem);
            } else {
              items[idx].sectionItems.push(navItem);
            }
          }
        }
      }
    }

    setSidenavItems(items);
  }, [kcUrl, pathname, projectSlug, environmentSlug, organizationSlug, projectData, environmentData, getNavItemsForTarget, getSidebarSections, LAGOON_UI_VIEW_ENV_VARIABLES]);

  return [sidenavItems, footerItems];
}
