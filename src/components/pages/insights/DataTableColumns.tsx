'use client';

import {
  Fact,
  Insight,
} from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/insights/page';
import { Problem } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/problems/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Download } from 'lucide-react';
import { dateRangeFilter } from 'utils/tableDateRangeFilter';

import { isValidUrl } from '../../../../utils/isValidUrl';
import { InsightDownload } from './InsightDownload';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const FactsTableColumns: DataTableColumnDef<Fact>[] = [
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
          Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },

  {
    accessorKey: 'description',
    width: '15%',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Description
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
  },

  {
    accessorKey: 'source',
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
          Source
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'value',
    width: '10%',
    header: 'Value',
  },
];

export const InsightsTableColumns = (envId?: number) =>
  [
    {
      accessorKey: 'file',
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
            Name
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
    },
    {
      accessorKey: 'service',
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
            Service
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
    },

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
      accessorKey: 'created',
      filterFn: dateRangeFilter,
      width: '15%',
      header: ({ column }) => {
        const sortDirection = column.getIsSorted();
        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Detected
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },

      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;

        const dateA = a.created;

        const dateB = b.created;
        return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
      },

      cell: ({ row }) => {
        const createdLocalTime = dayjs.utc(row.original.created).local();
        return (
          <Tooltip>
            <TooltipTrigger>{createdLocalTime.fromNow()}</TooltipTrigger>
            <TooltipContent>{createdLocalTime.format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        );
      },
    },

    {
      accessorKey: 'size',
      width: '15%',
      header: 'Size',
    },
    {
      id: 'actions',
      width: '10%',
      cell: ({ row }) => {
        return envId && <InsightDownload insight={row.original} environmentId={envId} />;
      },
    },
  ] as DataTableColumnDef<Insight>[];
