'use client';

import { usePathname } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import getDeploymentTableColumns from '@/components/pages/deployments/_components/TableColumns';
import { deploymentResultOptions, statusOptions } from '@/components/pages/deployments/_components/filterValues';
import { Button, DataTable, DateRangePicker, SelectWithOptions, ToggleGroup, ToggleGroupItem } from '@/ui-library';
import { useQueryStates } from 'nuqs';
import { GitBranch, Loader2, Zap } from 'lucide-react';

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

const DeployLatestSkeleton = () => (
    <section className="py-4 rounded-lg mb-6">
      <div className="flex gap-4 max-w-[60%] justify-between">
        <ToggleGroup
          type="single"
          size="lg"
          className="w-2/3"
          variant="outline"
          value="full"
          onValueChange={() => {}}
        >
          {deploymentOptions.map((option) => {
            const Icon = option.icon;
            return (
              <ToggleGroupItem className="p-4" key={option.value} value={option.value} aria-label={option.label}>
                <Icon className={`size-5 mr-2 mt-0.5 flex-shrink-0 ${"full" === option.value ? 'text-blue-500' : 'text-gray-400'}`} />
                {option.label}
              </ToggleGroupItem>
            );
          })}
        </ToggleGroup>
          <Button data-cy="deploy-button">
            {<Loader2 className="animate-spin" />} Deploy
          </Button>
      </div>

      <div className="mt-4 rounded-lg border p-4 flex gap-3 max-w-[60%]">
        <GitBranch className="size-5 shrink-0 mt-0.5 text-blue-500" />
        <div className="space-y-1">
          <p className="text-sm font-semibold">{deploymentOptions[0].detail}</p>
          <p className="text-sm text-muted-foreground">{deploymentOptions[0].description}</p>
        </div>
      </div>
    </section>
);

export default function Loading() {
  const [{ results }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },
  });

  const pathname = usePathname();

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Deployments</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        View previous deployments or trigger a new one
      </span>
      <DeployLatestSkeleton />

      <DataTable
        loading
        columns={getDeploymentTableColumns(pathname)}
        data={[]}
        initialPageSize={results || 10}
        searchPlaceholder="Search by deployment"
        searchableColumns={['name', 'status']}
        renderFilters={table => (
          <div className="flex gap-2 items-baseline">
            <DateRangePicker />
            <SelectWithOptions disabled options={statusOptions} width={100} placeholder="Filter by status" />
            <SelectWithOptions
              options={deploymentResultOptions}
              width={100}
              value={String(results || 10)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setQuery({ results: Number(newVal) });
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
