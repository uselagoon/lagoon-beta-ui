import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import deployEnvironmentLatest from '@/lib/mutation/deployEnvironmentLatest';
import { useMutation } from '@apollo/client';
import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { Button, ToggleGroup, ToggleGroupItem } from '@/ui-library';
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
    value: 'full' as const,
    icon: GitBranch,
    label: 'Full deployment',
    detail: 'This will rebuild and redeploy everything',
    description: 'New images are built and all pending changes apply, including variables, routes, and services. This is the safest option if you\'re unsure what changed.',
  },
  {
    value: 'variables' as const,
    icon: Zap,
    label: 'Variables only',
    detail: 'Updates variables without rebuilding',
    description: 'Faster deployment that updates runtime variables and restarts pods. Does not rebuild images.',
    warning: 'Runtime variables update now. Build-scoped changes only take effect after a full deployment.',
  },
];

const DeployLatestData: React.FC<Props> = ({ environment }) => {
  const { id, deployType, deployBaseRef, deployHeadRef, deployTitle } = environment;
  const [selectedType, setSelectedType] = useState<DeploymentType>('full');
  const selected = deploymentOptions.find((o) => o.value === selectedType)!;
  const Icon = selected.icon;

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
    <section className="py-4 rounded-lg mb-6">
      <div className="flex gap-4 max-w-[60%] justify-between">
        <ToggleGroup
          type="single"
          size="lg"
          className="w-2/3"
          variant="outline"
          value={selectedType}
          onValueChange={(val) => val && setSelectedType(val as DeploymentType)}
        >
          {deploymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <ToggleGroupItem className="p-4" key={option.value} value={option.value} aria-label={option.label} disabled={loading}>
                <Icon className={`size-5 mr-2 mt-0.5 flex-shrink-0 ${selectedType === option.value ? 'text-blue-500' : 'text-gray-400'}`} />
                {option.label}
              </ToggleGroupItem>
              
            );
          })}

      </ToggleGroup>
          <Button data-cy="deploy-button" disabled={loading} onClick={() => deployEnvironmentLatestMutation()}>
            {loading && <Loader2 className="animate-spin" />} Deploy
          </Button>
      </div>

      <div className="mt-4 rounded-lg border p-4 flex gap-3 max-w-[60%]">
        <Icon className="size-5 shrink-0 mt-0.5 text-blue-500" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">{selected.detail}</p>
          <p className="text-sm text-muted-foreground">{selected.description}</p>
          {selected.warning && (
            <div className="flex items-start gap-2 mt-2">
              <AlertCircle className="size-3.5 text-amber-600 dark:text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800 dark:text-amber-400 leading-relaxed">{selected.warning}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const DeployLatest = (props: Props | PropsWithSkeleton) => {
  return <DeployLatestData {...(props as Props)} />;
};

export default DeployLatest;
