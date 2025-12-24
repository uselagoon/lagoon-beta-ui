'use client';

import { usePathname } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import getDeploymentTableColumns from '@/components/pages/deployments/_components/TableColumns';
import { deploymentResultOptions, statusOptions } from '@/components/pages/deployments/_components/filterValues';
import {Button, DataTable, DateRangePicker, SelectWithOptions} from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';
import {GitBranch, Zap} from "lucide-react";

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

const DeployLatestSkeleton = () => (
  <section className="py-4 px-[18px] rounded-lg border mb-6">
    <div className="mb-4">
      <h3 className="text-base font-medium">Deployment Type</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Choose how you want to deploy these changes</p>
    </div>

    <div className="flex gap-4">
      {deploymentOptions.map(option => (
        <Button
          key={option.type}
          variant={'full' === option.type ? 'default' : 'secondary'}
          className={`flex-1 flex h-auto items-start gap-3 p-4 rounded-lg border text-left transition-all`}
        >
          <div className="flex gap-3">
            <div className={`mt-0.5 flex-shrink-0 ${'full' === option.type ? 'text-blue-500' : 'text-gray-400'}`}>{option.icon}</div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{option.title}</span>
              <span className="text-xs opacity-70 font-normal">{option.description}</span>
            </div>
          </div>
        </Button>
      ))}
    </div>
    <div className="flex justify-end mt-6">
      <Button data-cy="deploy-button" disabled={false} onClick={() => {}}>
        Deploy
      </Button>
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
