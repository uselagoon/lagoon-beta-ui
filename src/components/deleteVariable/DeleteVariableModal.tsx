import { FC, startTransition, useState } from 'react';

import { EnvVariable } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/project-variables/page';
import deleteEnvVariableByName from '@/lib/mutation/deleteEnvVariableByName';
import { useMutation } from '@apollo/client';
import { Button, Input, Label, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from '../cancelDeployment/styles';

type Props = {
  currentEnv: EnvVariable;
  refetch: () => void;
  onClick?: () => any;
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

export const DeleteVariableDialog: FC<Props> = ({ currentEnv, refetch, type, onClick, ...rest }) => {
  const [inputValue, setInputValue] = useState('');

  const [deleteVariableMutation, { loading }] = useMutation(deleteEnvVariableByName, {
    onError: err => {
      console.error(err);
      toast.error('Error deleting variable', { id: 'cancel_error', description: err.message });
    },
  });

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

  const deleteVariable = (name: string) => {
    return deleteVariableMutation({
      variables: {
        input: {
          ...(orgName ? { organization: orgName } : {}),
          ...(projName ? { project: projName } : {}),
          ...(envName ? { environment: envName } : {}),
          name,
        },
      },
    });
  };

  const handleDeleteVariable = (variable_name: string) => {
    if (confirmDisabled) return;

    deleteVariable(variable_name).then(() => {
      startTransition(async () => {
        await refetch();
      });
    });
  };

  const confirmDisabled = inputValue !== currentEnv.name || loading;

  return (
    <>
      <Notification
        title="Delete a variable"
        message={
          <>
            Confirm the name of the variable <HighlightedText>{currentEnv.name}</HighlightedText> to delete
            <div className="grid gap-2">
              <Label htmlFor="variable_name" className="sr-only">
                Variable name
              </Label>
              <Input label="" id="variable_name" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </div>
          </>
        }
        cancelText="Cancel"
        confirmText="Delete"
        confirmDisabled={confirmDisabled}
        onConfirm={() => handleDeleteVariable(inputValue)}
      >
        <Button
          variant="outline"
          onClick={async () => {
            let permissionResponse = onClick ? await onClick() : {};
            if (permissionResponse?.error) {
            }
          }}
          disabled={loading}
        >
          <Tooltip>
            <TooltipTrigger>
              <Trash2 data-cy="delete-variable" />
            </TooltipTrigger>
            <TooltipContent>Delete variable</TooltipContent>
          </Tooltip>
        </Button>
      </Notification>
    </>
  );
};
