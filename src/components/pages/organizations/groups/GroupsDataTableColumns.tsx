'use client';

import Link from 'next/link';

import { OrgGroup } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import { AddUser } from '@/components/addUserToOrg/Adduser';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';

import { DeleteGroup } from './_components/DeleteGroup';

export const GroupsDataTableColumns = (
  organizationSlug?: string,
  refetch?: () => void
): DataTableColumnDef<OrgGroup>[] => [
  {
    accessorKey: 'name',
    sortingFn: (rowA, rowB, columnId) => {
      const a = rowA.getValue(columnId) as string;
      const b = rowB.getValue(columnId) as string;
      return a.localeCompare(b);
    },
    width: '60%',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Group Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { name, type } = row.original;
      const isDefaultGroup = type === 'project-default-group';

      return (
        <div className="max-w-[25vw] flex gap-4">
          <Link
            className="hover:text-blue-800 transition-colors"
            href={`/organizations/${organizationSlug}/groups/${name}`}
          >
            {name}
          </Link>
          {isDefaultGroup && <Badge>SYSTEM</Badge>}
        </div>
      );
    },
  },
  {
    accessorKey: 'memberCount',
    sortingFn: (rowA, rowB, columnId) => {
      const a = (rowA.getValue(columnId) as number) || 0;
      const b = (rowB.getValue(columnId) as number) || 0;
      return a - b;
    },
    width: '20%',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();

      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Members
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const memberCount = row.original.memberCount ?? 0;
      return <div className="max-w-[25vw]">{memberCount}</div>;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    width: '20%',
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
          <DeleteGroup group={group} refetch={refetch!} />
        </div>
      );
    },
  },
];

export default GroupsDataTableColumns;
