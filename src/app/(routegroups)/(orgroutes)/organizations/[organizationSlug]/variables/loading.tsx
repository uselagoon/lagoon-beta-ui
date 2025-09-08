'use client';

import { OrgEnvVariable } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { resultsFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { VariablesDataTableColumnsNoValues } from '@/components/pages/organizations/variables/_components/VariablesDataTableColumns';
import {DataTable, SelectWithOptions, Switch} from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ search, sort, scope }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    sort: {
      defaultValue: null,
      parse: (value: string) => {
        if (['name_asc', 'name_desc', 'scope_asc', 'scope_desc'].includes(value)) return String(value);

        return null;
      },
    },

    scope: {
      defaultValue: undefined,
      parse: (value: string | undefined) => value as OrgEnvVariable['scope'],
    },
  });

  const setSearch = (val: string) => {
    setQuery({ search: val });
  };

  const setScope = (val: OrgEnvVariable['scope']) => {
    setQuery({ scope: val });
  };

  const setSort = (val: string) => {
    setQuery({ sort: val });
  };

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organization variables</h3>

        <Switch
          label="Edit values"
          id=""
          description=""
        />

        <DataTable
          loading
          columns={VariablesDataTableColumnsNoValues}
          data={[]}
          searchableColumns={['name']}
          initialPageSize={10}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <SelectWithOptions
                options={resultsFilterValues.map(o => ({ label: o.label, value: o.value }))}
                width={100}
                value={String(10)}
                placeholder="Results per page"
              />
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
