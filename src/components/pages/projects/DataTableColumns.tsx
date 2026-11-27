'use client';

import Link from 'next/link';

import { ProjectType } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef } from '@/ui-library';

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
        <Link className="text-inherit hover:!underline transition-all" href={`/projects/${projectName}`}>
          {projectName}
        </Link>
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
