import { FC, startTransition } from 'react';

import addGroupMember from '@/lib/mutation/organizations/addGroupMember';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

import { orgUserRoleOptions } from '../shared/selectOptions';

type Props = {
  groupName: string;
  email: string;
  currentRole: string;
  refetch?: () => void;
};

/**
 * Edit user role sheet for organization group / user;
 */

export const EditUserRole: FC<Props> = ({ groupName, email, currentRole, refetch }) => {
  const [updateUser, { error, loading }] = useMutation(addGroupMember, {
    refetchQueries: ['getOrganization'],
  });

  const handleEditUser = async (role: string) => {
    try {
      await updateUser({
        variables: {
          email,
          role,
          group: groupName,
        },
      });
      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problemc hanging user role.', {
        id: 'role_change_err',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <>
      <Sheet
        data-cy="edit-user-role"
        sheetTrigger={
          <Tooltip>
            <TooltipTrigger aria-label="edit-role">
              <Edit2Icon />
            </TooltipTrigger>
            <TooltipContent>Edit Role</TooltipContent>
          </Tooltip>
        }
        sheetTitle={`Edit role for ${email}`}
        sheetFooterButton="Confirm"
        loading={loading}
        error={!!error}
        additionalContent={null}
        sheetFields={[
          {
            id: 'user_role',
            label: 'Role',
            required: true,
            placeholder: 'Add a role for this user',
            type: 'select',
            options: orgUserRoleOptions,
          },
        ]}
        buttonAction={(_, { user_role }) => {
          handleEditUser(user_role);
        }}
      />
    </>
  );
};
