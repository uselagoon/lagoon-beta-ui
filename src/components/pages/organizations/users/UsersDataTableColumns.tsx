'use client';

import { DataTableColumnDef, Button, cn } from '@uselagoon/ui-library';
import { ChevronDown, ChevronUp } from 'lucide-react';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';

type User = OrganizationUsersData['users'][0];

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

const UsersDataTableColumns: DataTableColumnDef<User>[] = [
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          First Name
          <div className="ml-1 flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'lastName',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Last Name
          <div className="ml-1 flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Email
          <div className="ml-1 flex flex-col">
            <ChevronUp className={cn('h-1 w-1 transition-colors', sortDirection === 'asc' ? 'text-blue-600' : 'text-gray-400')} />
            <ChevronDown className={cn('h-1 w-1 transition-colors', sortDirection === 'desc' ? 'text-blue-600' : 'text-gray-400')} />
          </div>
        </Button>
      );
    },
  },
  {
    accessorKey: 'groupRoles',
    header: 'Roles',
    cell: ({ row }) => {
      const groupRoles = row.original.groupRoles;
      return <div>{groupRoles.map(groupRole => groupRole.role).join(', ')}</div>;
    },
  },
];

export default UsersDataTableColumns;
