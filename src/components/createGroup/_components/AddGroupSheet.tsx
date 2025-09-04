import React from 'react';

import addGroupToOrganization from '@/lib/mutation/organizations/addGroupToOrganization';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import {toast} from "sonner";

const AddGroupSheet = ({
  organizationId,
  existingGroupNames = [],
}: {
  organizationId: number;
  existingGroupNames?: string[];
}) => {
  const [addGroupMutation, { error, loading }] = useMutation(addGroupToOrganization, {
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('Group added successfully!');
    },
  });

  const handleAddGroup = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { groupName } = values;

      await addGroupMutation({
        variables: {
          group: groupName,
          organization: organizationId,
        },
      });

    } catch (err) {
      console.error('Error adding group:', err);
      return false;
    }
  };

  const groupErrorContent = (
    <>
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
        <p className="text-yellow-800">
          <strong>Note:</strong> Only lowercase alpha characters and "-" are available for group names.
        </p>
      </div>
      {error && (
        <div className="text-red-500 p-3 border border-red-300 rounded-md mt-2 bg-red-50">
          <strong>Error creating group:</strong> {error.message}
        </div>
      )}
    </>
  )

  return (
    <div className="space-y-4">
      <Sheet
        sheetTrigger="Add Group"
        sheetTitle="Add a group"
        sheetDescription="Enter the group details below"
        sheetFooterButton="Create Group"
        loading={loading}
        error={!!error}
        buttonAction={handleAddGroup}
        additionalContent={groupErrorContent}
        sheetFields={[
          {
            id: 'groupName',
            label: 'Group name',
            type: 'text',
            placeholder: 'Enter name',
            required: true,
            validate: (value) => {
              const groupName= value as string;
              const allowedChars = /^[a-z0-9-]*$/;

              if (!groupName || groupName === '' || !allowedChars.test(groupName)) {
                return "Invalid group name"
              }

              if (existingGroupNames.includes(groupName)) {
                return "Group name already exists"
              }

              return null

            }
          },
        ]}
      />
    </div>
  );
};

export default AddGroupSheet;
