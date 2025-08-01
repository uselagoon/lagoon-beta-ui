'use client';

import Link from 'next/link';
import { Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger, cn } from '@uselagoon/ui-library';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { OrgGroup } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import { DeleteGroup } from './_components/DeleteGroup';
import { AddUser } from '@/components/addUserToOrg/Adduser';

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

const GroupsDataTableColumns = (organizationSlug: string, refetch: () => void): DataTableColumnDef<OrgGroup>[] => [
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
          Group Name
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
      const groupName = row.original.name;
      return (
        <div className="max-w-[25vw]">
          <Link 
            className="hover:text-blue-800 transition-colors" 
            href={`/organizations/${organizationSlug}/groups/${groupName}`}
          >
            {groupName}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'memberCount',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as number || 0;
      const b = rowB.getValue(columnId) as number || 0;
      return a - b;
    },
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Members
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
      const memberCount = row.original.memberCount ?? 0;
      return (
        <div className="max-w-[25vw]">
          {memberCount}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const group = row.original;
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger>
            <AddUser groupName={group.name} type="single" iconOnly />
            </TooltipTrigger>
            <TooltipContent>Add User to Group</TooltipContent>
          </Tooltip>
          <DeleteGroup group={group} refetch={refetch} />
        </div>
      );
    },
  },
];

export default GroupsDataTableColumns;
