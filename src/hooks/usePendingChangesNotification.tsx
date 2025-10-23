import { useEffect } from 'react';
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
  
  // For multiple environments (ProjectEnvironmentsPage)
  environments?: Environment[];
  
  // Custom deployment URL (optional)
  deploymentUrl?: string;
}

export const usePendingChangesNotification = (options: UsePendingChangesNotificationOptions) => {
  const router = useRouter();
  const { environment, environmentSlug, environments, deploymentUrl } = options;

  useEffect(() => {
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
          id: 'pending-changes',
        }
      );
    }

    // Handle multiple environments case
    if (environments) {
      const environmentsWithPendingChanges = environments.filter(
        env => env.pendingChanges && env.pendingChanges.length > 0
      );
      
      if (environmentsWithPendingChanges.length > 0) {
        toast.custom(
          (t) => (
            <div 
              className="flex items-center gap-3 p-4 border border-sky-500 rounded-lg shadow-lg max-w-md"
              style={{ 
                backgroundColor: 'rgba(14, 165, 233, 0.2)',
                color: '#000000'
              }}
            >
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {environmentsWithPendingChanges.length === 1 
                    ? `Environment "${environmentsWithPendingChanges[0].name}" has changes requiring deployment`
                    : `${environmentsWithPendingChanges.length} environments have changes requiring deployment`
                  }
                </p>
              </div>
            </div>
          ),
          {
            duration: Infinity,
            id: 'pending-changes-project',
          }
        );
      }
    }
  }, [environment?.pendingChanges, environments, environment?.project?.name, environmentSlug, deploymentUrl, router]);
};