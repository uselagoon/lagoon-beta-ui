'use client';

import Link from 'next/link';

import { ProjectType } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { ChevronDown, ChevronUp } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(relativeTime);

type SortDirection = 'asc' | 'desc' | false;

type Column = {
  toggleSorting: (desc: boolean) => void;
  clearSorting: () => void;
};

export const handleSort = (sortDirection: SortDirection, column: Column) => {
  if (sortDirection === false) {
    column.toggleSorting(false);
  } else if (sortDirection === 'asc') {
    column.toggleSorting(true);
  } else {
    column.clearSorting();
  }
};

const getLatestDate = (environments: ProjectType['environments']) => {
  return environments
    .map(env => env.updated)
    .filter(date => date != null)
    .sort()
    .pop();
};

const ProjectsTableColumns: DataTableColumnDef<ProjectType>[] = [
  {
    accessorKey: 'name',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Project
          <div className="ml-1 flex flex-col">
            <ChevronUp
              className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')}
            />
            <ChevronDown
              className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')}
            />
          </div>
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
    id: 'last_deployment',
    accessorFn: row => {
      const date = getLatestDate(row.environments ?? []);
      return date ? new Date(date).getTime() : 0;
    },
    sortingFn: (rowA, rowB) => {
      const a = rowA.original;
      const b = rowB.original;

      const dateA = getLatestDate(a.environments);
      const dateB = getLatestDate(b.environments);

      return (dateA ? new Date(dateA).getTime() : 0) - (dateB ? new Date(dateB).getTime() : 0);
    },

    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Last Deployment
          <div className="ml-1 flex flex-col">
            <ChevronUp
              className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')}
            />
            <ChevronDown
              className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')}
            />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original;

      const lastDeploy = getLatestDate(project.environments);

      return lastDeploy ? (
        <Tooltip>
          <TooltipTrigger>{dayjs.utc(lastDeploy).local().fromNow()}</TooltipTrigger>
          <TooltipContent>{dayjs.utc(lastDeploy).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
        </Tooltip>
      ) : (
        '-'
      );
    },
  },
  {
    id: 'prod_route',
    header: 'Production Route',
    cell: ({ row }) => {
      const project = row.original;
      const prodRoute = project.environments.find(env => env.name === project.productionEnvironment)?.route;

      return (
        <div className="min-w-[20vw] truncate">
          {prodRoute && prodRoute !== 'undefined' ? prodRoute.replace(/^https?:\/\//i, '') : ''}
        </div>
      );
    },
  },

  {
    accessorKey: 'gitUrl',
    header: 'Git Repository URL',
    cell: ({ row }) => {
      const gitUrl = row.original.gitUrl;
      return <div className="max-w-[25vw] truncate">{gitUrl}</div>;
    },
  },
];

export default ProjectsTableColumns;
