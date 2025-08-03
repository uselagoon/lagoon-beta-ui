'use client';

import { startTransition, useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { DeploymentsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/(deployments-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, DateRangePicker, SelectWithOptions, Table } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import DeployLatest from './_components/DeployLatest';
import getDeploymentTableColumns from './_components/TableColumns';
import { deploymentResultOptions, statusOptions } from './_components/filterValues';

export default function DeploymentsPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<DeploymentsData>;
  environmentSlug: string;
}) {
  const pathname = usePathname();

  const [{ results }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },
  });

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  // polling every 20s if status needs to be checked
  useEffect(() => {
    const shouldPoll = environment?.deployments?.some(({ status }) =>
      ['new', 'pending', 'queued', 'running'].includes(status)
    );
    if (shouldPoll) {
      const intId = setInterval(() => {
        startTransition(async () => {
          await refetch();
        });
      }, 20000);

      return () => clearInterval(intId);
    }
  }, [environment?.deployments, refetch]);

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
  }
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Deployments</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        View previous deployments or trigger a new one
      </span>

      <DeployLatest environment={environment} refetch={refetch} />

      <DataTable
        columns={getDeploymentTableColumns(pathname)}
        data={environment.deployments}
        initialPageSize={results || 10}
        searchPlaceholder="Search by deployment"
        searchableColumns={['name', 'status']}
        renderFilters={table => (
          <div className="flex gap-2 items-baseline">
            <DateRangePicker
              onUpdate={values => {
                const createdAtColumn = table.getColumn('created');
                if (createdAtColumn) {
                  if (values.range.from && values.range.to) {
                    createdAtColumn.setFilterValue(values.range);
                  } else {
                    createdAtColumn.setFilterValue(undefined);
                  }
                }
              }}
              showCompare={false}
              align="center"
              rangeText="Deployment dates"
            />
            <SelectWithOptions
              options={statusOptions}
              width={100}
              placeholder="Filter by status"
              onValueChange={newVal => {
                const statusColumn = table.getColumn('status');
                if (statusColumn && newVal != 'all') {
                  statusColumn.setFilterValue(newVal);
                } else {
                  statusColumn?.setFilterValue(undefined);
                }
              }}
            />
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
