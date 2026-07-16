import { FC } from 'react';

import AddOrgKeySheet from '@/components/createOrgKey/_components/AddOrgKeySheet';

interface Props {
  organizationName: string;
  variant?: 'default' | 'small';
  refetch?: () => void;
}
export const CreateOrgKey: FC<Props> = ({ organizationName, variant = 'default', refetch }) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <span className="text mr-4">Create a new key</span>
        <AddOrgKeySheet organizationName={organizationName} />
      </div>
    </>
  );
};
