'use client';

import Link from 'next/link';

import { AllDeploymentsData } from '@/app/(routegroups)/alldeployments/page';
import { capitalize, handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { ExternalLink } from 'lucide-react';

import CancelDeployment from '../../cancelDeployment/CancelDeployment';

dayjs.extend(utc);
dayjs.extend(relativeTime);

type Deployment = AllDeploymentsData['deploymentsByFilter'][number];

export const getDeploymentDuration = (deployment: Deployment) => {
  const deploymentStart = deployment.started || deployment.created;
  const durationStart = deploymentStart ? dayjs.utc(deploymentStart) : dayjs.utc();
  const durationEnd = deployment.completed ? dayjs.utc(deployment.completed) : dayjs.utc();
  const duration = dayjs.duration(durationEnd.diff(durationStart));

  const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  let result = '';
  if (hours !== '00') result += `${hours}hr `;
  result += `${minutes}m ${seconds}sec`;

  return result.trim();
};

const AlldeploymentsTableColumns: DataTableColumnDef<Deployment>[] = [
  {
    accessorKey: 'project_name',
    width: '15%',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Project
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },

    cell: ({ row }) => {
      const projectName = row.original.name;
      return (
        <div>
          <Link className="hover:text-blue-800 transition-colors" href={`/projects/${projectName}`}>
            {projectName}
          </Link>
        </div>
      );
    },
  },

  {
    id: 'environment_name',
    header: 'Environment',
    accessorFn: deployment => deployment.environment?.name ?? '',
    width: '12%',
    cell: ({ row }) => {
      const deployment = row.original;
      return (
        <div>
          <Link
            className="hover:text-blue-800 transition-colors"
            href={`/projects/${deployment.environment?.project.name}/${deployment.environment?.openshiftProjectName}/deployments/${deployment.name}`}
          >
            {deployment.environment?.name}
          </Link>
        </div>
      );
    },
  },

  {
    id: 'openshift_name',
    header: 'Cluster',
    width: '10%',
    accessorFn: deployment => deployment.environment?.openshift.name ?? '',
    cell: ({ row }) => {
      const deployment = row.original;

      return <div>{deployment.environment?.openshift.name}</div>;
    },
  },

  {
    accessorKey: 'name',
    width: '15%',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Deployment
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },

  {
    accessorKey: 'priority',
    header: 'Priority',
    width: '10%',
  },

  {
    accessorKey: 'created',
    accessorFn: row => {
      const date = row.created;

      return date ? new Date(date).getTime() : 0;
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original;
      const b = rowB.original;

      const dateA = a.created;
      const dateB = b.created;

      return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Created
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdDate = row.original.created;

      return createdDate ? (
        <Tooltip>
          <TooltipTrigger>{dayjs.utc(createdDate).local().fromNow()}</TooltipTrigger>
          <TooltipContent>{dayjs.utc(createdDate).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
        </Tooltip>
      ) : (
        '-'
      );
    },
  },

  {
    accessorKey: 'status',
    header: 'Status',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    cell: ({ row }) => {
      const { status, buildStep } = row.original;
      return (
        <section className="flex flex-col items-start gap-2">
          <Badge variant="default">{capitalize(status)}</Badge>

          {!['complete', 'cancelled', 'failed'].includes(status) && buildStep && (
            <Tooltip>
              <TooltipTrigger>
                <Badge className="bg-blue-500 text-white dark:bg-blue-600" variant="secondary">
                  {buildStep}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{buildStep}</TooltipContent>
            </Tooltip>
          )}

          {buildStep && ['deployCompletedWithWarnings'].includes(buildStep) && (
            <Tooltip>
              <TooltipTrigger>
                <Badge className="text-[#ffbe00]" variant="secondary">
                  Completed with warnings
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{buildStep}</TooltipContent>
            </Tooltip>
          )}
        </section>
      );
    },
  },

  {
    accessorKey: 'duration',
    header: 'Duration',
    cell: ({ row }) => {
      const deployment = row.original;

      return getDeploymentDuration(deployment);
    },
  },
  {
    id: 'actions',
    header: 'Actions',

    cell: ({ row }) => {
      const deployment = row.original;

      return (
        <>
          <Link
            href={`/projects/${deployment.environment?.project.name}/${deployment.environment?.openshiftProjectName}/deployments/${deployment.name}`}
          >
            <Button variant="link">
              <Tooltip>
                <TooltipTrigger>
                  <ExternalLink />
                </TooltipTrigger>
                <TooltipContent>View deployment</TooltipContent>
              </Tooltip>
            </Button>
          </Link>
          {['new', 'pending', 'queued', 'running'].includes(deployment.status)
            ? CancelDeployment({ deployment })
            : null}
        </>
      );
    },
  },
];

export default AlldeploymentsTableColumns;
