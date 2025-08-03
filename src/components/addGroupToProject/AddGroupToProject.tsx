import { FC, startTransition } from 'react';

import addProjectToGroup from '@/lib/mutation/organizations/addProjectToGroup';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

type Props = {
  projectName: string;
  groups: {
    id: string;
    name: string;
  }[];
  refetch?: () => void;
};

/**
 * Link group to project modal
 */

export const AddGroupToProject: FC<Props> = ({ projectName, groups, refetch }) => {
  const [addGroup, { error, loading }] = useMutation(addProjectToGroup, {
    refetchQueries: ['getOrganization'],
  });

  const groupOptions = groups.map(g => {
    return { label: g.name, value: g.name };
  });

  const handleAddGroup = async (groupName: string) => {
    try {
      await addGroup({
        variables: {
          projectName,
          groupName,
        },
      });
      startTransition(() => {
        (refetch ?? (() => {}))();
      });
    } catch (err) {
      console.error(err);

      toast.error('There was a problem linking a group.', {
        id: 'link_group',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <Sheet
      data-cy="add-group"
      sheetTrigger="Link Group"
      sheetTitle={`Link group to ${projectName}`}
      sheetFooterButton="Link"
      loading={loading}
      error={!error}
      additionalContent={null}
      sheetFields={[
        {
          id: 'group_name',
          label: 'Group',
          required: true,
          placeholder: 'Select a notification to link',
          type: 'select',
          options: groupOptions,
        },
      ]}
      buttonAction={(_, { group_name }) => {
        handleAddGroup(group_name);
      }}
    />
  );
};
