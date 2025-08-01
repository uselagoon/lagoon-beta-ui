import { FC, startTransition } from 'react';

import { EnvVariable } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import addOrUpdateEnvVariable from '@/lib/mutation/addOrUpdateEnvVariable';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

type Props = {
  currentEnv: EnvVariable;
  refetch: () => void;
} & (
  | {
      type: 'project';
      projectName: string;
    }
  | {
      type: 'environment';
      environmentName: string;
      projectName: string;
    }
  | {
      type: 'organization';
      orgName: string;
    }
);

const scopeOptions = [
  {
    label: 'Build',
    value: 'build',
  },
  {
    label: 'Runtime',
    value: 'runtime',
  },
  {
    label: 'Global',
    value: 'global',
  },
  {
    label: 'Container registry',
    value: 'container_registry',
  },
  {
    label: 'Internal container registry',
    value: 'internal_container_registry',
  },
];

export const EditVariable: FC<Props> = ({ currentEnv, refetch, type, ...rest }) => {
  let envName = '';
  let orgName = '';
  let projName = '';

  if (type === 'project') {
    projName = (rest as { projectName: string }).projectName;
  }

  if (type === 'environment') {
    envName = (rest as { environmentName: string }).environmentName;
    projName = (rest as { projectName: string }).projectName;
  }

  if (type === 'organization') {
    orgName = (rest as { orgName: string }).orgName;
  }

  const [editVariable, { loading }] = useMutation(addOrUpdateEnvVariable, {
    onError: err => {
      console.error(err);
      toast.error('Error updating variable', {
        description: err.message,
      });
    },
  });

  const editVariablefn = (name: string, scope: string, value: string) => {
    return editVariable({
      variables: {
        input: {
          ...(orgName ? { organization: orgName } : {}),
          ...(projName ? { project: projName } : {}),
          ...(envName ? { environment: envName } : {}),
          name,
          scope: scope.toUpperCase(),
          value,
        },
      },
    });
  };

  const handleUpdateVariable = (variable_name: string, variable_scope: string, variable_value: string) => {
    editVariablefn(variable_name, variable_scope, variable_value).then(() => {
      startTransition(async () => {
        await refetch();
      });
    });
  };

  return (
    <>
      <Sheet
        data-cy="add-variable"
        sheetTrigger={<Edit2Icon />}
        sheetTitle="Edit a variable"
        sheetFooterButton="Update"
        sheetDescription="Create a unique name for your variable. Then choose the scope of the variables availability. For more information see our documentation"
        loading={loading}
        error={false}
        additionalContent={null}
        sheetFields={[
          {
            id: 'variable_name',
            label: 'Variable name',
            placeholder: 'Enter a name for the variable',
            inputDefault: currentEnv.name,
            required: true,
            readOnly: true,
          },
          {
            id: 'variable_scope',
            label: 'Key Value',
            required: true,
            placeholder: 'Select variable scope',
            type: 'select',
            inputDefault: currentEnv.scope,
            options: scopeOptions,
          },

          {
            id: 'variable_value',
            label: 'Variable value',
            placeholder: 'Enter variable value',
            inputDefault: currentEnv.value,
            required: true,
          },
        ]}
        buttonAction={(_, { variable_name, variable_scope, variable_value }) => {
          handleUpdateVariable(variable_name, variable_scope, variable_value);
        }}
      />
    </>
  );
};
