import { ReactNode } from 'react';

import Link from 'next/link';

import { handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef } from '@uselagoon/ui-library';

import { UserGroup } from './UnlinkGroup';

export const UserDataTableColumns = (
  unlink: (group: UserGroup) => ReactNode,
  edit: (group: UserGroup) => ReactNode,
  organizationSlug: string
): DataTableColumnDef<UserGroup>[] => [
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
      const { name, groupType } = row.original;

      const isDefaultGroup = groupType === 'project-default-group';

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
    accessorKey: 'groupRoles',
    header: 'Role',
    cell: ({ row }) => {
      const { role } = row.original;

      return (
        <div className="flex flex-col gap-2">
          <Badge>{role}</Badge>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const group = row.original;
      const isDefaultGroup = group.groupType === 'project-default-group';
      return (
        <div className="flex items-center gap-2">
          {edit(group)}
          {!isDefaultGroup && unlink(group)}
        </div>
      );
    },
  },
];
