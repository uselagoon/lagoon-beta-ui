import { FC, startTransition } from 'react';

import addGroupMember from '@/lib/mutation/organizations/addGroupMember';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

import { orgUserRoleOptions } from '../shared/selectOptions';

type Props = {
  groupName: string;
  refetch?: () => void;
};

/**
 * Add user modal for organization groups/group;
 */

export const AddUserToGroup: FC<Props> = ({ groupName, refetch }) => {
  const [addGroupMemberMutation, { error, loading }] = useMutation(addGroupMember, {
    refetchQueries: ['getOrganization'],
  });

  const handleAddUser = async (email: string, role: string, inviteUser: boolean) => {
    try {
      await addGroupMemberMutation({
        variables: {
          email,
          role,
          group: groupName,
          inviteUser,
        },
      });
      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error(`There was a problem adding a user to group ${groupName}.`, {
        id: 'group_error',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <>
      <Sheet
        data-cy="add-user"
        sheetTrigger="Add user"
        sheetTitle={`Add user to ${groupName}`}
        sheetFooterButton="Confirm"
        loading={loading}
        error={!!error}
        additionalContent={
          <>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
              <p className="text-blue-800">
                <strong>Note:</strong> This will invite the user to Lagoon if the user doesn't exist. If the user
                already exists, it will just skip the invite.
              </p>
            </div>
          </>
        }
        sheetFields={[
          {
            id: 'user_email',
            label: 'New user email',
            required: true,
            placeholder: 'Enter email',
            type: 'input',
          },
          {
            id: 'user_role',
            label: 'Role',
            required: true,
            placeholder: 'Add a role for this user',
            type: 'select',
            options: orgUserRoleOptions,
          },
          {
            id: 'invite_user',
            label: 'Invite user to Lagoon',
            placeholder: 'Add a role for this user',
            type: 'checkbox',
          },
        ]}
        buttonAction={(_, { user_email, user_role, invite_user }) => {
          handleAddUser(user_email, user_role, invite_user);
        }}
      />
    </>
  );
};
