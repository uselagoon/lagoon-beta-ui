import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface PendingChange {
  details: string;
}

interface Environment {
  name: string;
  pendingChanges: PendingChange[];
  project?: {
    name: string;
  };
}

interface UsePendingChangesNotificationOptions {
  // For single environment (EnvironmentPage)
  environment?: Environment;
  environmentSlug?: string;
  
  // Custom deployment URL (optional)
  deploymentUrl?: string;
}

export const usePendingChangesNotification = (options: UsePendingChangesNotificationOptions) => {
  const router = useRouter();
  const { environment, environmentSlug, deploymentUrl } = options;
  const isFirstRender = useRef(true);

  useEffect(() => {
    const toastId = 'pending-changes';
    
    // Handle single environment case
    if (environment?.pendingChanges && environment.pendingChanges.length > 0) {
      const defaultDeploymentUrl = `/projects/${environment.project?.name}/${environmentSlug}/deployments`;
      const finalDeploymentUrl = deploymentUrl || defaultDeploymentUrl;
      
      toast.custom(
        (t) => (
          <div 
            className="flex items-center gap-3 p-4 border border-sky-500 rounded-lg shadow-lg"
            style={{ 
              backgroundColor: 'rgba(14, 165, 233, 0.2)',
              color: '#000000'
            }}
          >
            <div className="flex-1">
              <p className="font-medium text-sm">
                Changes require deployment to take effect
              </p>
            </div>
            <button
              onClick={() => {
                toast.dismiss(t);
                router.push(finalDeploymentUrl);
              }}
              className="px-3 py-1 bg-sky-500 text-white rounded text-sm font-medium hover:bg-sky-600 transition-colors"
            >
              Deploy now
            </button>
          </div>
        ),
        {
          duration: Infinity,
          id: toastId,
        }
      );
    } else {
      // Dismiss toast if no pending changes
      toast.dismiss(toastId);
    }

    // Cleanup function - but only dismiss on real unmount, not Strict Mode re-renders
    return () => {
      if (isFirstRender.current) {
        // This is likely a Strict Mode double-mount, don't dismiss
        isFirstRender.current = false;
        console.log('Skipping cleanup - likely Strict Mode double-mount');
      } else {
        // This is a real cleanup (navigation away or actual unmount)
        console.log('Real cleanup - dismissing toast');
        toast.dismiss(toastId);
      }
    };
  }, [environment?.pendingChanges, environment?.project?.name, environmentSlug, deploymentUrl, router]);
};