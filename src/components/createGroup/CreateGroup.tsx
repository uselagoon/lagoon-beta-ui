import { FC } from 'react';

import AddGroupSheet from "@/components/createGroup/_components/AddGroupSheet";

interface Props {
  organizationId: number;
  existingGroupNames: string[];
  variant?: 'default' | 'small';
  refetch?: () => void;
}
export const CreateGroup: FC<Props> = ({ organizationId, existingGroupNames, variant = 'default', refetch }) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <span className="text">Create a new group</span>
        <AddGroupSheet
            organizationId={organizationId}
            existingGroupNames={existingGroupNames}
        />
      </div>
    </>
  );
};
