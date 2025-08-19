'use client';

import Link from 'next/link';

import { AllDeploymentsData } from '@/app/(routegroups)/alldeployments/page';
import { BulkDeployment } from '@/app/(routegroups)/bulkdeployment/[bulkId]/page';
import { capitalize, handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { ExternalLink } from 'lucide-react';

import CancelDeployment from '../../cancelDeployment/CancelDeployment';
import {Row} from "@tanstack/react-table";

dayjs.extend(utc);
dayjs.extend(relativeTime);

type Deployment = AllDeploymentsData['deploymentsByFilter'][number];

const getDeploymentDuration = (deployment: Deployment) => {
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

const stringSortFn = (rowA: Row<BulkDeployment>, rowB: Row<BulkDeployment>, columnId: string) => {
  const a = rowA.getValue(columnId) as number;
  const b = rowB.getValue(columnId) as number;
  return a?.toString().localeCompare(b?.toString());
}

const intSortFn = (rowA: Row<BulkDeployment>, rowB: Row<BulkDeployment>, columnId: string) => {
  const a = rowA.getValue(columnId) as number;
  const b = rowB.getValue(columnId) as number;
  return a - b;
};

const BulkDeploymentColumns: DataTableColumnDef<BulkDeployment>[] = [
  {
    id: 'project_name',
    width: '15%',
    sortingFn: stringSortFn,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Project
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    accessorFn: deployment => deployment.environment?.project.name,
    cell: ({ row }) => {
      const projectName = row.original.environment?.project.name;
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
    accessorFn: deployment => deployment.environment?.name ?? '',
    width: '12%',
    sortingFn: stringSortFn,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Environment
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const deployment = row.original;
      return (
        <div>
          <Link
            className="hover:text-blue-800 transition-colors"
            href={`/projects/${deployment.environment?.project.name}/${deployment.environment?.openshiftProjectName}`}
          >
            {deployment.environment?.name}
          </Link>
        </div>
      );
    },
  },
  {
    id: 'deployment_name',
    width: '15%',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Deployment
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    accessorKey: 'name',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    cell: ({ row }) => {
      const deployment = row.original;

      return (
        <Link
          className="hover:text-blue-800 transition-colors"
          href={`/projects/${deployment.environment?.project.name}/${deployment.environment?.openshiftProjectName}/deployments/${deployment.name}`}
        >
          {deployment.name}
        </Link>
      );
    },
  },

  {
    accessorKey: 'priority',
    width: '10%',
    sortingFn: intSortFn,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Priority
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
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
    sortingFn: stringSortFn,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Status
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
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
    id: 'duration',
    accessorFn: row => {
      const deploymentStart = row.started || row.created;
      const durationStart = deploymentStart ? dayjs.utc(deploymentStart) : dayjs.utc();
      const durationEnd = row.completed ? dayjs.utc(row.completed) : dayjs.utc();
      return dayjs.duration(durationEnd.diff(durationStart)).asSeconds();
    },
    sortingFn: intSortFn,
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Duration
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const deployment = row.original;

      return getDeploymentDuration(deployment as unknown as Deployment);
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
            ? CancelDeployment({ deployment: deployment as unknown as Deployment })
            : null}
        </>
      );
    },
  },
];

export default BulkDeploymentColumns;
