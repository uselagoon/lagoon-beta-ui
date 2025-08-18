import Link from 'next/link';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { FolderCog } from 'lucide-react';

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
        <Button variant="ghost" className="px-1" onClick={() => handleSort(sortDirection, column)}>
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
          <Button>
            <Link
              target="_blank"
              href={`/projects/${row.original.name}`}
            >
              <Tooltip>
                <TooltipTrigger>
                  <FolderCog className="h-6 w-6 mt-1" />
                </TooltipTrigger>
                <TooltipContent>View Project Dashboard</TooltipContent>
              </Tooltip>
            </Link>
          </Button>
          {unlink(row.original)}
        </div>
      );
    },
  },
];
