import { FC } from 'react';

import updateOrganizationFriendlyName from '@/lib/mutation/organizations/updateOrganizationFriendlyName';
import { ApolloError, useMutation } from '@apollo/client';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  orgId: number;
  friendlyName: string;
}
export const EditName: FC<Props> = ({ orgId, friendlyName }) => {
  const [updateOrgName, { loading }] = useMutation(updateOrganizationFriendlyName, {
    refetchQueries: ['getOrganization'],
  });

  const handleUpdate = async () => {
    try {
      await updateOrgName({
        variables: {
          id: orgId,
          friendlyName,
        },
      });
    } catch (err) {
      toast.error('There was a problem updating organization name.', {
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button disabled={loading} variant="outline" onClick={handleUpdate}>
          {loading ? <Loader2 className="animate-spin" /> : <Check />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save changes</TooltipContent>
    </Tooltip>
  );
};
