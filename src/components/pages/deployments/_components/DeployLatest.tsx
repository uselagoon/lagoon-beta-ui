import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import deployEnvironmentLatest from '@/lib/mutation/deployEnvironmentLatest';
import { useMutation } from '@apollo/client';
import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { Button, Skeleton } from '@uselagoon/ui-library';
import { AlertCircle, GitBranch, Loader2, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface Props {
  environment: DeploymentsData['environment'];
  refetch?: RefetchFunction<
    DeploymentsData,
    {
      openshiftProjectName: string;
      limit: null | number;
    }
  >;
  skeleton?: false;
}

interface PropsWithSkeleton {
  skeleton: true;
}

type DeploymentType = 'full' | 'variables';


const deploymentOptions = [
  {
    type: 'full' as const,
    icon: <GitBranch size={20} className="size-5" />,
    title: 'Full Deployment',
    description: 'Builds new images and applies all pending changes including variables, routes, and services.',
  },
  {
    type: 'variables' as const,
    icon: <Zap size={20} className="size-5" />,
    title: 'Variables Only Deployment',
    description: 'Faster deployment that updates runtime variables and restarts pods. Does not rebuild images.',
  },
];

const DeployLatestData: React.FC<Props> = ({ environment }) => {
  const { id, deployType, deployBaseRef, deployHeadRef, deployTitle } = environment;
  const [selectedType, setSelectedType] = useState<DeploymentType>('full');

  const [deployEnvironmentLatestMutation, { loading }] = useMutation(deployEnvironmentLatest, {
    onError: err => {
      console.error(err);
      toast.error('Deployment error', {
        id: 'deploy_error',
        description: (err as { message: string })?.message,
      });
    },
    variables: {
      environmentId: id,
      envVarOnly: selectedType === 'variables' ? "true" : "false",
    },
    onCompleted: () => {
      const message = selectedType === 'variables' ? 'Variable-only deployment triggered' : 'Deployment triggered';
      toast.success(message);
    },
    refetchQueries: ['getEnvironment'],
  });

  let deploymentsEnabled = true;

  if (deployType === 'branch' || deployType === 'promote') {
    if (!deployBaseRef) {
      deploymentsEnabled = false;
    }
  } else if (deployType === 'pullrequest') {
    if (!deployBaseRef && !deployHeadRef && !deployTitle) {
      deploymentsEnabled = false;
    }
  } else {
    deploymentsEnabled = false;
  }

  if (!deploymentsEnabled) {
    return (
      <section className="flex items-center gap-[1rem] mb-6 w-max py-1.5">
        <div className="description text-sm leading-[1.375rem]">
          Manual deployments are not available for this environment.
        </div>
        <Button data-cy="deploy-button" disabled>
          Deploy
        </Button>
      </section>
    );
  }

  return (
    <section className="py-4 px-[18px] rounded-lg border mb-6">
      <div className="mb-4">
        <h3 className="text-base font-medium">Deployment Type</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to deploy these changes</p>
      </div>

      <div className="flex gap-4">
        {deploymentOptions.map(option => (
          <Button
            key={option.type}
            variant={selectedType === option.type ? 'default' : 'secondary'}
            onClick={() => setSelectedType(option.type)}
            disabled={loading}
            className={`flex-1 flex h-auto items-start gap-3 p-4 rounded-lg border text-left transition-all`}
          >
            <div className="flex gap-3">
              <div className={`mt-0.5 flex-shrink-0 ${selectedType === option.type ? 'text-blue-500' : 'text-gray-400'}`}>{option.icon}</div>
              <div className="flex flex-col gap-1">
                <span className="font-medium text-sm">{option.title}</span>
                <span className="text-xs opacity-70 font-normal">{option.description}</span>
              </div>
            </div>
          </Button>
        ))}
      </div>

      {selectedType === 'variables' && (
        <div 
          className="mt-6 p-4 rounded-lg flex gap-3 mt-6 p-4 rounded-lg flex gap-3 bg-amber-50 border border-amber-200 text-amber-900"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium">Partial Deployment Warning</h4>
            <p className="text-sm mt-1">
              Some changes will not fully apply with a variables only deployment. Runtime variables will update now. Build scoped behaviour and other changes will only take effect after a full deployment.
            </p>
          </div>
        </div>
      )}

      <div className="flex justify-end mt-6">
        <Button data-cy="deploy-button" disabled={loading} onClick={() => deployEnvironmentLatestMutation()}>
          {loading && <Loader2 className="animate-spin" />} Deploy
        </Button>
      </div>
    </section>
  );
};

const DeployLatest = (props: Props | PropsWithSkeleton) => {
  return <DeployLatestData {...(props as Props)} />;
};

export default DeployLatest;
