'use client';

import Link from 'next/link';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import { SquareTerminal } from 'lucide-react';

export const ProjectsDataTableColumns = (
  deleteProjectModal: (project: OrgProject) => React.ReactNode,
  orgName: string
): DataTableColumnDef<OrgProject>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name } = row.original;

      return (
        <Link className="hover:text-blue-800 transition-colors" href={`/organizations/${orgName}/projects/${name}`}>
          {name}
        </Link>
      );
    },
  },
  {
    accessorKey: 'groupCount',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Group count
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const groupCount = row.original.groupCount;
      return <div className="ml-6">{groupCount || 0}</div>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <div className="flex gap-4 justify-end items-center">
          <Link
            className="hover:text-blue-800 transition-colors"
            target="_blank"
            href={`/projects/${row.original.name}`}
          >
            <Tooltip>
              <TooltipTrigger>
                <SquareTerminal className="ml-2 h-6 w-6" />
              </TooltipTrigger>
              <TooltipContent>View Project</TooltipContent>
            </Tooltip>
          </Link>
          {deleteProjectModal(row.original)}
        </div>
      );
    },
  },
];
