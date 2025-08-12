'use client';

import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

import { ProjectData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/(project-overview)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ProjectNotFound from '@/components/errors/ProjectNotFound';
import { NewEnvironment } from '@/components/newEnvironment/NewEnvironment';
import { makeSafe } from '@/components/utils';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { createLinks } from '../environment/EnvironmentPage';
import { RoutesWrapper } from '../environment/styles';
import getProjectEnvsTableColumns from './ProjectEnvsTableColumns';

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
      defaultValue: 5,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 5),
    },
  });

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
    environments.find(env => env.name === productionEnvironment),
    ...environments.filter(env => env.name !== productionEnvironment),
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
          columns={getProjectEnvsTableColumns(pathname)}
          onRowClick={row => {
            const { name } = row.original;
            router.push(`${pathname}/${name}`);
          }}
          data={envTableData}
          searchableColumns={['title', 'region', 'deployType']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={env_count}
          renderFilters={table => (
            <SelectWithOptions
              options={[
                {
                  label: '5 results per page',
                  value: 5,
                },
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
