import {FC, ReactNode, startTransition} from 'react';

import addOrUpdateEnvVariable from '@/lib/mutation/addOrUpdateEnvVariable';
import { useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

type Props = { onClick?: () => any; refetch: () => void; additionalContent?: ReactNode } & (
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
];

export const AddNewVariable: FC<Props> = ({ type, refetch, onClick, additionalContent = null, ...rest }) => {
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

  const [addVariable, { loading }] = useMutation(addOrUpdateEnvVariable, {
    onError: err => {
      console.error(err);
      toast.error('Error creating variable', {
        description: err.message,
      });
    },
  });

  const createVariable = (name: string, scope: string, value: string) => {
    return addVariable({
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

  const handleCreateVariable = (variable_name: string, variable_scope: string, variable_value: string) => {
    createVariable(variable_name, variable_scope, variable_value).then(() => {
      startTransition(async () => {
        await refetch();
      });
    });
  };

  return (
    <Sheet
      data-cy="add-variable"
      sheetTrigger={`Add ${type} variable`}
      sheetTitle={`Create a ${type} variable`}
      sheetFooterButton="Create"
      sheetDescription="Create a unique name for your variable. Then choose the scope of the variables availability. For more information see our documentation"
      loading={loading}
      error={false}
      additionalContent={additionalContent}
      sheetFields={[
        {
          id: 'variable_name',
          label: 'Variable name',
          placeholder: 'Enter a name for the variable',
          required: true,
        },
        {
          id: 'variable_scope',
          label: 'Variable scope',
          required: true,
          placeholder: 'Select variable scope',
          type: 'select',
          options: scopeOptions,
        },

        {
          id: 'variable_value',
          label: 'Variable value',
          placeholder: 'Enter variable value',
          type: 'textarea',
          required: true,
        },
      ]}
      buttonAction={(_, { variable_name, variable_scope, variable_value }) => {
        handleCreateVariable(variable_name, variable_scope, variable_value);
      }}
    />
  );
};
