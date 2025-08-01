'use client';

import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { DataTableColumnDef, Button, cn } from '@uselagoon/ui-library';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

export const ProjectsDataTableColumns = (deleteProjectModal: (project: OrgProject) => React.ReactNode): DataTableColumnDef<OrgProject>[] => [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Name
          <div className="flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'groupCount',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Groups
          <div className="flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
        </Button>
      );
    },
    cell: ({ row }) => {
        const groupCount = row.original.groupCount;
        return (
            <div className="ml-6">
                {groupCount || 0}
            </div>
        );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
        return <div className="text-right mx-4">{deleteProjectModal(row.original)}</div>;
    },
  },
];