'use client';

import Link from 'next/link';

import { Deployment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import CancelDeployment from '@/components/cancelDeployment/CancelDeployment';
import { capitalize } from '@/components/utils';
import { Badge, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { dateRangeFilter } from 'utils/tableDateRangeFilter';

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

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

const getDeploymentTableColumns = (basePath: string) =>
  [
    {
      accessorKey: 'status',
      width: '15%',
      header: 'Status',
      filterFn: 'equals',
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
      accessorKey: 'name',
      width: '26%',
      header: 'Name/ID',
      cell: ({ row }) => {
        const { bulkId, name } = row.original;
        return (
          <section className="flex justify-between">
            <Link className="hover:text-blue-800 transition-colors" href={`${basePath}/${name}`}>
              {name}
            </Link>
            {bulkId ? (
              <div className="bulk-link bg-blue-400 hover:bg-blue-600 py-1 px-2 mr-10 rounded-sm transition-colors">
                <Link className="text-white" href={`/bulkdeployment/${bulkId}`}>
                  BULK
                </Link>
              </div>
            ) : null}
          </section>
        );
      },
    },

    {
      accessorKey: 'created',
      width: '18%',
      header: 'Timestamp',
      filterFn: dateRangeFilter,
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
      accessorKey: 'sourceType',
      width: '15%',
      header: 'Trigger',
    },
    {
      id: 'duration',
      width: '15%',
      header: 'Duration',
      cell: ({ row }) => {
        const deployment = row.original;

        return getDeploymentDuration(deployment);
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const deployment = row.original;

        return (
          <>
            {['new', 'pending', 'queued', 'running'].includes(deployment.status) && (
              <CancelDeployment deployment={deployment} />
            )}
          </>
        );
      },
    },
  ] as DataTableColumnDef<Deployment>[];

export default getDeploymentTableColumns;
