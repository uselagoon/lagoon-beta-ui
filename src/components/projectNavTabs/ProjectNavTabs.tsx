'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import projectByNameQuery from '@/lib/query/projectByNameQuery';
import { useQuery } from '@apollo/client';
import { TabNavigation } from '@uselagoon/ui-library';
import { useExtensions } from '@/contexts/ExtensionContext';

import { LinkContentWrapper } from '../shared/styles';

export const ProjectNavTabs = ({ children }: { children: ReactNode }) => {
  const { projectSlug, environmentSlug } = useParams<{ projectSlug: string; environmentSlug: string }>();

  const pathname = usePathname();

  const { data } = useQuery(projectByNameQuery, {
    variables: { name: projectSlug },
  });

  const showDeployTargets = data?.project?.deployTargetConfigs?.length > 0;

  const { getNavItemsForTarget } = useExtensions();
  const extensionTabs = getNavItemsForTarget('project-tabs');

  // Do not nest multiple navTabs (project -> environment)
  if (environmentSlug) {
    return children;
  }
  return (
    <section className="flex flex-col gap-4">
      <TabNavigation
        pathname={pathname}
        items={[
          {
            key: 'environments',
            label: (
              <Link data-cy="nav-environments" href={`/projects/${projectSlug}`}>
                <LinkContentWrapper>Environments</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'project-details',
            label: (
              <Link data-cy="nav-details" href={`/projects/${projectSlug}/project-details`}>
                <LinkContentWrapper>Details</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'project-variables',
            label: (
              <Link data-cy="nav-variables" href={`/projects/${projectSlug}/project-variables`}>
                <LinkContentWrapper>Variables</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'routes',
            label: (
              <Link data-cy="nav-env-routes" href={`/projects/${projectSlug}/routes`}>
                <LinkContentWrapper>Routes</LinkContentWrapper>
              </Link>
            ),
          },
          ...(showDeployTargets
            ? [
                {
                  key: 'deploy-targets',
                  label: (
                    <Link data-cy="nav-targets" href={`/projects/${projectSlug}/deploy-targets`}>
                      <LinkContentWrapper>Deploy Targets</LinkContentWrapper>
                    </Link>
                  ),
                },
              ]
            : []),
          ...extensionTabs.map(ext => ({
            key: ext.id,
            label: (
              <Link data-cy={`nav-ext-${ext.id}`} href={ext.href.replace('[projectSlug]', projectSlug)}>
                <LinkContentWrapper>{ext.label}</LinkContentWrapper>
              </Link>
            ),
          })),
        ]}
      />

      {children}
    </section>
  );
};

export default ProjectNavTabs;
