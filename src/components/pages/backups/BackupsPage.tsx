'use client';

import React from 'react';

import { BackupsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { usePendingChangesNotification } from '@/hooks/usePendingChangesNotification';
import backupChangedSubscription, { backupChangedFragment } from '@/lib/subscription/environmentBackupChanged';
import { useEnvironmentSubscription } from '@/hooks/useEnvironmentSubscription';
import { QueryRef, useReadQuery } from '@apollo/client';
import { DataTable, DateRangePicker, Select, SelectWithOptions, Table } from '@/ui-library';
import { useQueryStates } from 'nuqs';

import BackupsTableColumns from './_components/TableColumns';
import { backupResultOptions, statusOptions } from './_components/filterValues';

export default function BackupsPage({
  queryRef,
  environmentSlug,
}: {
  queryRef: QueryRef<BackupsData>;
  environmentSlug: string;
}) {
  const [{ results }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },
  });
  const [isPaginationDisabled, setIsPaginationDisabled] = React.useState(false);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  // Show notification for pending changes
  usePendingChangesNotification({
    environment,
    environmentSlug,
  });

  useEnvironmentSubscription({
    subscription: backupChangedSubscription,
    fragment: backupChangedFragment,
    fragmentName: 'BackupChangedFields',
    typename: 'Backup',
    dataKey: 'backupChanged',
    listField: 'backups',
    environmentId: environment?.id,
  });

  if (!environment) {
    return <EnvironmentNotFound kubernetesNamespaceName={environmentSlug} />;
  }

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Backups</h3>
      <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
        View backups
      </span>

      <DataTable
        columns={BackupsTableColumns(environment.id)}
        data={environment.backups}
        initialPageSize={results || 10}
        disablePagination={isPaginationDisabled}
        searchPlaceholder="Search backup"
        searchableColumns={['source']}
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
              options={backupResultOptions}
              width={100}
              value={isPaginationDisabled ? 'all' : String(results ?? 10)}
              placeholder="Results per page"
              onValueChange={newVal => {
                const size = newVal === 'all' ? table.getRowCount() : Number(newVal);
                setIsPaginationDisabled(newVal === 'all');
                table.setPageSize(size);
                setQuery({ results: size });
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
