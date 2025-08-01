import React from 'react';
import { Sheet } from "@uselagoon/ui-library";
import { useMutation } from '@apollo/client';
import addGroupMember from '@/lib/mutation/organizations/addGroupMember';
import { UserRoundPlus } from 'lucide-react';

const AddUserSheet = ({
                          groupSelectOptions = [],
                          orgUserRoleOptions = [],
                          iconOnly = false,
                          type = 'single',
                      }: {
    groupSelectOptions: Array<{ label: string; value: string | number }>;
    orgUserRoleOptions: Array<{ label: string; value: string | number }>;
    iconOnly?: boolean;
    type?: 'single' | 'multiple';
}) => {
    const [addGroupMemberMutation, { error, loading }] = useMutation(addGroupMember, {
        refetchQueries: ['getOrganization'],
    });
    const handleAddUser = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
        try {
            const { email, group, role, inviteUser } = values;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                console.error('Invalid email');
                return false;
            }

            await addGroupMemberMutation({
                variables: {
                    email: email,
                    group: group,
                    role: role,
                    inviteUser: inviteUser,
                },
            });

            return true;
        } catch (err) {
            console.error('Error adding user:', err);
            return false;
        }
    };

    return (
        <div className="space-y-4">
            <Sheet
                sheetTrigger={iconOnly ? <UserRoundPlus className="h-5 w-5" /> : "Add User"}
                sheetTitle="Add users"
                sheetDescription="Enter the user details below"
                sheetFooterButton="Confirm"
                loading={loading}
                error={!!error}
                buttonAction={handleAddUser}
                sheetFields={[
                    {
                        id: 'email',
                        label: 'New user email',
                        type: 'email',
                        placeholder: 'Enter email',
                        required: true,
                    },
                    {
                        id: 'group',
                        label: 'Add to a Group',
                        type: type === 'single' ? 'input' : 'select',
                        placeholder: 'Select a group',
                        inputDefault: type === 'single' ? groupSelectOptions[0].value.toString() : undefined,
                        options: groupSelectOptions,
                        required: true,
                        readOnly: type === 'single',
                    },
                    {
                        id: 'role',
                        label: 'Add a role',
                        type: 'select',
                        placeholder: 'Add a role for this user',
                        options: orgUserRoleOptions,
                        required: true,
                    },
                    {
                        id: 'inviteUser',
                        label: 'Invite user to Lagoon',
                        type: 'checkbox',
                        inputDefault: "true",
                    },
                ]}
                additionalContent={
                  <>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-md text-sm">
                      <p className="text-blue-800">
                        <strong>Note:</strong> This will invite the user to Lagoon if the user doesn't exist.
                        If the user already exists, it will just skip the invite.
                      </p>
                    </div>
                    {error && (
                      <div className="text-red-500 p-3 border border-red-300 rounded-md bg-red-50">
                        <strong>Error adding user:</strong> {error.message}
                      </div>
                    )}
                  </>
                }
            />
        </div>
    );
};

export default AddUserSheet;