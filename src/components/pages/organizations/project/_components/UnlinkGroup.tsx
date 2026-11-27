import DeleteNoConfirm from '@/components/deleteNoConfirm/DeleteNoConfirm';
import removeGroupFromProject from '@/lib/mutation/organizations/removeGroupFromProject';
import { useMutation } from '@apollo/client';

type Group = {
  id: string;
  memberCount?: number;
  name: string;
  type: 'null' | 'project-default-group';
};

type UnlinkGroupModalProps = {
  group: Group;
  projectName: string;
  refetch: () => void;
  disabled?: boolean;
};

export const UnlinkGroup: React.FC<UnlinkGroupModalProps> = ({ group, projectName, refetch, disabled }) => {
  const { name } = group;

  const [unlinkGroup, { loading }] = useMutation(removeGroupFromProject, {
    variables: {
      groupName: name,
      projectName: projectName,
    },
  });

  return (
    <DeleteNoConfirm
      deleteType="unlink"
      deleteItemType="group"
      title="Unlink group ?"
      loading={loading}
      disabled={disabled}
      deleteMessage={
        <>
          <p>
            This action will unlink group <span className="highlight">{name}</span> from project{' '}
            <span className="highlight">{projectName}</span>.
          </p>
        </>
      }
      action={() => unlinkGroup()}
      refetch={refetch}
    />
  );
};
