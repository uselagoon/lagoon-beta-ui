'use client';

import Link from 'next/link';

import { Task } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import CancelTask from '@/components/cancelTask/CancelTask';
import {capitalize, handleSort, renderSortIcons} from '@/components/utils';
import {Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger} from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

export const getTaskDuration = (task: Task) => {
  const taskStart = task.started || task.created;
  const durationStart = taskStart ? dayjs.utc(taskStart) : dayjs.utc();
  const durationEnd = task.completed ? dayjs.utc(task.completed) : dayjs.utc();
  const duration = dayjs.duration(durationEnd.diff(durationStart));

  const hours = String(Math.floor(duration.asHours())).padStart(2, '0');
  const minutes = String(duration.minutes()).padStart(2, '0');
  const seconds = String(duration.seconds()).padStart(2, '0');

  let result = '';
  if (hours !== '00') result += `${hours}hr `;
  result += `${minutes}m ${seconds}sec`;

  return result.trim();
};
dayjs.extend(utc);
dayjs.extend(relativeTime);

const getTasksTableColumns = (basePath: string, projectId: number, environmentId: number) =>
  [
    {
      accessorKey: 'status',
      width: '20%',
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;
        return a.localeCompare(b);
      },
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
        const status = row.original.status;
        return <Badge variant="default">{capitalize(status)}</Badge>;
      },
    },
    {
      accessorKey: 'name',
      width: '20%',
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId) as string;
        const b = rowB.getValue(columnId) as string;
        return a.localeCompare(b);
      },
      header: ({ column }) => {
        const sortDirection = column.getIsSorted();

        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Task Name / ID
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const { taskName, name } = row.original;

        return (
          <div>
            <Link className="hover:text-blue-800 transition-colors" href={`${basePath}/${taskName}`}>
              {name}
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: 'created',
      width: '18%',
      header: 'Timestamp',
      cell: ({ row }) => {
        const { created } = row.original;

        return created ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(created).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(created).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          '-'
        );
      },
    },
    {
      accessorKey: 'service',
      width: '15%',
      header: 'Trigger',
    },

    {
      id: 'duration',
      header: 'Duration',
      cell: ({ row }) => {
        const task = row.original;

        return getTaskDuration(task);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const task = row.original;

        return (
          <>
            {['new', 'pending', 'queued', 'running'].includes(task.status) && (
              <CancelTask task={task} projectId={projectId} environmentId={environmentId} />
            )}
          </>
        );
      },
    },
  ] as DataTableColumnDef<Task>[];

export default getTasksTableColumns;
