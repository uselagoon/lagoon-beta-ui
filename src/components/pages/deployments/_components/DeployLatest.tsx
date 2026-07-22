import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import deployEnvironmentLatest from '@/lib/mutation/deployEnvironmentLatest';
import { useMutation } from '@apollo/client';
import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { Button } from '@/ui-library';
import { DeployLatestFrame } from './DeployLatestFrame';
import { GitBranch, Zap } from 'lucide-react';
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

export type DeploymentType = 'full' | 'variables';

interface DeploymentOption {
  value: DeploymentType;
  icon: typeof GitBranch;
  label: string;
  cta: string;
  headline: string;
  description: string;
  warning?: string;
}

export const deploymentOptions: DeploymentOption[] = [
  {
    value: 'full',
    icon: GitBranch,
    label: 'Full deployment',
    cta: 'Deploy everything',
    headline: 'Rebuilds and redeploys everything',
    description:
      'New images are built and every pending change is applied, including variables, routes and services. Choose this if you are not sure what changed.',
  },
  {
    value: 'variables',
    icon: Zap,
    label: 'Variables only',
    cta: 'Deploy variables',
    headline: 'Applies variable changes without rebuilding',
    description:
      'Runtime variables are updated and the pods restart. No images are rebuilt, so this finishes in a fraction of the time.',
    warning: 'Variables read at build time will not change until you run a full deployment.',
  },
];

const DeployLatestSkeleton = () => (
  <DeployLatestFrame
    selectedType="full"
    onChange={() => {}}
    disabledValues={['variables']}
    pendingCount={0}
    loading
  />
);

const DeployLatestData: React.FC<Props> = ({ environment }) => {
  const { id, deployType, deployBaseRef, deployHeadRef, deployTitle, pendingChanges } = environment;
  const [requestedType, setRequestedType] = useState<DeploymentType>('full');

  const pendingCount = pendingChanges?.length ?? 0;
  const variablesAvailable = pendingCount > 0;

  const selectedType: DeploymentType = variablesAvailable ? requestedType : 'full';

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
      envVarOnly: selectedType === 'variables' ? 'true' : 'false',
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
      <section className="mb-6 flex w-full flex-col gap-3 rounded-lg border px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">Manual deployments are not available for this environment.</p>
        <Button data-cy="deploy-button" size="lg" disabled className="shrink-0">
          Deploy
        </Button>
      </section>
    );
  }

  let target;
  if (deployType === 'branch') {
    target = `Branch ${deployBaseRef}`;
  } else if (deployType === 'pullrequest') {
    target = `Pull request ${deployTitle}`;
  } else if (deployType === 'promote') {
    target = `From ${environment.project.name}-${deployBaseRef}`;
  }

  return (
    <DeployLatestFrame
      selectedType={selectedType}
      onChange={setRequestedType}
      disabledValues={variablesAvailable ? [] : ['variables']}
      pendingCount={pendingCount}
      pendingDetails={pendingChanges?.map(change => change.details).join('\n')}
      target={target}
      loading={loading}
      onDeploy={() => deployEnvironmentLatestMutation()}
    />
  );
};

const DeployLatest = (props: Props | PropsWithSkeleton) => {
  if ('skeleton' in props && props.skeleton) {
    return <DeployLatestSkeleton />;
  }
  return <DeployLatestData {...(props as Props)} />;
};

export default DeployLatest;
