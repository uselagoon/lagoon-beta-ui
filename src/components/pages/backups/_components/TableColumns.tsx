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

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.extend(utc);

function humanFileSize(size: number): string {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  const formatted = (size / Math.pow(1024, i)).toFixed(2) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];

  return formatted;
}

const retrieveBackup = (backup: Backup, type: 'failed' | 'retrievable' | 'unavailable') => (
  <AddRestore backup={backup} type={type} />
);

const BackupsTableColumns: DataTableColumnDef<Backup>[] = [
  {
    accessorKey: 'status',
    width: '10%',
    header: 'Status',
    filterFn: 'equals',
    cell: ({ row }) => {
      const backup = row.original;

      return (
        <section className="flex flex-col items-start gap-2">
          {backup.restore?.status ? (
            <Badge variant="default">{capitalize(backup.restore.status)}</Badge>
          ) : (
            <Badge variant="default">Unavailable</Badge>
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
      const status = backup.restore?.status;
      const size = backup.restore?.restoreSize || 0;
      const restoreLocation = backup.restore?.restoreLocation || '';
      const canDownload = isValidUrl(restoreLocation);

      switch (status) {
        case 'pending':
          return (
            <Tooltip>
              <TooltipTrigger>
                <Loader2 className="animate-spin" />
              </TooltipTrigger>
              <TooltipContent>Retrieving...</TooltipContent>
            </Tooltip>
          );
        case 'successful':
          return (
            <a href={canDownload ? restoreLocation : undefined} target="_blank">
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center">
                    <Download className="mr-1" /> (<span style={{ fontSize: '12px' }}>{humanFileSize(size)}</span>)
                  </div>
                </TooltipTrigger>
                <TooltipContent>Download ({humanFileSize(size)})</TooltipContent>
              </Tooltip>
            </a>
          );
        case 'failed':
          return retrieveBackup(backup, 'failed');
        // if there is no restore
        default:
          return retrieveBackup(backup, 'unavailable');
      }
    },
  },
];

export default BackupsTableColumns;
