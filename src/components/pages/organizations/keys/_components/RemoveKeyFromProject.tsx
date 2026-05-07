import React from 'react';

import { OrganizationKey } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/keys/page';
import removeOrganizationKeyFromProject from '@/lib/mutation/organizations/removeOrganizationKeyFromProject';
import { useMutation } from '@apollo/client';
import { Unlink } from 'lucide-react';
import { Sheet } from '@/ui-library';
import { toast } from 'sonner';

type RemoveKeyFromProjectProps = {
  orgKey: OrganizationKey;
  refetch: () => void;
};

export const RemoveKeyFromProject: React.FC<RemoveKeyFromProjectProps> = ({ orgKey, refetch }) => {
  const { id, name, projects } = orgKey;

  const [removeKeyFromProjectMutation, { error, loading }] = useMutation(removeOrganizationKeyFromProject, {
    refetchQueries: ['getOrganization'],
    onCompleted: () => {
      toast.success('Key removed from project successfully!');
      refetch();
    },
  });

  const handleRemove = async (_e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { project } = values;
      await removeKeyFromProjectMutation({
        variables: {
          id,
          project,
        },
      });
    } catch (err) {
      console.error('Error removing key from project:', err);
      return false;
    }
  };

  const projectOptions = (projects ?? []).map(p => ({ label: p.name, value: p.name }));
  const hasProjects = projectOptions.length > 0;

  return (
    <Sheet
      disabled={!hasProjects}
      sheetTrigger={<Unlink className="h-5 w-5" />}
      sheetTitle={`Remove key "${name}" from a project`}
      sheetDescription="Select a project to remove this key from."
      sheetFooterButton="Confirm"
      loading={loading}
      error={!!error}
      buttonAction={handleRemove}
      additionalContent={
        error ? (
          <div className="text-red-500 p-3 border border-red-300 rounded-md mt-2 bg-red-50">
            <strong>Error:</strong> {error.message}
          </div>
        ) : null
      }
      sheetFields={[
        {
          id: 'project',
          label: 'Project',
          required: true,
          placeholder: projectOptions.length > 0 ? 'Select a project' : 'No projects assigned',
          type: 'select',
          options: projectOptions,
        },
      ]}
    />
  );
};
