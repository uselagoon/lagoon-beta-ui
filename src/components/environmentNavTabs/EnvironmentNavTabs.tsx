'use client';

import { ReactNode } from 'react';

import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

import environmentWithProblems from '@/lib/query/environmentWithProblems';
import { useQuery } from '@apollo/client';
import { Badge, Skeleton, TabNavigation } from '@uselagoon/ui-library';

import { LinkContentWrapper } from '../shared/styles';

const EnvironmentNavTabs = ({ children }: { children: ReactNode }) => {
  const { projectSlug, environmentSlug } = useParams<{ projectSlug: string; environmentSlug: string }>();

  const pathname = usePathname();

  const { loading, error, data } = useQuery(environmentWithProblems, {
    variables: { openshiftProjectName: environmentSlug },
  });

  const showFactsTab = data?.environment?.project?.factsUi === 1;
  const showProblemsTab = data?.environment?.project?.problemsUi === 1;

  return (
    <section className="flex flex-col gap-4">
      <TabNavigation
        pathname={pathname}
        items={[
          {
            key: 'overview',
            label: (
              <Link data-cy="nav-env-overview" href={`/projects/${projectSlug}/${environmentSlug}`}>
                <LinkContentWrapper>Overview</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'deployments',
            label: (
              <Link data-cy="nav-env-deployments" href={`/projects/${projectSlug}/${environmentSlug}/deployments`}>
                <LinkContentWrapper>Deployments</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'backups',
            label: (
              <Link data-cy="nav-backups" href={`/projects/${projectSlug}/${environmentSlug}/backups`}>
                <LinkContentWrapper>Backups</LinkContentWrapper>
              </Link>
            ),
          },

          {
            key: 'tasks',
            label: (
              <Link data-cy="nav-tasks" href={`/projects/${projectSlug}/${environmentSlug}/tasks`}>
                <LinkContentWrapper>Tasks</LinkContentWrapper>
              </Link>
            ),
          },

          ...(showProblemsTab
            ? [
                {
                  key: 'problems',
                  label: (
                    <Link data-cy="nav-problems" href={`/projects/${projectSlug}/${environmentSlug}/problems`}>
                      <div className="inline-flex gap-1">
                        Problems
                        {loading ? (
                          <Skeleton className="w-[24px] h-5 ml-2 rounded-full mr-2" />
                        ) : (
                          <Badge className="rounded-full" variant="default">
                            {data?.environment?.problems?.length}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  ),
                },
              ]
            : []),

          ...(showFactsTab
            ? [
                {
                  key: 'insights',
                  label: (
                    <Link data-cy="nav-insights" href={`/projects/${projectSlug}/${environmentSlug}/insights`}>
                      <LinkContentWrapper>Insights</LinkContentWrapper>
                    </Link>
                  ),
                },
              ]
            : []),

          {
            key: 'environment-variables',
            label: (
              <Link
                data-cy="nav-env-variables"
                href={`/projects/${projectSlug}/${environmentSlug}/environment-variables`}
              >
                <LinkContentWrapper>Variables</LinkContentWrapper>
              </Link>
            ),
          },
          {
            key: 'routes',
            label: (
              <Link
                data-cy="nav-env-routes"
                href={`/projects/${projectSlug}/${environmentSlug}/routes`}
              >
                <LinkContentWrapper>Routes</LinkContentWrapper>
              </Link>
            ),
          },
        ]}
      />
      {children}
    </section>
  );
};

export default EnvironmentNavTabs;
