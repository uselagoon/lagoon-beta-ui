'use client';

import { startTransition, useEffect } from 'react';

import { BackupsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import EnvironmentNotFound from '@/components/errors/EnvironmentNotFound';
import { usePendingChangesNotification } from '@/hooks/usePendingChangesNotification';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, DateRangePicker, Select, SelectWithOptions, Table } from '@uselagoon/ui-library';
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
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { environment },
  } = useReadQuery(queryRef);

  // Show notification for pending changes
  usePendingChangesNotification({
    environment,
    environmentSlug,
  });

  // polling every 20s if status needs to be checked
  useEffect(() => {
    // only poll if any backup has a 'restore.status' of 'pending'
    const shouldPoll = environment?.backups?.some(({ restore }) => restore?.status === 'pending');

    if (shouldPoll) {
      const intId = setInterval(() => {
        startTransition(async () => {
          await refetch();
        });
      }, 20000);
      return () => clearInterval(intId);
    }
  }, [environment?.backups, refetch]);

  if (!environment) {
    return <EnvironmentNotFound openshiftProjectName={environmentSlug} />;
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
