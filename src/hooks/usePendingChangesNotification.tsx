import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';

interface PendingChange {
  details: string;
}

interface Environment {
  pendingChanges?: PendingChange[];
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
  const pathname = usePathname();
  const { environment, environmentSlug, deploymentUrl } = options;
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Key the toast to the current page to avoid conflicts between subpages
    const toastId = `pending-changes-${pathname}`;
    
    // Handle single environment case
    if (environment?.pendingChanges && environment.pendingChanges.length > 0) {
      const defaultDeploymentUrl = `/projects/${environment.project?.name}/${environmentSlug}/deployments`;
      const finalDeploymentUrl = deploymentUrl || defaultDeploymentUrl;
      
      toast.custom(
        (t) => (
          <div 
            className="flex items-center gap-3 p-4 border border-sky-500 rounded-lg shadow-lg min-w-80 max-w-md"
            style={{ 
              backgroundColor: '#CFEDFB',
              color: '#000000'
            }}
          >
            <div className="flex-1">
              <p className="font-medium text-sm whitespace-nowrap">
                Changes require deployment to take effect
              </p>
            </div>
            <button
              onClick={() => {
                toast.dismiss(t);
                router.push(finalDeploymentUrl);
              }}
              className="px-3 py-1 bg-sky-500 text-white rounded text-sm font-medium hover:bg-sky-600 transition-colors whitespace-nowrap pending-changes-notification__deploy-button"
            >
              Deploy now
            </button>
          </div>
        ),
        {
          duration: Infinity,
          id: toastId,
          position: 'top-right',
          unstyled: false,
          className: '',
          style: {
            animation: 'none',
            transition: 'none'
          }
        }
      );
    } else {
      // Dismiss toast if no pending changes
      toast.dismiss(toastId);
    }
    
    return () => {
        // Cleanup function - dismiss this page's toast when component unmounts
      if (isFirstRender.current) {
        // This is likely a Strict Mode double-mount, don't dismiss
        isFirstRender.current = false;
      } else {
        // This is a real cleanup (navigation away or actual unmount)
        toast.dismiss(toastId);
      }
    };
  }, [environment?.pendingChanges, environment?.project?.name, environmentSlug, deploymentUrl, router, pathname]);
};