'use client';

import { PendingChange } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/pending-changes/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { dateRangeFilter } from 'utils/tableDateRangeFilter';


dayjs.extend(utc);
dayjs.extend(relativeTime);


export const PendingChangesTableColumns: DataTableColumnDef<PendingChange>[] =
  [
    {
      accessorKey: 'type',
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
            Type
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
    },
    {
      accessorKey: 'details',
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
            Details
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
    },

    {
      accessorKey: 'date',
      filterFn: dateRangeFilter,
      width: '15%',
      header: ({ column }) => {
        const sortDirection = column.getIsSorted();
        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Change date
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },

      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;

        const dateA = a.date;

        const dateB = b.date;
        return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
      },

      cell: ({ row }) => {
        const createdLocalTime = dayjs.utc(row.original.date).local();
        return (
          <Tooltip>
            <TooltipTrigger>{createdLocalTime.fromNow()}</TooltipTrigger>
            <TooltipContent>{createdLocalTime.format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        );
      },
    },
  ];
