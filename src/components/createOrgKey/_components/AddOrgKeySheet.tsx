import React from 'react';

import addOrganizationKey from '@/lib/mutation/organizations/addOrganizationKey';
import { useMutation } from '@apollo/client';
import { Sheet } from '@/ui-library';
import { toast } from 'sonner';

const AddOrgKeySheet = ({
  organizationName,
}: {
  organizationName: string;
}) => {
  const [addKeyMutation, { error, loading }] = useMutation(addOrganizationKey, {
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('Key created successfully!');
    },
  });

  const handleAddKey = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { keyName, keyComment } = values;

      await addKeyMutation({
        variables: {
          organization: organizationName,
          name: keyName,
          comment: keyComment,
        },
      });
    } catch (err) {
      console.error('Error creating key:', err);
      return false;
    }
  };

  const keyErrorContent = (
    <>
      {error && (
        <div className="text-red-500 p-3 border border-red-300 rounded-md mt-2 bg-red-50">
          <strong>Error creating key:</strong> {error.message}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <Sheet
        sheetTrigger="Create Key"
        sheetTitle="Create an organization key"
        sheetDescription="Enter the key details below"
        sheetFooterButton="Create Key"
        loading={loading}
        error={!!error}
        buttonAction={handleAddKey}
        additionalContent={keyErrorContent}
        sheetFields={[
          {
            id: 'keyName',
            label: 'Key name',
            type: 'text',
            placeholder: 'Enter name',
            required: true,
          },
          {
            id: 'keyComment',
            label: 'Comment',
            type: 'textarea',
            placeholder: 'Add an optional comment about this key',
            required: false,
          }
        ]}
      />
    </div>
  );
};

export default AddOrgKeySheet;
