import React, { FC } from 'react';

import { Button, Notification } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from '../cancelDeployment/styles';

/**
 * Confirms active standby switch
 */
interface ActiveStandbyConfirmProps {
  activeEnvironment: string;
  standbyEnvironment: string | null;
  action: () => void | Promise<any>;
  loading: boolean;
}

export const ActiveStandbyConfirm: FC<ActiveStandbyConfirmProps> = ({
  activeEnvironment,
  standbyEnvironment,
  action,
  loading,
}) => {
  const confirmSwitch = async () => {
    try {
      await action();
    } catch (err) {
      console.error(err);
      toast.error('Error switching Active/Standby', {
        id: 'cancel_error',
        description: (err as { message: string }).message,
      });
    }
  };

  return (
    <Notification
      title="Confirm action"
      message={
        <div className="flex flex-col gap-3">
          <p>
            This will replace the current active environment <HighlightedText>{activeEnvironment}</HighlightedText>
            <br />
            with the selected standby environment <HighlightedText>{standbyEnvironment}</HighlightedText>.
          </p>
          <p>Are you sure you want to do this?</p>
          <p>Upon confirmation you will be taken to the task page to monitor execution. </p>
        </div>
      }
      cancelText="Cancel"
      confirmText="Confirm"
      onConfirm={confirmSwitch}
    >
      <Button>
        {loading && <Loader2 className="animate-spin" />}
        Switch Active/Standby environments
      </Button>
    </Notification>
  );
};

export default ActiveStandbyConfirm;
