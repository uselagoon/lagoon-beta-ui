'use client';

import { EnvVariable } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import { DeleteVariableDialog } from '@/components/deleteVariable/DeleteVariableModal';
import { CopyToClipboard, DataTableColumnDef } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

import { EditVariable } from './EditVariable';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const ProjectEnvVarsPartialColumns = (projectName?: string, refetch?: () => void) =>
  [
    {
      accessorKey: 'name',
      width: '30%',
      header: 'Variable Name',
    },

    {
      accessorKey: 'scope',
      header: 'Scope',
      width: '20%',
    },
  ] as DataTableColumnDef<EnvVariable>[];

export const ProjectEnvVarsFullColumns = (projectName: string, refetch: () => void) =>
  [
    {
      accessorKey: 'name',
      width: '30%',
      header: 'Variable Name',
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      width: '20%',
    },
    {
      accessorKey: 'value',
      header: 'Value',
      width: '20%',
      cell: ({ row }) => {
        const value = row.original.value ?? '';
        return <>{value ? <CopyToClipboard withToolTip text={value} type="hiddenWithIcon" /> : ''}</>;
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      width: '10%',
      cell: ({ row }) => {
        const variable = row.original;

        return (
          <div className="flex gap-2">
            <EditVariable type="project" currentEnv={variable} projectName={projectName} refetch={refetch} />
            <DeleteVariableDialog type="project" currentEnv={variable} projectName={projectName} refetch={refetch} />
          </div>
        );
      },
    },
  ] as DataTableColumnDef<EnvVariable>[];

export const getEnvVarsColumns = (projectName: string, environmentName: string, refetch: () => void) =>
  [
    {
      accessorKey: 'name',
      width: '30%',
      header: 'Variable Name',
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      width: '20%',
    },
    {
      accessorKey: 'value',
      header: 'Value',
      width: '20%',
      cell: ({ row }) => {
        const value = row.original.value ?? '';
        return <>{value ? <CopyToClipboard withToolTip text={value} type="hiddenWithIcon" /> : ''}</>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      width: '10%',
      cell: ({ row }) => {
        const variable = row.original;

        return (
          <div className="flex gap-2">
            <EditVariable
              type="environment"
              projectName={projectName}
              currentEnv={variable}
              environmentName={environmentName}
              refetch={refetch}
            />
            <DeleteVariableDialog
              type="environment"
              environmentName={environmentName}
              currentEnv={variable}
              projectName={projectName}
              refetch={refetch}
            />
          </div>
        );
      },
    },
  ] as DataTableColumnDef<EnvVariable>[];

export const ProjectEnvVarsFullColumnsNoActions = () =>
  [
    {
      accessorKey: 'name',
      width: '30%',
      header: 'Variable Name',
    },
    {
      accessorKey: 'scope',
      header: 'Scope',
      width: '20%',
    },
    {
      accessorKey: 'value',
      header: 'Value',
      width: '20%',
      cell: ({ row }) => {
        const value = row.original.value ?? '';
        return <>{value ? <CopyToClipboard withToolTip text={value} type="hiddenWithIcon" /> : ''}</>;
      },
    },
  ] as DataTableColumnDef<EnvVariable>[];
