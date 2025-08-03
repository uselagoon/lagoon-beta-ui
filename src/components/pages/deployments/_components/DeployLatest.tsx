import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import deployEnvironmentLatest from '@/lib/mutation/deployEnvironmentLatest';
import { useMutation } from '@apollo/client';
import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { Button, Skeleton } from '@uselagoon/ui-library';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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

const DeployLatestSkeleton = () => (
  <section className="flex items-center gap-[1rem] mb-6 py-1.5">
    <div className="description flex gap-2 items-center">
      Start a new deployment of <Skeleton className="w-[60px] h-8" />
    </div>
    <Button disabled>Deploy</Button>
  </section>
);

const DeployLatestData: React.FC<Props> = ({ environment }) => {
  const { id, deployType, deployBaseRef, deployHeadRef, deployTitle } = environment;

  const [deployEnvironmentLatestMutation, { loading, error }] = useMutation(deployEnvironmentLatest, {
    onError: err => {
      console.error(err);
      toast.error('Deployment error', {
        id: 'deploy_error',
        description: (err as { message: string })?.message,
      });
    },
    variables: {
      environmentId: id,
    },
    onCompleted: () => {
      toast.success('Deployment triggered');
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

  return (
    <section className="flex items-center gap-[1rem] mb-6 w-max py-1.5">
      {!deploymentsEnabled ? (
        <>
          <div className="description text-sm leading-[1.375rem]">
            Manual deployments are not available for this environment.
          </div>
          <Button data-cy="deploy-button" disabled>
            Deploy
          </Button>
        </>
      ) : (
        <>
          <div className="description text-sm leading-[1.375rem] flex gap-1 items-center">
            {deployType === 'branch' && `Start a new deployment of branch ${deployBaseRef}.`}
            {deployType === 'pullrequest' && `Start a new deployment of pull request ${deployTitle}.`}
            {deployType === 'promote' &&
              `Start a new deployment from environment ${environment.project.name}-${deployBaseRef}.`}
          </div>
          <Button data-cy="deploy-button" disabled={loading} onClick={() => deployEnvironmentLatestMutation()}>
            {loading && <Loader2 className="animate-spin" />} Deploy
          </Button>
        </>
      )}
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
