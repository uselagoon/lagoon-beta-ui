import { ParamValue } from 'next/dist/server/request/params';

import { ProjectDeployTargetsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/deploy-targets/page';
import { SidebarItem } from '@uselagoon/ui-library/dist/components/sidenav/Sidenav';
import { GitPullRequestDraft } from 'lucide-react';

import { EnvWithProblemsType } from './types';

export const getProjectNav = (
  projectSlug: ParamValue,
  envSlug: ParamValue,
  projectData?: ProjectDeployTargetsData,
  environmentData?: EnvWithProblemsType,
  projectLoading?: boolean,
  envLoading?: boolean
): SidebarItem[] => {
  const showDeployTargets =
    projectData?.project?.deployTargetConfigs?.length && projectData?.project?.deployTargetConfigs?.length > 0;

  return [
    {
      title: String(projectSlug),
      url: `/projects/${projectSlug}`,
      children: [
        {
          title: 'Environments',
          url: `/projects/${projectSlug}`,
          children: envSlug ? getEnvironmentNav(projectSlug, envSlug, environmentData) : undefined,
        },
        { title: 'Details', url: `/projects/${projectSlug}/project-details` },
        { title: 'Variables', url: `/projects/${projectSlug}/project-variables` },
        { title: 'Routes', url: `/projects/${projectSlug}/routes` },
        ...(showDeployTargets ? [{ title: 'Deploy Targets', url: `/projects/${projectSlug}/deploy-targets` }] : []),
      ],
    },
  ];
};

export const getEnvironmentNav = (
  projectSlug: ParamValue,
  environmentSlug: ParamValue,
  environmentData?: EnvWithProblemsType
): SidebarItem[] => {
  const showFactsTab = environmentData?.environment?.project?.factsUi === 1;
  const showProblemsTab = environmentData?.environment?.project?.problemsUi === 1;

  return [
    {
      title: String(environmentSlug),
      url: `/projects/${projectSlug}/${environmentSlug}`,
      icon: GitPullRequestDraft,
      children: [
        { title: 'Overview', url: `/projects/${projectSlug}/${environmentSlug}` },
        { title: 'Deployments', url: `/projects/${projectSlug}/${environmentSlug}/deployments` },
        { title: 'Backups', url: `/projects/${projectSlug}/${environmentSlug}/backups` },
        { title: 'Tasks', url: `/projects/${projectSlug}/${environmentSlug}/tasks` },
        ...(showProblemsTab
          ? [{ title: 'Problems', url: `/projects/${projectSlug}/${environmentSlug}/problems` }]
          : []),
        ...(showFactsTab ? [{ title: 'Insights', url: `/projects/${projectSlug}/${environmentSlug}/insights` }] : []),
        { title: 'Variables', url: `/projects/${projectSlug}/${environmentSlug}/environment-variables` },
      ],
    },
  ];
};

export const getOrgNav = (organizationSlug: ParamValue, showVariables?: boolean): SidebarItem[] => {
  return [
    {
      title: String(organizationSlug),
      url: `/organizations/${organizationSlug}`,
      children: [
        { title: 'Overview', url: `/organizations/${organizationSlug}` },
        { title: 'Groups', url: `/organizations/${organizationSlug}/groups` },
        { title: 'Users', url: `/organizations/${organizationSlug}/users` },
        { title: 'Projects', url: `/organizations/${organizationSlug}/projects` },
        ...(showVariables ? [{ title: 'Variables', url: `/organizations/${organizationSlug}/variables` }] : []),
        { title: 'Notifications', url: `/organizations/${organizationSlug}/notifications` },
        { title: 'Administration', url: `/organizations/${organizationSlug}/manage` },
      ],
    },
  ];
};
