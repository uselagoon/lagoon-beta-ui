import { EnvironmentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/(environment-overview)/page';
import DeleteConfirm from '@/components/deleteConfirm/DeleteConfirm';
import deleteEnvironment from '@/lib/mutation/deleteEnvironment';
import { useMutation } from '@apollo/client';

export const DeleteAction = ({
  environment,
  refetch,
}: {
  environment: Pick<EnvironmentData['environment'], 'title' | 'name' | 'project'>;
  refetch?: () => void;
}) => {
  const [deleteEnvironmentMutation, { data, loading: deleteLoading }] = useMutation(deleteEnvironment);

  return (
    <td>
      <DeleteConfirm
        buttonText="Delete"
        deleteType="environment"
        deleteName={environment.title}
        loading={deleteLoading}
        data={data}
        action={() =>
          deleteEnvironmentMutation({
            variables: {
              input: {
                name: environment.title,
                project: environment.project.name,
              },
            },
          }).then(() => refetch?.())
        }
      />
    </td>
  );
};
