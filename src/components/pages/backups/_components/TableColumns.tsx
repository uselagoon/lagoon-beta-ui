'use client';

import { Backup } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import { capitalize } from '@/components/utils';
import {
  Badge,
  CopyToClipboard,
  DataTableColumnDef,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Download, Loader2 } from 'lucide-react';
import { isValidUrl } from 'utils/isValidUrl';

import { dateRangeFilter } from '../../../../../utils/tableDateRangeFilter';
import AddRestore from './AddRestore';
import {getBadgeVariant} from "../../../../../utils/setBadgeStatus";

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

const retrieveBackup = (backup: Backup, id: number) => <AddRestore backup={backup} environmentID={id} />;

const BackupsTableColumns = (envId: number) =>
  [
    {
      accessorKey: 'status',
      accessorFn: row => {
        return row.restore?.status || 'retrievable';
      },
      width: '10%',
      header: 'Status',
      filterFn: 'equals',
      cell: ({ row }) => {
        const backup = row.original;

        return (
          <section className="flex flex-col items-start gap-2">
            {backup.restore?.status ? (
              <Badge variant={getBadgeVariant(backup.restore?.status, null)}>{capitalize(backup.restore.status)}</Badge>
            ) : (
              <Badge variant="lagoon">Retrievable</Badge>
            )}
          </section>
        );
      },
    },
    {
      accessorKey: 'source',
      width: '10%',
      header: 'Source',
    },
    {
      accessorKey: 'backupId',
      width: '45%',
      header: 'Backup ID',
      cell: ({ row }) => {
        const id = row.original.backupId;
        return <CopyToClipboard text={id} withToolTip type="visible" width={450} />;
      },
    },

    {
      accessorKey: 'created',
      width: '20%',
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
      id: 'actions',
      cell: ({ row }) => {
        const backup = row.original;

        return retrieveBackup(backup, envId);
      },
    },
  ] as DataTableColumnDef<Backup>[];

export default BackupsTableColumns;
