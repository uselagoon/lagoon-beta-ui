import { FC, startTransition } from 'react';

import addUserToOrganization from '@/lib/mutation/organizations/addUserToOrganization';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { adminRoleSelect } from './filterOptions';

type Props = {
  orgId: number;
  user: {
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
  };
  refetch?: () => void;
};

/**
 * Edit user modal for organization administrators;
 */

export const EditUser: FC<Props> = ({ orgId, refetch, user }) => {
  const [addAdministrator, { loading }] = useMutation(addUserToOrganization, {
    refetchQueries: ['getOrganization'],
    onError: err => {
      console.error(err);
      toast.error('Error updating user role', {
        description: err.message,
      });
    },
  });

  const handleUpdateUser = (role: string) => {
    return addAdministrator({
      variables: {
        email: user.email,
        organization: orgId,
        ...(role === 'admin' && { admin: true }),
        ...(role === 'owner' && { owner: true }),
        ...(role === 'viewer' && { admin: false, owner: false }),
      },
    }).then(() => {
      startTransition(() => {
        refetch?.();
      });
      toast.success('User role updated successfully!');
    });
  };

  const getDefaultUserRole = () => {
    if (user.owner) {
      return 'owner';
    }
    if (user.admin) {
      return 'admin';
    }
    return 'viewer';
  };

  const initialRoleSelect = getDefaultUserRole();

  return (
    <Tooltip>
      <TooltipTrigger aria-label="edit-user">
        <Sheet
          data-cy="edit-user"
          sheetTrigger={<Edit2Icon />}
          sheetTitle="Update User Role"
          sheetFooterButton="Update"
          sheetDescription={`Update the role for ${user.firstName || ''} ${user.lastName || ''} (${user.email})`}
          loading={loading}
          error={false}
          additionalContent={null}
          sheetFields={[
            {
              id: 'role',
              label: 'Role',
              type: 'select',
              placeholder: 'Select a role',
              inputDefault: getDefaultUserRole(),
              required: true,
              options: adminRoleSelect,
            },
          ]}
          buttonAction={(_, values) => {
            const { role } = values;
            handleUpdateUser(role);
          }}
        />
      </TooltipTrigger>
      <TooltipContent>Edit User</TooltipContent>
    </Tooltip>
  );
};
