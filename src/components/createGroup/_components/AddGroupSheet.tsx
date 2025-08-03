import React from 'react';

import addGroupToOrganization from '@/lib/mutation/organizations/addGroupToOrganization';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';

const AddGroupSheet = ({
  organizationId,
  existingGroupNames = [],
}: {
  organizationId: number;
  existingGroupNames?: string[];
}) => {
  const [addGroupMutation, { error, loading }] = useMutation(addGroupToOrganization, {
    refetchQueries: ['getOrganization'],
  });

  const handleAddGroup = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { groupName } = values;
      const allowedChars = /^[a-z0-9-]*$/;

      if (!groupName || groupName === '' || !allowedChars.test(groupName)) {
        console.error('Invalid group name');
        return false;
      }

      if (existingGroupNames.includes(groupName)) {
        console.error('Group name already exists');
        return false;
      }

      await addGroupMutation({
        variables: {
          group: groupName,
          organization: organizationId,
        },
      });

      return true;
    } catch (err) {
      console.error('Error adding group:', err);
      return false;
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 p-3 border border-red-300 rounded-md bg-red-50">
          <strong>Error creating group:</strong> {error.message}
        </div>
      )}

      <Sheet
        sheetTrigger="Add Group"
        sheetTitle="Add a group"
        sheetDescription="Enter the group details below"
        sheetFooterButton="Create Group"
        loading={loading}
        // hasError={!!error}
        buttonAction={handleAddGroup}
        sheetFields={[
          {
            id: 'groupName',
            label: 'Group name',
            type: 'text',
            placeholder: 'Enter name',
            required: true,
          },
        ]}
        additionalContent={
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
            <p className="text-yellow-800">
              <strong>Note:</strong> Only lowercase alpha characters and "-" are available for group names.
            </p>
          </div>
        }
      />
    </div>
  );
};

export default AddGroupSheet;
