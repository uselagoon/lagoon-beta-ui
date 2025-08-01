'use client';

import { usePathname } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import DeployLatest from '@/components/pages/deployments/_components/DeployLatest';
import getDeploymentTableColumns from '@/components/pages/deployments/_components/TableColumns';
import { deploymentResultOptions, statusOptions } from '@/components/pages/deployments/_components/filterValues';
import { DataTable, DateRangePicker, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

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
      <DeployLatest skeleton />

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
