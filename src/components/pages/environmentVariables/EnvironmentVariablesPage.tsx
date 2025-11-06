'use client';

import { useCallback, useState } from 'react';

import { useRouter } from 'next/navigation';

import { EnvVariablesData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/environment-variables/page';
import { EnvVariable } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import environmentByProjectNameWithEnvVarsValueQuery from '@/lib/query/environmentByProjectNameWithEnvVarsValueQuery';
import environmentProjectByProjectNameWithEnvVarsValueQuery from '@/lib/query/environmentProjectByProjectNameWithEnvVarsValueQuery';
import { QueryRef, useLazyQuery, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import {Button, DataTable, SelectWithOptions, Switch} from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { useQueryStates } from 'nuqs';
import { toast } from 'sonner';

import { AddNewVariable } from '../../addNewVariable/AddNewVariable';
import {
  ProjectEnvVarsFullColumnsNoActions,
  ProjectEnvVarsPartialColumns,
  getEnvVarsColumns,
} from '../projectVariables/_components/DataTableColumns';
import { EditVariable } from '../projectVariables/_components/EditVariable';
import { scopeOptions, sortOptions } from './_components/filterValues';

export default function EnvironmentVariablesPage({
  queryRef,
  projectName,
  environmentName,
}: {
  queryRef: QueryRef<EnvVariablesData>;
  environmentName: string;
  projectName: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);
  const router = useRouter();

  const [envAction, setEnvAction] = useState('');
  const [envValuesVisible, setEnvValuesVisible] = useState(false);
  const [projectVarsVisible, setProjectVarsVisible] = useState(false);

  const {
    data: { environmentVars },
  } = useReadQuery(queryRef);

  const [{ results, search }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const [getEnvVarValues, { loading: envLoading, data: envValues }] = useLazyQuery(
    environmentByProjectNameWithEnvVarsValueQuery,
    {
      variables: { openshiftProjectName: environmentVars?.openshiftProjectName },
      onError: err => {
        console.error(err);
        toast.error('Unauthorized', {
          description: `You don't have permission to ${envAction} environment ${
            envAction === 'view' ? ' variable values' : 'variables'
          }. Contact your administrator to obtain the relevant permissions.`,
        });
      },
      onCompleted: () => setEnvValuesVisible(true),
    }
  );
  const [getPrjEnvVarValues, { loading: prjLoading, data: prjEnvValues }] = useLazyQuery(
    environmentProjectByProjectNameWithEnvVarsValueQuery,
    {
      variables: { openshiftProjectName: environmentVars?.openshiftProjectName },
      onError: err => {
        console.error(err);
        toast.error('Unauthorized', {
          description:
            "You don't have permission to view project variable values. Contact your administrator to obtain the relevant permissions",
        });
      },
      onCompleted: () => setProjectVarsVisible(true),
    }
  );

  const [checkEnvVars] = useLazyQuery(environmentByProjectNameWithEnvVarsValueQuery, {
    variables: { openshiftProjectName: environmentVars?.openshiftProjectName },
    onError: err => {
      console.error(err);
      toast.error('Unauthorized', {
        description: `You don't have permission to ${envAction} environment ${
          envAction === 'view' ? ' variable values' : 'variables'
        }. Contact your administrator to obtain the relevant permissions.`,
      });
    },
  });

  const permissionCheck = async (action: 'add' | 'delete') => {
    setEnvAction(action);
    return await checkEnvVars();
  };

  const stableAddPermissionCheck = useCallback(() => permissionCheck('add'), []);
  const stableDeletePermissionCheck = useCallback(() => permissionCheck('delete'), []);

  if (!environmentVars) {
    return <EnvironmentNotFound openshiftProjectName={environmentName} />;
  }

  const setSearch = (val: string) => {
    setQuery({ search: val });
  };

  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const variables = environmentVars.envVariables;
  const envName = environmentVars.name;

  const projectVariables = environmentVars.project.envVariables;

  const navToProjectVars = () => {
    router.push(`/projects/${projectName}/project-variables`);
  };

  const handleShowEnvVars = async () => {
    if (envValuesVisible) {
      setEnvValuesVisible(false);
      return;
    }

    await getEnvVarValues();
  };

  const handleShowProjectVars = async () => {
    if (projectVarsVisible) {
      setProjectVarsVisible(false);
      return;
    }
    await getPrjEnvVarValues();
  };

  const renderEnvTableWithValues =
    !envLoading && envValues?.environmentVars?.envVariables && envValuesVisible ? true : false;

  const envTableColumns = renderEnvTableWithValues
    ? getEnvVarsColumns(projectName, envName, refetch)
    : ProjectEnvVarsPartialColumns();

  const renderProjectTablewithValues =
    !prjLoading && prjEnvValues?.environmentVars?.project?.envVariables && projectVarsVisible ? true : false;

  const projectEnvTableColumns = renderProjectTablewithValues
    ? ProjectEnvVarsFullColumnsNoActions()
    : ProjectEnvVarsPartialColumns();

  return (
    <SectionWrapper>
      <div className="flex gap-2 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Environment variables</h3>
        <Switch
          label="Edit environment values"
          disabled={envLoading}
          loading={envLoading}
          checked={envValuesVisible}
          id=""
          description=""
          onCheckedChange={handleShowEnvVars}
        />
      </div>
      <DataTable
        columns={envTableColumns}
        data={envValues?.environmentVars?.envVariables || (variables as unknown as EnvVariable[])}
        initialSearch={search}
        initialPageSize={results}
        onSearch={searchStr => setSearch(searchStr)}
        renderFilters={table => (
          <div className="flex gap-2 items-baseline">
            <SelectWithOptions
              options={scopeOptions}
              width={100}
              placeholder="Filter by status"
              onValueChange={newVal => {
                const statusColumn = table.getColumn('scope');
                if (statusColumn && newVal != 'all') {
                  statusColumn.setFilterValue(newVal);
                } else {
                  statusColumn?.setFilterValue(undefined);
                }
              }}
            />
            <SelectWithOptions
              options={sortOptions}
              width={100}
              value={String(results || 10)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setResults(newVal);
              }}
            />
          </div>
        )}
        key="env-variables-table"
      />
      <div className="flex justify-end">
        <AddNewVariable
          onClick={() => stableAddPermissionCheck}
          type="environment"
          projectName={projectName}
          environmentName={envName}
          refetch={refetch}
        />
      </div>

      <section className="spacer my-8"><hr/></section>
      <div className="flex gap-2 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
        <Switch
          label="View project values"
          disabled={prjLoading}
          loading={prjLoading}
          checked={projectVarsVisible}
          id=""
          description=""
          onCheckedChange={handleShowProjectVars}
        />
      </div>

      <DataTable
        columns={projectEnvTableColumns}
        data={prjEnvValues?.environmentVars?.project?.envVariables || (projectVariables as EnvVariable[])}
        disableExtra
        key="project-variables-table"
      />

      <section className="my-4 flex justify-end">
        <Button onClick={navToProjectVars}>Edit Project Variables</Button>
      </section>
    </SectionWrapper>
  );
}
