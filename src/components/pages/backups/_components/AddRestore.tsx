import { useState } from 'react';

import { Backup } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import { humanFileSize } from '@/components/utils';
import addRestore from '@/lib/mutation/addRestore';
import getRestoreLocation from '@/lib/mutation/getRestoreLocation';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { CloudDownload, Download, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { isValidUrl } from 'utils/isValidUrl';

const Prepare = ({ backupId }: { backupId: string }) => {
  const [addRestoreMutation, { loading, error, called }] = useMutation(addRestore, {
    variables: { input: { backupId } },
    onCompleted: () => {
      console.log('Restore added successfully');
    },
    refetchQueries: ['getEnvironment'],
  });

  if (loading || called) {
    return (
      <Tooltip>
        <TooltipTrigger>
          <Button disabled>
            <Loader2 className="animate-spin" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Retrieving ... </TooltipContent>
      </Tooltip>
    );
  }

  if (error) {
    return <Button disabled>Retrieve failed</Button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <Button data-cy="retrieve" onClick={() => addRestoreMutation()}>
          <CloudDownload />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Retrieve backup</TooltipContent>
    </Tooltip>
  );
};

const AddRestore = ({ backup, environmentID }: { backup: Backup; environmentID: number }) => {
  const [restoreDownloads, setRestoreDownloads] = useState<Record<string, string>>({});
  const [getRestore, { loading }] = useLazyQuery(getRestoreLocation, {
    variables: {
      environmentID: environmentID,
    },
    fetchPolicy: 'network-only',
    onCompleted: async data => {
      const allBackups = data?.environment?.backups;
      const targetBackup = allBackups.find((b: any) => b.backupId === backup.backupId);
      const restoreData = targetBackup?.restore;

      if (restoreData && restoreData.restoreLocation && isValidUrl(restoreData.restoreLocation)) {
        const { restoreLocation } = restoreData;
        setRestoreDownloads(prevUrls => ({
          ...prevUrls,
          [backup.backupId]: restoreLocation,
        }));

        window.open(restoreLocation, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Error fetching restore', { id: 'restore_err' });
      }
    },
    onError: error => {
      toast.error('Error fetching restore', {
        id: 'restore_err',
        description: error.message,
      });
      console.error(error);
    },
  });

  const handleDownload = () => {
    if (loading) return;
    const restoreDownload = restoreDownloads[backup.backupId];

    if (restoreDownload) {
      window.open(restoreDownload, '_blank', 'noopener,noreferrer');
    } else {
      getRestore();
    }
  };
  const [_, formattedSize] = humanFileSize(backup.restore?.restoreSize as number);

  if (!backup.restore) return <Prepare backupId={backup.backupId} />;

  if (backup.restore.status === 'pending')
    return (
      <Tooltip>
        <TooltipTrigger>
          <Button disabled>
            <Loader2 className="animate-spin" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Retrieving ... </TooltipContent>
      </Tooltip>
    );
  if (backup.restore.status === 'failed') return <Button disabled>Retrieve failed</Button>;

  return (
    <Button onClick={handleDownload}>
      {loading ? (
        <Tooltip>
          <TooltipTrigger disabled>
            <RefreshCw data-cy="preparing" className="animate-spin" />
          </TooltipTrigger>
          <TooltipContent>Preparing</TooltipContent>
        </Tooltip>
      ) : formattedSize ? (
        <Tooltip>
          <TooltipTrigger>
            <p className="flex gap-2">
              <Download /> {`(${formattedSize})`}
            </p>
          </TooltipTrigger>
          <TooltipContent>Download {`(${formattedSize})`}</TooltipContent>
        </Tooltip>
      ) : (
        'Download'
      )}
    </Button>
  );
};

export default AddRestore;
