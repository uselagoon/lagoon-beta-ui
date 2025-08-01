import { ColumnDef } from '@tanstack/react-table';

import { DeleteUser } from './DeleteUser';
import { EditUser } from './EditUser';

export type OrgOwner = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  owner: true | null;
  admin: true | null;
  groupRoles: null | { id: string }[];
};

const getUserRole = (user: OrgOwner): string => {
  if (user.owner) return 'owner';
  if (user.admin) return 'admin';
  return 'viewer';
};

export const createManageDataTableColumns = (
  orgId: number,
  orgName: string,
  owners: OrgOwner[],
  refetch: () => void
): ColumnDef<OrgOwner>[] => [
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => <span>{row.getValue('firstName') || ''}</span>,
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => <span>{row.getValue('lastName') || ''}</span>,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span>{row.getValue('email')}</span>,
  },
  {
    id: 'role',
    header: 'Role',
    cell: ({ row }) => {
      const user = row.original;
      const role = getUserRole(user);
      return (
        <span className="capitalize">
          {role}
        </span>
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
          <EditUser user={user} orgId={orgId} refetch={refetch} />
          <DeleteUser user={user} orgId={orgId} orgName={orgName} refetch={refetch} />
        </div>
      );
    },
  },
];
