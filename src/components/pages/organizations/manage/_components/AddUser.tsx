import React, { FC, startTransition } from 'react';

import addUserToOrganization from '@/lib/mutation/organizations/addUserToOrganization';
import { useMutation } from '@apollo/client';
import { Button, Sheet } from '@uselagoon/ui-library';
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
  const [addAdministrator, { loading, error }] = useMutation(addUserToOrganization, {
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('User added successfully!');
    },
  });

  const handleAddUser = async (email: string, role: string) => {
    await addAdministrator({
      variables: {
        email,
        organization: orgId,
        ...(role === 'admin' && { admin: true }),
        ...(role === 'owner' && { owner: true }),
        ...(role === 'viewer' && { admin: false, owner: false }),
      },
    });
    startTransition(() => {
      refetch?.();
    });
  };

  return (
    <Sheet
      data-cy="add-user"
      sheetTrigger="Add user"
      sheetTitle="Add Administrator"
      sheetFooterButton="Add"
      sheetDescription="Add a new administrator to this organization, this user must already be a Lagoon user."
      loading={loading}
      error={!!error}
      additionalContent={
        <>
          {error && (
            <div className="text-red-500 p-3 mt-2 border border-red-300 rounded-md bg-red-50">
              <strong>Error adding user:</strong> {error.message}
            </div>
          )}
        </>
      }
      sheetFields={[
        {
          id: 'email',
          label: 'User Email',
          type: 'text',
          placeholder: 'Enter email address',
          required: true,
          validate: (value) => {
            const email = value as string;
            if (!email) return null;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
              return "Invalid email format";
            }

            const existingUser = owners.find(o => o.email === email);
            if (existingUser) {
              return "User already exists in this organization";
            }

            return null;
          }
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
