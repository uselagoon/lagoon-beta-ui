'use client';

import { JSX } from 'react';

import Link from 'next/link';

import { RouterType } from '@/components/types';
import { capitalize, handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import LimitedRoutes from "@/components/pages/environment/_components/LimitedRoutes";

dayjs.extend(utc);
dayjs.extend(relativeTime);

type TableDataType = {
  name: string;
  title: string;
  deployType: string;
  activeRoutes: JSX.Element;
  envType: any;
  last_deployment: string;
  region: string;
};

const getProjectEnvsTableColumns = (basePath: string) =>
  [
    {
      id: 'envType',
      accessorKey: 'envType',
      width: '15%',
      header: 'Usage',
      cell: ({ row }) => {
        const envType = row.original.envType;
        return <Badge variant="default">{capitalize(envType)}</Badge>;
      },
    },
    {
      accessorKey: 'title',
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
            Environment
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const { name, title } = row.original;
        return (
          <Link className="text-inherit hover:!underline transition-all" href={`${basePath}/${name}`}>
            {title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'region',
      header: 'Region',
      width: '11%',
    },
    {
      accessorKey: 'deployType',
      header: 'Type',
      width: '11%',
    },

    {
      id: 'last_deployment',
      width: '15%',
      accessorFn: row => {
        const date = row.last_deployment;
        return date ? new Date(date).getTime() : 0;
      },
      sortingFn: (rowA, rowB) => {
        const a = rowA.original;
        const b = rowB.original;

        const dateA = a.last_deployment;
        const dateB = b.last_deployment;

        return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
      },

      header: ({ column }) => {
        const sortDirection = column.getIsSorted();
        return (
          <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
            Last Deploy
            <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
          </Button>
        );
      },
      cell: ({ row }) => {
        const lastDeployment = row.original.last_deployment;

        return lastDeployment ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(lastDeployment).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(lastDeployment).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Routes',
      accessorKey: 'activeRoutes',
      cell: ({ row }) => {
        const activeRoutes = row.original.activeRoutes;
        const routes = activeRoutes?.props?.children
        return <LimitedRoutes routes={routes} />;
      }
    },
  ] as DataTableColumnDef<TableDataType>[];

export default getProjectEnvsTableColumns;
