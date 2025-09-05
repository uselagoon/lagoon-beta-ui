'use client';

import { useState } from 'react';

import {
  EnvVariable,
  ProjectEnvironmentsData,
} from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import ProjectNotFound from '@/components/errors/ProjectNotFound';
import projectByNameWithEnvVarsValueQuery from '@/lib/query/projectByNameWithEnvVarsValueQuery';
import { QueryRef, useLazyQuery, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import {DataTable, Switch} from '@uselagoon/ui-library';
import { toast } from 'sonner';

import { AddNewVariable } from '../../addNewVariable/AddNewVariable';
import { ProjectEnvVarsFullColumns, ProjectEnvVarsPartialColumns } from './_components/DataTableColumns';

export default function ProjectVariablesPage({
  queryRef,
  projectName,
}: {
  queryRef: QueryRef<ProjectEnvironmentsData>;
  projectName: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { project },
  } = useReadQuery(queryRef);

  const [projectVarsVisible, setProjectVarsVisible] = useState(false);

  const [getPrjEnvVarValues, { loading: prjLoading, data: prjEnvValues }] = useLazyQuery(
    projectByNameWithEnvVarsValueQuery,
    {
      variables: { name: projectName },
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
  if (!project) {
    return <ProjectNotFound projectName={projectName} />;
  }

  const variables = project.envVariables;

  const handleShowProjectVars = async () => {
    if (projectVarsVisible) {
      setProjectVarsVisible(false);
      return;
    }
    await getPrjEnvVarValues();
  };

  const renderTableWithValues = !prjLoading && prjEnvValues?.project?.envVariables && projectVarsVisible ? true : false;

  const tableColumns = renderTableWithValues
    ? ProjectEnvVarsFullColumns(projectName, refetch)
    : ProjectEnvVarsPartialColumns(projectName, refetch);

  return (
    <SectionWrapper>
      <div className="flex gap-2 mb-4 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
        <Switch
          data-testId="var-visibility-toggle"
          label="Edit values"
          disabled={prjLoading}
          loading={prjLoading}
          checked={projectVarsVisible}
          id=""
          description=""
          onCheckedChange={handleShowProjectVars}
        />
      </div>

      <DataTable
        columns={tableColumns}
        data={prjEnvValues?.project?.envVariables || (variables as EnvVariable[])}
        disableExtra
        key={JSON.stringify(variables)}
      />
      <div className="mt-4 flex justify-end">
      <AddNewVariable type="project" projectName={projectName} refetch={refetch} />
      </div>
    </SectionWrapper>
  );
}
