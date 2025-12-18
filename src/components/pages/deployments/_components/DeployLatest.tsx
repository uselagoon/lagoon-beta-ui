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

const DeployLatestSkeleton = () => (
  <section className="flex items-center gap-[1rem] mb-6 py-1.5">
    <div className="description flex gap-2 items-center">
      Start a new deployment of <Skeleton className="w-[60px] h-8" />
    </div>
    <Button disabled>Deploy</Button>
  </section>
);

interface DeployOptionCardProps {
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  disabled?: boolean;
}

const DeployOptionCard: React.FC<DeployOptionCardProps> = ({
  selected,
  onSelect,
  icon,
  title,
  description,
  disabled,
}) => (
  <button
    type="button"
    onClick={onSelect}
    disabled={disabled}
    className={`
      flex-1 flex items-start gap-3 p-4 rounded-lg border text-left transition-all
      ${selected 
        ? 'border-blue-500 ring-1 ring-blue-500' 
        : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
      }
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <div className={`mt-0.5 ${selected ? 'text-blue-500' : 'text-gray-400'}`}>
      {icon}
    </div>
    <div className="flex flex-col gap-1">
      <span className="font-medium text-sm">{title}</span>
      <span className="text-xs text-gray-500 dark:text-gray-400">{description}</span>
    </div>
  </button>
);

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
        <DeployOptionCard
          selected={selectedType === 'full'}
          onSelect={() => setSelectedType('full')}
          icon={<GitBranch size={20} />}
          title="Full Deployment"
          description="Builds new images and applies all pending changes including variables, routes, and services."
          disabled={loading}
        />
        <DeployOptionCard
          selected={selectedType === 'variables'}
          onSelect={() => setSelectedType('variables')}
          icon={<Zap size={20} />}
          title="Variables Only Deployment"
          description="Faster deployment that updates runtime variables and restarts pods. Does not rebuild images."
          disabled={loading}
        />
      </div>

      {selectedType === 'variables' && (
        <div 
          className="mt-6 p-4 rounded-lg flex gap-3"
          style={{ 
            backgroundColor: '#fffbeb', 
            borderWidth: '1px', 
            borderStyle: 'solid', 
            borderColor: '#fde68a', 
            color: '#78350f' 
          }}
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
  if ('skeleton' in props && props.skeleton) {
    return <DeployLatestSkeleton />;
  }
  return <DeployLatestData {...(props as Props)} />;
};

export default DeployLatest;
