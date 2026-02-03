import { FC } from 'react';

import updateOrganizationDescription from '@/lib/mutation/organizations/updateOrganizationDescription';
import { ApolloError, useMutation } from '@apollo/client';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  orgId: number;
  description: string;
}
export const EditDesc: FC<Props> = ({ orgId, description }) => {
  const [updateOrgDesc, { loading }] = useMutation(updateOrganizationDescription, {
    refetchQueries: ['getOrganization'],
  });

  const handleUpdate = async () => {
    try {
      await updateOrgDesc({
        variables: {
          id: orgId,
          description,
        },
      });
    } catch (err) {
      toast.error('There was a problem updating organization description.', {
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button disabled={loading} variant="outline" onClick={handleUpdate} aria-label="save-desc">
          {loading ? <Loader2 className="animate-spin" /> : <Check />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save changes</TooltipContent>
    </Tooltip>
  );
};
