import { DeploymentType, deploymentOptions } from './DeployLatest';
import { DeploymentTypeSelector } from './DeploymentTypeSelector';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/ui-library';

export const DeployLatestFrame = ({
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