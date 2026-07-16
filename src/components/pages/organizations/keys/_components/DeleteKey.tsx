import React from 'react';

import DeleteNoConfirm from '@/components/deleteNoConfirm/DeleteNoConfirm';
import deleteOrganizationKey from '@/lib/mutation/organizations/deleteOrganizationKey';
import { OrganizationKey } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';

type DeleteKeyProps = {
  orgKey: OrganizationKey;
  refetch: () => void;
};

export const DeleteKey: React.FC<DeleteKeyProps> = ({ orgKey, refetch }) => {
  const { id, name } = orgKey;
  const [deleteKeyMutation, { loading }] = useMutation(deleteOrganizationKey, {
    variables: {
      id,
    },
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('Key deleted successfully!');
    },
  });

  return (
    <DeleteNoConfirm
      deleteType="delete"
      deleteItemType="key"
      title="Delete key?"
      loading={loading}
      deleteMessage={
        <>
          <p>
            This action will delete key <span className="highlight">{name}</span> from this organization.
          </p>
        </>
      }
      action={() => deleteKeyMutation()}
      refetch={refetch}
    />
  );
};
