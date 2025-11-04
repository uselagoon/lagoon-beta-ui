import { FC, startTransition, useState } from 'react';


import { useMutation } from '@apollo/client';
import { Button, Input, Label, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Trash2, Unlink } from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from '../cancelDeployment/styles';
import { Route } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page';
import removeRouteFromEnvironment from '@/lib/mutation/removeRouteFromEnvironment';


type Props = {
  domainName: string;
  environmentName: string;
  refetch: () => void;
  onClick?: () => any;
  iconOnly?: boolean;
} & (
  | {
      projectName: string;
    }
);

export const RemoveRouteFromEnvDialog: FC<Props> = ({ domainName, projectName, environmentName, refetch, iconOnly, onClick, ...rest }) => {
  const [inputValue, setInputValue] = useState('');

  const [removeRouteFromEnvMutation, { loading }] = useMutation(removeRouteFromEnvironment, {
    onError: err => {
      console.error(err);
      toast.error('Error deleting route', { id: 'cancel_error', description: err.message });
    },
  });

  const removeRouteFromEnv = (domainName: string, projectName: string, environmentName: string) => {
    return removeRouteFromEnvMutation({
      variables: {
        domain: domainName,
        project: projectName,
        environment: environmentName,
      },
    });
  };

  const handleRemoveRouteFromEnv = (domain: string, projectName: string, environmentName: string) => {
    if (confirmDisabled) return;

    removeRouteFromEnv(domain, projectName, environmentName).then(() => {
      startTransition(async () => {
        refetch();
      });
    });
  };

  const confirmDisabled = inputValue !== domainName || loading;

  return (
    <>
      <Notification
        title="Detach route from environment"
        message={
          <>
            Confirm the name of the domain <HighlightedText>{domainName}</HighlightedText> to detach
            <div className="grid gap-2">
              <Label htmlFor="domain_name" className="sr-only">
                Domain name
              </Label>
              <Input label="" id="domain_name" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </div>
          </>
        }
        cancelText="Cancel"
        confirmText="Detach"
        confirmDisabled={confirmDisabled}
        onConfirm={() => handleRemoveRouteFromEnv(inputValue, projectName, environmentName)}
      >
        <Button
          variant="destructive"
          onClick={async () => {
            let permissionResponse = onClick ? await onClick() : {};
            if (permissionResponse?.error) {
              console.error(permissionResponse?.error);
            }
          }}
          disabled={loading}
        >
          <Tooltip>
            <TooltipTrigger>
              <Unlink className="h-5 w-5" />
            </TooltipTrigger>
            <TooltipContent>Remove route from environment</TooltipContent>
          </Tooltip>
        </Button>
      </Notification>
    </>
  );
};
