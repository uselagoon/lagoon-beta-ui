'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import BackupsTableColumns from '@/components/pages/backups/_components/TableColumns';
import { backupResultOptions, statusOptions } from '@/components/pages/backups/_components/filterValues';
import { DataTable, DateRangePicker, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ results }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },
  });

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Backups</h3>
        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          View backups
        </span>

        <DataTable
          loading
          columns={BackupsTableColumns(1)}
          data={[]}
          initialPageSize={results || 10}
          searchPlaceholder="Search backup"
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
    </>
  );
}
