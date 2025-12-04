import { FC, startTransition, useState } from 'react';

import deleteRouteFromProject from '@/lib/mutation/deleteRouteFromProject'; 
import { useMutation } from '@apollo/client';
import { Button, Input, Label, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import {Trash, Trash2} from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from '../cancelDeployment/styles';
import { Route } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/routes/page';


type Props = {
  route: Route;
  refetch: () => void;
  onClick?: () => any;
} & (
  | {
      projectName: string;
    }
);

export const DeleteRouteDialog: FC<Props> = ({ route, refetch, onClick, ...rest }) => {
  const [inputValue, setInputValue] = useState('');

  const [deleteRouteMutation, { loading }] = useMutation(deleteRouteFromProject, {
    onError: err => {
      console.error(err);
      toast.error('Error deleting route', { id: 'cancel_error', description: err.message });
    },
  });

  const deleteRoute = (id: number) => {
    return deleteRouteMutation({
      variables: {
        id: id,
      },
    });
  };

  const handleDeleteRoute = (domain_name: string, id: number) => {
    if (confirmDisabled) return;

    deleteRoute(id).then(() => {
      startTransition(async () => {
        await refetch();
      });
    });
  };

  const confirmDisabled = inputValue !== route.domain || loading;

  return (
    <>
      <Notification
        title="Delete a route"
        message={
          <>
            Confirm the name of the domain <HighlightedText>{route.domain}</HighlightedText> to delete
            <div className="grid gap-2">
              <Label htmlFor="domain_name" className="sr-only">
                Domain name
              </Label>
              <Input label="" id="domain_name" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            </div>
          </>
        }
        cancelText="Cancel"
        confirmText="Delete"
        confirmDisabled={confirmDisabled}
        onConfirm={() => handleDeleteRoute(inputValue, route.id)}
      >
        <Button
          variant="outline"
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
              <Trash data-cy="delete-route" />
            </TooltipTrigger>
            <TooltipContent>Delete route</TooltipContent>
          </Tooltip>
        </Button>
      </Notification>
    </>
  );
};
