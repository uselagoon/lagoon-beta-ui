'use client';

import Link from 'next/link';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef, cn } from '@uselagoon/ui-library';

import { RemoveUser } from './_components/RemoveUser';

type User = OrganizationUsersData['users'][0];

const UsersDataTableColumns = (
  orgId: number,
  organizationSlug: string,
  refetch?: () => void
): DataTableColumnDef<User>[] => [
  {
    accessorKey: 'firstName',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          First Name
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
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
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { firstName, lastName, email } = row.original;
      const isDefaultUser = !firstName && !lastName && email.startsWith('default-user');

      return isDefaultUser ? <Badge>DEFAULT USER</Badge> : lastName;
    },
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      const sortDirection = column.getIsSorted();
      return (
        <Button variant="ghost" onClick={() => handleSort(sortDirection, column)}>
          Email
          <div className="flex flex-col">{renderSortIcons(sortDirection)}</div>
        </Button>
      );
    },
    cell: ({ row }) => {
      const { email } = row.original;
      return (
        <Link
          className="hover:text-blue-800 transition-colors"
          href={`/organizations/${organizationSlug}/users/${email}`}
        >
          {email}
        </Link>
      );
    },
  },
  {
    accessorKey: 'groupRoles',
    header: 'Roles',
    cell: ({ row }) => {
      const groupRoles = row.original.groupRoles;

      return (
        <div className="flex flex-col gap-2">
          {[...new Set(groupRoles.map(group => group.role))].map(uniqueRole => (
            <Badge key={uniqueRole}>{uniqueRole}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <RemoveUser user={user} orgId={orgId!} refetch={refetch!} />
        </div>
      );
    },
  },
];

export default UsersDataTableColumns;
