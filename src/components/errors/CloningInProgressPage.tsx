'use client';

import { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { useCloneStatus, useRegisterClone } from '@/hooks/useCloneStatus';
import { Badge } from '@/ui-library';
import { useSubscription } from '@apollo/client';
import { Loader2, X } from 'lucide-react';
import projectCloneChangedSubscription from '@/lib/subscription/organizations/projectCloneChanged';
import { STATUSES } from '@/contexts/CloneStatusContext';

interface CloningInProgressPageProps {
  projectName: string;
  cloneStatus?: string;
}

const CloningInProgressPage = ({ projectName, cloneStatus: serverCloneStatus }: CloningInProgressPageProps) => {
  const router = useRouter();
  const registerClone = useRegisterClone();
  const { status, isCloning } = useCloneStatus(projectName);

  useEffect(() => {
    if (projectName && serverCloneStatus) {
      registerClone(projectName, serverCloneStatus);
    }
  }, [projectName, serverCloneStatus, registerClone]);

  useSubscription(projectCloneChangedSubscription, {
    variables: { project: projectName },
    skip: !projectName,
    onData: ({ data }) => {
      const status: string | undefined = data.data?.projectCloneChanged?.status;
      if (status && !STATUSES.includes(status)) {
        return;
      }
      if (status === 'COMPLETE' || status === 'FAILED' || status === 'CANCELLED') {
        router.refresh();
      }
    },
  });

  useEffect(() => {
    if (status === 'COMPLETE' || status === 'FAILED' || status === 'CANCELLED') {
      router.refresh();
    }
  }, [status, router]);

  useEffect(() => {
    document.title = `Cloning in Progress | ${projectName}`;
  }, [projectName]);

  const displayStatus = status ?? serverCloneStatus;

  const formattedStatus = displayStatus ? displayStatus.replace(/_/g, ' ').toLowerCase() : null;

  return (
    <SectionWrapper>
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6">
        {displayStatus === 'FAILED' ? (
          <>
            <X className="h-12 w-12 text-red-500" />
            <h2 className="text-2xl font-semibold">Project Cloning Failed</h2>
            <Badge variant="destructive">Cloning Failed</Badge>
            <p className='text-sm text-red-600 dark:text-red-400 text-center max-w-md'>
              The project clone has failed. Please try again or contact support if the issue persists.
            </p>
          </>
        ) : (
          <>
            <Loader2 className={`h-12 w-12 text-blue-500 ${isCloning ? 'animate-spin' : ''}`} />
            <h2 className="text-2xl font-semibold">Project Cloning in Progress</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              The project <strong>{projectName}</strong> is currently being cloned and is not yet accessible.
            </p>
            {formattedStatus && (
              <Badge variant={status === 'COMPLETE' ? 'success' : 'info'} className="text-sm">
                Status: {formattedStatus}
              </Badge>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-500 text-center max-w-md">
              Please wait until the cloning process is complete before accessing this project. This page will
              automatically refresh when cloning is complete.
            </p>
          </>
        )
      }
      </div>
    </SectionWrapper>
  );
};

export default CloningInProgressPage;
