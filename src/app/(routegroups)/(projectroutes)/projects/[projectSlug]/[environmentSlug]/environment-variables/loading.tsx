'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { scopeOptions } from '@/components/pages/environmentVariables/_components/filterValues';
import { ProjectEnvVarsPartialColumns } from '@/components/pages/projectVariables/_components/DataTableColumns';
import {Button, DataTable, SelectWithOptions, Switch} from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ search }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setSearch = (val: string) => {
    setQuery({ search: val });
  };

  return (
    <SectionWrapper>
      <div className="flex gap-2 items-center justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Environment variables</h3>
        <Switch
          label="Edit values"
          id=""
          description=""
        />
      </div>

      <DataTable
        loading
        columns={ProjectEnvVarsPartialColumns()}
        data={[]}
        initialSearch={search}
        onSearch={searchStr => setSearch(searchStr)}
        renderFilters={table => (
          <div className="flex gap-2 items-baseline">
            <SelectWithOptions
              options={scopeOptions}
              width={100}
              placeholder="Filter by status"
              onValueChange={newVal => {
                const statusColumn = table.getColumn('scope');
                if (statusColumn && newVal != 'all') {
                  statusColumn.setFilterValue(newVal);
                } else {
                  statusColumn?.setFilterValue(undefined);
                }
              }}
            />
          </div>
        )}
      />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-2">Project variables</h3>
      <Switch
        label="Edit values"
        id=""
        description=""
      />
      <DataTable loading columns={ProjectEnvVarsPartialColumns()} data={[]} disableExtra />
    </SectionWrapper>
  );
}
