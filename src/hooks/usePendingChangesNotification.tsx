import { useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { X } from "lucide-react";

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
  
  // Needed to add refs to track state across refetch's to stop multiple re-renders
  const toastShownRef = useRef(false);
  const dismissedRef = useRef(false);
  const prevPendingChanges = useRef<boolean | null>(null);

  useEffect(() => {
    // Key the toast to the current page to avoid conflicts between subpages
    const toastId = `pending-changes-${pathname}`;

    // Handle single environment case
    const hasPendingChanges = !!(environment?.pendingChanges && environment.pendingChanges.length > 0);
    const statusChanged = prevPendingChanges.current !== hasPendingChanges;
    prevPendingChanges.current = hasPendingChanges;

    if (hasPendingChanges) {
      const defaultDeploymentUrl = `/projects/${environment.project?.name}/${environmentSlug}/deployments`;
      const finalDeploymentUrl = deploymentUrl || defaultDeploymentUrl;

      // We'e only showing the toast if it hasnt been shown before or dismissed
      if (!toastShownRef.current && (!dismissedRef.current || statusChanged)) {
        toastShownRef.current = true;
        
        if (statusChanged) {
          dismissedRef.current = false;
        }
        
        toast.custom(
          (t) => (
            <div
              className="flex items-center gap-3 p-4 border border-sky-500 rounded-lg shadow-lg min-w-80 max-w-md bg-[#CFEDFB] text-black mt-4 pointer-events-auto">
              <div className="flex-1">
                <p className="font-medium text-sm whitespace-nowrap">
                  Changes require deployment to take effect
                </p>
              </div>
              <button
                onClick={() => {
                  toastShownRef.current = false;
                  dismissedRef.current = false;
                  toast.dismiss(t);
                  router.push(finalDeploymentUrl);
                }}
                className="px-3 py-1 bg-sky-500 text-white rounded text-sm font-medium hover:bg-sky-600 transition-colors whitespace-nowrap pending-changes-notification__deploy-button"
              >
                Deploy now
              </button>
              <button onClick={() =>{toastShownRef.current = false; dismissedRef.current = true; toast.dismiss(t)}} className="text-gray-500 hover:text-gray-700 transition-colors" aria-label="Close">
                <X size={18} />
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
      }
    } else {
      if (toastShownRef.current) {
        toastShownRef.current = false;
        dismissedRef.current = false;
        toast.dismiss(toastId);
      }
    }
  }, [environment?.pendingChanges, environment?.project?.name, environmentSlug, deploymentUrl, router, pathname]);

  useEffect(() => {
    const toastId = `pending-changes-${pathname}`;
    return () => {
      if (process.env.NODE_ENV === 'development' && isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      toastShownRef.current = false;
      dismissedRef.current = false;
      prevPendingChanges.current = null;
      toast.dismiss(toastId);
    };
  }, [pathname]);
};