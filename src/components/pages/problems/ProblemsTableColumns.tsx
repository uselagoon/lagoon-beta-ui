'use client';

import { Problem } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/problems/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const ProblemsColumns = (problemSelector?: (id: number) => void) =>
  [
    {
      accessorKey: 'identifier',
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
            CVE ID
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const { description, identifier, id } = row.original;
        return (
          <div
            onClick={() => problemSelector && problemSelector(id)}
            className="underline cursor-pointer hover:text-blue-800 transition-colors"
          >
            {identifier}
          </div>
        );
      },
    },

    {
      accessorKey: 'created',
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
      accessorKey: 'service',
      width: '10%',
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
      accessorKey: 'associatedPackage',
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
            Package
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const { associatedPackage, version } = row.original;

        return (
          <>
            {associatedPackage}:{version}
          </>
        );
      },
    },
  ] as DataTableColumnDef<Problem>[];

export default ProblemsColumns;
