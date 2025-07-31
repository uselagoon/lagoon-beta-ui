import { Deployment } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import { default as cancelDeploy } from '@/lib/mutation/cancelDeployment';
import { useMutation } from '@apollo/client';
import { Button, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Ban } from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from './styles';

interface CancelButtonProps {
  action: () => Promise<any>;
  success: boolean;
  loading: boolean;
  error?: {
    message: string;
  };
  beforeText?: string;
  afterText?: string;
  deployName?: string;
}

export const CancelDeploymentButton = ({
  action,
  success,
  loading,
  error,
  beforeText,
  afterText,
  deployName,
}: CancelButtonProps) => {
  if (error) toast.error('Error cancelling deployment', { id: 'cancel_error', description: error.message });

  const cancelDeployText = deployName ? (
    <>
      Are you sure you want to cancel deployment <HighlightedText>{deployName}</HighlightedText>?
    </>
  ) : (
    'Are you sure you want to cancel this deployment?'
  );

  return (
    <>
      {!success && (
        <Notification
          title="Cancel Deployment"
          message={cancelDeployText}
          cancelText="No"
          confirmText="Yes"
          onConfirm={action}
        >
          <Button variant="ghost" disabled={loading || success}>
            <Tooltip>
              <TooltipTrigger>
                <Ban data-cy="cancel-deployment" />
              </TooltipTrigger>
              <TooltipContent>Cancel Deployment</TooltipContent>
            </Tooltip>
          </Button>
        </Notification>
      )}

      {success ? afterText || 'Cancelled' : beforeText || ''}
    </>
  );
};

const CancelDeployment = ({
  deployment,
  beforeText,
  afterText,
}: {
  deployment: Partial<Deployment>;
  beforeText?: string;
  afterText?: string;
}) => {
  const [cancelDeploymentMutation, { data, loading, error }] = useMutation(cancelDeploy, {
    onError: err => {
      console.error(err);
    },
    variables: {
      deploymentId: deployment.id,
    },
    refetchQueries: ['getEnvironment'],
  });

  return (
    <CancelDeploymentButton
      action={cancelDeploymentMutation}
      success={data && data.cancelDeployment === 'success'}
      loading={loading}
      error={error}
      deployName={deployment.name}
      beforeText={beforeText}
      afterText={afterText}
    />
  );
};

export default CancelDeployment;
