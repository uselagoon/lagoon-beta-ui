import { useEffect, useState } from 'react';

import { useEnvContext } from 'next-runtime-env';
import { ParamValue } from 'next/dist/server/request/params';
import { usePathname } from 'next/navigation';

import environmentWithProblems from '@/lib/query/environmentWithProblems';
import projectByNameQuery from '@/lib/query/projectByNameQuery';
import { useQuery } from '@apollo/client';
import { BriefcaseBusiness, FolderGit2, KeyRound, LifeBuoy, ListChecks, ServerCog, UserRoundCog } from 'lucide-react';
import { SidebarSection, FooterItem } from '@uselagoon/ui-library';
import { useOverrides } from "@/contexts/OverrideContext";
import { getOrgNav, getProjectNav } from './DynamicNavigation';

const disableAccountLink = Boolean(process.env.LAGOON_UI_YOUR_ACCOUNT_DISABLED);

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

const GetFooterSidenavItems = (kcUrl: string, disableAccountLink: boolean): FooterItem[] => {
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

  const footerItems = GetFooterSidenavItems(kcUrl, disableAccountLink);

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

    setSidenavItems(items);
  }, [kcUrl, pathname, projectSlug, environmentSlug, organizationSlug, projectData, environmentData]);

  return [sidenavItems, footerItems];
}
