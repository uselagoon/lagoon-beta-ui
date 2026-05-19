import React from 'react';

import updateOrganizationKey from '@/lib/mutation/organizations/updateOrganizationKey';
import { OrganizationKey } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import Sheet from '@/ui-library/components/Sheet/Sheet';
import { Pencil } from 'lucide-react';

type UpdateKeyProps = {
  orgKey: OrganizationKey;
  refetch: () => void;
};

export const UpdateKey: React.FC<UpdateKeyProps> = ({ orgKey, refetch }) => {
  const { id } = orgKey;
  const [updateKeyMutation, { error, loading }] = useMutation(updateOrganizationKey, {
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('Key updated successfully!');
    },
  });
  
  const handleUpdateKey = async (e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    const { comment } = values;
    updateKeyMutation({
      variables: {
        id,
        comment,
      },
    });
  };

  const keyErrorContent = (
    <>
      {error && (
        <div className="text-red-500 p-3 border border-red-300 rounded-md mt-2 bg-red-50">
          <strong>Error updating key:</strong> {error.message}
        </div>
      )}
    </>
  );

  return (
    <div className="space-y-4">
      <Sheet
        sheetTrigger={<Pencil className="h-5 w-5" aria-label="edit-route" />}
        sheetTitle="Update an organization key"
        sheetDescription="Enter the key details below"
        sheetFooterButton="Update Key"
        loading={loading}
        error={!!error}
        buttonAction={handleUpdateKey}
        additionalContent={keyErrorContent}
        sheetFields={[
          {
            id: 'comment',
            label: 'Comment',
            type: 'text',
            placeholder: 'Update comment',
            inputDefault: orgKey.comment || '',
          },
        ]}
      />
    </div>
  );
};
