import { FC, startTransition } from 'react';

import addUserToOrganization from '@/lib/mutation/organizations/addUserToOrganization';
import { useMutation } from '@apollo/client';
import { Sheet, Button } from '@uselagoon/ui-library';
import { toast } from 'sonner';

import { adminRoleSelect } from './filterOptions';

type Props = {
  orgId: number;
  owners: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    admin: true | null;
    owner: true | null;
    groupRoles:
      | {
          id: string;
        }[]
      | null;
  }[];
  refetch?: () => void;
};

/**
 * Add user modal for organization administrators;
 */

export const AddUser: FC<Props> = ({ orgId, refetch, owners }) => {
  const [addAdministrator, { loading }] = useMutation(addUserToOrganization, {
    refetchQueries: ['getOrganization'],
    onError: err => {
      console.error(err);
      toast.error('Error adding user', {
        description: err.message,
      });
    },
  });

  const handleAddUser = (email: string, role: string) => {
    const existingUser = owners.find(o => o.email === email);
    if (existingUser) {
      toast.error('User already exists', {
        description: 'This user is already an administrator in this organization.',
      });
      return Promise.reject('User already exists');
    }

    return addAdministrator({
      variables: {
        email,
        organization: orgId,
        ...(role === 'admin' && { admin: true }),
        ...(role === 'owner' && { owner: true }),
        ...(role === 'viewer' && { admin: false, owner: false }),
      },
    }).then(() => {
      startTransition(() => {
        refetch?.();
      });
      toast.success('User added successfully!');
    });
  };

  return (
    <Sheet
      data-cy="add-user"
      sheetTrigger="Add user"
      sheetTitle="Add Administrator"
      sheetFooterButton="Add"
      sheetDescription="Add a new administrator to this organization"
      loading={loading}
      error={false}
      additionalContent={null}
      sheetFields={[
        {
          id: 'email',
          label: 'User Email',
          type: 'text',
          placeholder: 'Enter email address',
          required: true,
        },
        {
          id: 'role',
          label: 'Role',
          type: 'select',
          placeholder: 'Select a role',
          required: true,
          options: adminRoleSelect,
        },
      ]}
      buttonAction={(_, values) => {
        const { email, role } = values;
        return handleAddUser(email, role);
      }}
    />
  );
};
