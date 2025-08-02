import { FC } from 'react';

import AddProjectSheet from '@/components/createProject/_components/AddProjectSheet';

interface Props {
  organizationId: number;
  options: {
    label: string;
    value: number;
  }[];
  variant?: 'default' | 'small';
  refetch?: () => void;
}
export const CreateProject: FC<Props> = ({ organizationId, options, refetch, variant = 'default' }) => {
  return (
    <>
      <div className="flex gap-2 items-center">
        <span className="text mr-4">Create a new project</span>
        <AddProjectSheet organizationId={organizationId} deployTargetOptions={options} />
      </div>
    </>
  );
};
