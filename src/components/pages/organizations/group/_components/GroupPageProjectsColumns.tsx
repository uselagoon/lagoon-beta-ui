import Link from 'next/link';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { SquareTerminal } from 'lucide-react';

export const GroupPageProjectColumns = (
  unlink: (project: OrgProject) => React.ReactNode,
  orgName: string
): DataTableColumnDef<OrgProject>[] => [
  {
    accessorKey: 'name',
    width: '80%',
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
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return (
        <div className="flex gap-4 justify-start items-center">
          <Link
            className="hover:text-blue-800 transition-colors"
            target="_blank"
            href={`/projects/${row.original.name}`}
          >
            <Tooltip>
              <TooltipTrigger>
                <SquareTerminal className="ml-2 h-6 w-6" />
              </TooltipTrigger>
              <TooltipContent>View Project Dashboard</TooltipContent>
            </Tooltip>
          </Link>
          {unlink(row.original)}
        </div>
      );
    },
  },
];
