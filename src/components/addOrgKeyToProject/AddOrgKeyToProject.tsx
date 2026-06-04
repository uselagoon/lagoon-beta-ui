import { FC, startTransition } from 'react';

import addOrganizationKeyToProject from '@/lib/mutation/organizations/addOrganizationKeyToProject';
import { OrgProject } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import { ApolloError, useMutation } from '@apollo/client';
import { Key } from 'lucide-react';
import { Sheet } from '@/ui-library';
import { toast } from 'sonner';

type Props = {
  keyId: number;
  keyName?: string;
  projects: OrgProject[];
  disabled?: boolean;
  refetch?: () => void;
};

/**
 * Add organization key to project sheet.
 */
export const AddOrganizationKeyToProject: FC<Props> = ({ keyId, keyName, projects, disabled = false, refetch }) => {
  const [addOrganizationKeyToProjectMutation, { error, loading }] = useMutation(addOrganizationKeyToProject, {
    refetchQueries: ['getOrganization'],
  });

  const handleAddKeyToProject = async (_e: React.MouseEvent<HTMLButtonElement>, values: any) => {
    try {
      const { project } = values;
      await addOrganizationKeyToProjectMutation({
        variables: {
          id: keyId,
          project,
        },
      });
      toast.success(`Key added to project ${project} successfully!`);
      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error(`There was a problem adding key to project.`, {
        id: 'project_key_error',
        description: (err as ApolloError).message,
      });
      return false;
    }
  };

  const projectOptions = projects
    .filter(proj => !proj.clone || (proj.clone.status !== 'FAILED' && proj.clone.status !== 'CANCELLED'))
    .map(proj => ({ label: proj.name, value: proj.name }));

  return (
    <Sheet
      disabled={disabled || projectOptions.length === 0}
      sheetTrigger={<Key className="h-5 w-5" />}
      sheetTitle={keyName ? `Add key "${keyName}" to a project` : 'Add key to a project'}
      sheetDescription="Select a project to assign this key to."
      sheetFooterButton="Confirm"
      loading={loading}
      error={!!error}
      buttonAction={handleAddKeyToProject}
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
          placeholder: 'Select a project',
          type: 'select',
          options: projectOptions,
        },
      ]}
    />
  );
};
