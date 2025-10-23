'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { ProjectData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ProjectNotFound from '@/components/errors/ProjectNotFound';
import { NewEnvironment } from '@/components/newEnvironment/NewEnvironment';
import { makeSafe } from '@/components/utils';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

import { createLinks } from '../environment/EnvironmentPage';
import { RoutesWrapper } from '../environment/styles';
import getProjectEnvsTableColumns, { EnvTableDataType } from './ProjectEnvsTableColumns';

export default function ProjectEnvironmentsPage({
  queryRef,
  projectName,
}: {
  queryRef: QueryRef<ProjectData>;
  projectName: string;
}) {
  const pathname = usePathname();
  const { refetch } = useQueryRefHandlers(queryRef);
  const {
    data: { project },
  } = useReadQuery(queryRef);

  const router = useRouter();

  const [{ search, env_count }, setQuery] = useQueryStates({
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },

    env_count: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
  });

  // Show notification for environments with pending changes
  useEffect(() => {
    if (project?.environments) {
      const environmentsWithPendingChanges = project.environments.filter(
        env => env.pendingChanges && env.pendingChanges.length > 0
      );
      
      if (environmentsWithPendingChanges.length > 0) {
        toast.custom(
          (t) => (
            <div 
              className="flex items-center gap-3 p-4 border border-sky-500 rounded-lg shadow-lg max-w-md"
              style={{ 
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                color: '#000000'
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {environmentsWithPendingChanges.length === 1 
                    ? `Environment "${environmentsWithPendingChanges[0].name}" has changes requiring deployment`
                    : `${environmentsWithPendingChanges.length} environments have changes requiring deployment`
                  }
                </p>
              </div>
            </div>
          ),
          {
            duration: Infinity, // No auto-dismiss, no close button
            id: 'pending-changes-project', // Prevent duplicates
          }
        );
      }
    }
  }, [project?.environments]);

  if (!project) {
    return <ProjectNotFound projectName={projectName} />;
  }

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };

  const setEnvCount = (val: string) => {
    setQuery({ env_count: Number(val) });
  };
  const { environments } = project;
  const productionEnvironment = project.productionEnvironment;

  const sortedEnvironments = [
    environments.find(env => makeSafe(env.name) === productionEnvironment),
    ...environments.filter(env => makeSafe(env.name) !== productionEnvironment),
  ].filter(env => !!env);

  const envTableData = sortedEnvironments.map(environment => {

    const activeEnvironment =
      project.productionEnvironment &&
      project.standbyProductionEnvironment &&
      project.productionEnvironment == makeSafe(environment.name);
    const standbyEnvironment =
      project.productionEnvironment &&
      project.standbyProductionEnvironment &&
      project.standbyProductionEnvironment == makeSafe(environment.name);

    const envType = activeEnvironment
      ? 'active production'
      : standbyEnvironment
      ? 'standby production'
      : environment.environmentType;

    const routesToUse =
      standbyEnvironment || activeEnvironment
        ? standbyEnvironment
          ? project.standbyRoutes
          : project.productionRoutes
        : environment.routes;

    return {
      name: environment.openshiftProjectName,
      title: environment.name,
      deployType: environment.deployType,
      activeRoutes: <RoutesWrapper>{createLinks(routesToUse)}</RoutesWrapper>,
      envType: envType as any,
      last_deployment: environment.updated ?? '',
      region: environment.openshift?.cloudRegion ?? '',
      project: environment.project,
    };
  });

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Environments</h3>
        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          A list of all available environments for this project
        </span>

        <DataTable
          columns={getProjectEnvsTableColumns(pathname, refetch)}
          onRowClick={row => {
            const { name } = row.original;
            router.push(`${pathname}/${name}`);
          }}
          data={envTableData as EnvTableDataType[]}
          searchableColumns={['title', 'region', 'deployType']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={env_count}
          renderFilters={table => (
            <SelectWithOptions
              options={[
                {
                  label: '10 results per page',
                  value: 10,
                },
                {
                  label: '20 results per page',
                  value: 20,
                },
              ]}
              width={100}
              value={String(env_count)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setEnvCount(newVal);
              }}
            />
          )}
        />
        <NewEnvironment projectName={projectName} refetch={refetch} />
      </SectionWrapper>
    </>
  );
}
