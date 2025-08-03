import Link from 'next/link';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';
import { EditUserRole } from '@/components/editUserRole/EditUserRole';
import { handleSort, renderSortIcons } from '@/components/utils';
import { Badge, Button, DataTableColumnDef } from '@uselagoon/ui-library';

import { GroupMemberUser, UnlinkGroupMember } from './UnlinkGroupMember';

const GroupPageUsersColumns = (
  groupName?: string,
  orgName?: string,
  refetch?: () => void
): DataTableColumnDef<GroupMemberUser>[] => [
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
        <Link className="hover:text-blue-800 transition-colors" href={`/organizations/${orgName}/users/${email}`}>
          {email}
        </Link>
      );
    },
  },
  {
    id: 'groupRole',
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
      const user = row.original;
      return (
        <div className="flex items-center gap-2">
          <EditUserRole groupName={groupName!} currentRole={user.role} email={user.email} refetch={refetch} />
          <UnlinkGroupMember user={user} groupName={groupName!} refetch={refetch!} />
        </div>
      );
    },
  },
];

export default GroupPageUsersColumns;
