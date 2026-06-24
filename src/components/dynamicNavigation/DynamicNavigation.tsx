import { ParamValue } from 'next/dist/server/request/params';

import { ProjectDeployTargetsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/deploy-targets/page';
import { SidebarItem } from '@/ui-library/components/Sidenav/Sidenav';
import { GitPullRequestDraft } from 'lucide-react';

import { EnvWithProblemsType } from './types';
import { makeSafe } from '../utils';

type EnvironmentSummary = {
  name: string;
  environmentType: 'production' | 'development';
};

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
  const showRoutesTab = projectData?.project?.featureApiRoutes;
  const environments: EnvironmentSummary[] = projectData?.project?.environments ?? [];
  return [
    {
      title: String(projectSlug),
      url: `/projects/${projectSlug}`,
      children: [
        {
          title: 'Environments',
          url: `/projects/${projectSlug}`,
          children: envSlug ? getEnvironmentNav(projectSlug, environments, environmentData) : undefined,
        },
        { title: 'Details', url: `/projects/${projectSlug}/project-details` },
        { title: 'Variables', url: `/projects/${projectSlug}/project-variables` },
        ...(showRoutesTab ? [{ title: 'Routes', url: `/projects/${projectSlug}/routes` }] : []),
        ...(showDeployTargets ? [{ title: 'Deploy Targets', url: `/projects/${projectSlug}/deploy-targets` }] : []),
      ],
    },
  ];
};

export const getEnvironmentNav = (
  projectSlug: ParamValue,
  environments: EnvironmentSummary[],
  environmentData?: EnvWithProblemsType
): SidebarItem[] => {
  const showFactsTab = environmentData?.environment?.project?.factsUi === 1;
  const showProblemsTab = environmentData?.environment?.project?.problemsUi === 1;
  const showRoutesTab = environmentData?.environment?.project?.featureApiRoutes;

  return environments.map((env) => {
    const slug = `${projectSlug}-${makeSafe(env.name)}`;
    return {
      title: env.name,
      url: `/projects/${projectSlug}/${slug}`,
      icon: GitPullRequestDraft,
      collapsible: false,
      environmentType: env.environmentType,
      children: [
        { title: 'Overview', url: `/projects/${projectSlug}/${slug}` },
        { title: 'Deployments', url: `/projects/${projectSlug}/${slug}/deployments` },
        { title: 'Backups', url: `/projects/${projectSlug}/${slug}/backups` },
        { title: 'Tasks', url: `/projects/${projectSlug}/${slug}/tasks` },
        ...(showRoutesTab ? [{ title: 'Routes', url: `/projects/${projectSlug}/${slug}/routes` }] : []),
        ...(showProblemsTab ? [{ title: 'Problems', url: `/projects/${projectSlug}/${slug}/problems` }] : []),
        ...(showFactsTab ? [{ title: 'Insights', url: `/projects/${projectSlug}/${slug}/insights` }] : []),
        { title: 'Variables', url: `/projects/${projectSlug}/${slug}/environment-variables` },
      ],
    } as SidebarItem;
  });
}

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
        { title: 'Keys', url: `/organizations/${organizationSlug}/keys` },
        { title: 'Administration', url: `/organizations/${organizationSlug}/manage` },
      ],
    },
  ];
};
