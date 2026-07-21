import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import deployEnvironmentLatest from '@/lib/mutation/deployEnvironmentLatest';
import { useMutation } from '@apollo/client';
import { RefetchFunction } from '@apollo/client/react/hooks/useSuspenseQuery';
import { Button, cn } from '@/ui-library';
import { AlertTriangle, GitBranch, Loader2, Zap } from 'lucide-react';
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

interface DeploymentOption {
  value: DeploymentType;
  icon: typeof GitBranch;
  label: string;
  cta: string;
  headline: string;
  description: string;
  warning?: string;
}

const deploymentOptions: DeploymentOption[] = [
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

/**
 * Segmented selector for the deployment type. Built as a radiogroup so arrow-key
 * users and screen readers get the same affordance as pointer users.
 */
const DeploymentTypeSelector = ({
  value,
  onChange,
  disabledValues = [],
  disabled = false,
}: {
  value: DeploymentType;
  onChange: (value: DeploymentType) => void;
  disabledValues?: DeploymentType[];
  disabled?: boolean;
}) => {
  const selectableOptions = deploymentOptions.filter(option => !disabledValues.includes(option.value));

  const moveSelection = (direction: 1 | -1) => {
    const currentIndex = selectableOptions.findIndex(option => option.value === value);
    const next = selectableOptions[(currentIndex + direction + selectableOptions.length) % selectableOptions.length];
    if (next) {
      onChange(next.value);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Deployment type"
      className="inline-flex w-full gap-1 rounded-md bg-muted p-1 sm:w-auto"
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          event.preventDefault();
          moveSelection(1);
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          event.preventDefault();
          moveSelection(-1);
        }
      }}
    >
      {deploymentOptions.map(option => {
        const Icon = option.icon;
        const isSelected = option.value === value;
        const isDisabled = disabled || disabledValues.includes(option.value);

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={isDisabled}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-[0.3rem] px-4 py-2 text-sm font-medium',
              'whitespace-nowrap sm:flex-none sm:min-w-[10.5rem]',
              'transition-colors duration-150 outline-none',
              'focus-visible:ring-[3px] focus-visible:ring-ring/50',
              'disabled:cursor-not-allowed disabled:opacity-45',
              isSelected
                ? 'bg-background text-foreground shadow-xs'
                : 'text-muted-foreground hover:text-foreground disabled:hover:text-muted-foreground'
            )}
          >
            <Icon className={cn('size-4 shrink-0', isSelected ? 'text-[#3a8cff]' : 'text-current')} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

const DeployLatestFrame = ({
  selectedType,
  onChange,
  disabledValues,
  pendingCount,
  pendingDetails,
  target,
  loading,
  onDeploy,
}: {
  selectedType: DeploymentType;
  onChange: (value: DeploymentType) => void;
  disabledValues: DeploymentType[];
  pendingCount: number;
  pendingDetails?: string;
  target?: string;
  loading: boolean;
  onDeploy?: () => void;
}) => {
  const selected = deploymentOptions.find(option => option.value === selectedType) ?? deploymentOptions[0];
  const Icon = selected.icon;

  return (
    <section className="mb-6 w-full rounded-lg border px-5 py-5" data-cy="deploy-latest">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <DeploymentTypeSelector
          value={selectedType}
          onChange={onChange}
          disabledValues={disabledValues}
          disabled={loading}
        />

        <p className="text-xs text-muted-foreground sm:text-right" title={pendingDetails}>
          {pendingCount > 0
            ? `${pendingCount} variable ${pendingCount === 1 ? 'change' : 'changes'} waiting to deploy`
            : 'No variable changes waiting to deploy'}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-10">
        <div className="flex max-w-[72ch] gap-3">
          <Icon className="mt-0.5 size-5 shrink-0 text-[#3a8cff]" />
          <div className="space-y-1.5">
            <p className="text-sm font-semibold leading-tight">{selected.headline}</p>
            <p className="text-sm leading-relaxed text-muted-foreground">{selected.description}</p>
            {selected.warning && (
              <p className="flex items-start gap-2 pt-0.5 text-xs leading-relaxed text-amber-700 dark:text-amber-500">
                <AlertTriangle className="mt-px size-3.5 shrink-0" />
                {selected.warning}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          {target && <span className="text-xs text-muted-foreground sm:text-right">{target}</span>}
          <Button data-cy="deploy-button" size="lg" disabled={loading || !onDeploy} onClick={onDeploy}>
            {loading && <Loader2 className="animate-spin" />}
            {loading ? 'Deploying' : selected.cta}
          </Button>
        </div>
      </div>
    </section>
  );
};

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

  // Variables-only has nothing to apply when no variable changes are pending, so
  // the selection always resolves back to a full deployment.
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
