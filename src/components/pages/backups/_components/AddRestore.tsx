import { FC } from 'react';

import { Backup } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import addRestore from '@/lib/mutation/addRestore';
import { useMutation } from '@apollo/client';
import { Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { CloudDownload, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface AddRestoreButtonProps {
  action: () => Promise<any>;
  success: boolean;
  loading: boolean;
  error?: {
    message: string;
  };
  type: 'failed' | 'retrievable' | 'unavailable';
}
export const AddRestoreButton: FC<AddRestoreButtonProps> = ({ action, success, loading, error, type }) => {
  if (error) {
    toast.error('There was a problem retrieving backup', {
      description: error.message,
    });
  }

  return (
    <>
      {type === 'failed' ? (
        <Tooltip>
          <TooltipTrigger disabled={loading || success}>
            <RefreshCw data-cy="retry" onClick={action} />
          </TooltipTrigger>
          <TooltipContent>Retry</TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger disabled={loading || success}>
            <CloudDownload data-cy="retrieve" onClick={action} />
          </TooltipTrigger>
          <TooltipContent>Retrieve backup</TooltipContent>
        </Tooltip>
      )}
    </>
  );
};

const AddRestore = ({ backup, type }: { backup: Backup; type: 'failed' | 'retrievable' | 'unavailable' }) => {
  const [addRestoreMutation, { data, loading, error }] = useMutation(addRestore, {
    onError: err => {
      console.error(err);
    },
    variables: {
      input: {
        backupId: backup.backupId,
      },
    },
    refetchQueries: ['getEnvironment'],
  });

  return (
    <AddRestoreButton
      action={addRestoreMutation}
      success={data && data.addRestore}
      loading={loading}
      error={error}
      type={type}
    />
  );
};

export default AddRestore;
