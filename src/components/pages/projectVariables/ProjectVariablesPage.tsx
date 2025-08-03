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
import { Button, DataTable } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
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
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
      <Button
        data-testId="var-visibility-toggle"
        size="sm"
        className="max-w-max mb-4"
        disabled={prjLoading}
        onClick={handleShowProjectVars}
      >
        {prjLoading && <Loader2 className="animate-spin" />}
        {projectVarsVisible ? 'Hide values' : 'Show values'}
      </Button>

      <DataTable
        columns={tableColumns}
        data={prjEnvValues?.project?.envVariables || (variables as EnvVariable[])}
        disableExtra
        key={JSON.stringify(variables)}
      />
      <div className="my-4"></div>
      <AddNewVariable type="project" projectName={projectName} refetch={refetch} />
    </SectionWrapper>
  );
}
