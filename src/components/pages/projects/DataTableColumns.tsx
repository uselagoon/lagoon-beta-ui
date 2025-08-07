'use client';

import Link from 'next/link';

import { ProjectType } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(relativeTime);

const getLatestDate = (environments: ProjectType['environments']) => {
  return environments
    .map(env => env.updated)
    .filter(date => date != null)
    .sort()
    .pop();
};

const ProjectsTableColumns: DataTableColumnDef<ProjectType>[] = [
  {
    id: 'project_name',
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
          Project
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },

    cell: ({ row }) => {
      const projectName = row.original.name;
      return (
        <div>
          <Link className="text-inherit hover:!underline transition-all" href={`/projects/${projectName}`}>
            {projectName}
          </Link>
        </div>
      );
    },
  },

  {
    id: 'last_deployment',
    width: '15%',
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
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
          Last Deploy
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
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
    id: 'production_route',
    header: 'Production Route',
    width: '30%',
    accessorFn: project => {
      const prodRoute = project.environments?.find(env => env.name === project.productionEnvironment)?.route;
      return prodRoute && prodRoute !== 'undefined' ? prodRoute.replace(/^https?:\/\//i, '') : '';
    },
    cell: ({ row }) => {
      const project = row.original;
      const prodRoute = project.environments?.find(env => env.name === project.productionEnvironment)?.route;

      return <>{prodRoute && prodRoute !== 'undefined' ? prodRoute.replace(/^https?:\/\//i, '') : ''}</>;
    },
  },

  {
    accessorKey: 'gitUrl',
    header: 'Git Repository URL',
  },
];

export default ProjectsTableColumns;
