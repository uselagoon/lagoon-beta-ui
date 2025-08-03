import { FC, startTransition } from 'react';

import addProjectToGroup from '@/lib/mutation/organizations/addProjectToGroup';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

type Props = {
  groupName: string;
  projects: {
    id: number;
    name: string;
  }[];
  refetch?: () => void;
};

/**
 * Add project to group modal
 */

export const AddProjectToGroup: FC<Props> = ({ groupName, projects, refetch }) => {
  const [addProjectToGroupMutation, { error, loading }] = useMutation(addProjectToGroup, {
    refetchQueries: ['getOrganization'],
  });

  const projectOptions = projects.map(p => {
    return { label: p.name, value: p.name };
  });

  const handleAddProject = async (projectName: string) => {
    try {
      await addProjectToGroupMutation({
        variables: {
          projectName,
          groupName,
        },
      });
      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problem adding a project', {
        id: 'add_project_error',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <>
      <Sheet
        data-cy="add-project"
        sheetTrigger="Add project"
        sheetTitle={`Add project to ${groupName}`}
        sheetFooterButton="Add"
        loading={loading}
        error={!!error}
        additionalContent={null}
        sheetFields={[
          {
            id: 'project_name',
            label: 'Project',
            required: true,
            placeholder: 'Select a project to add to the group',
            type: 'select',
            options: projectOptions,
          },
        ]}
        buttonAction={(_, { project_name }) => {
          handleAddProject(project_name);
        }}
      />
    </>
  );
};
