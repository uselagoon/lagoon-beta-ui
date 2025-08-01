'use client';

import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import { AddNewVariable } from '@/components/addNewVariable/AddNewVariable';
import { DataTable, SelectWithOptions, TabNavigation } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { resultsFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { OrgEnvVariable } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import { VariablesDataTableColumns } from '@/components/pages/organizations/variables/_components/VariablesDataTableColumns';

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
    <OrgBreadcrumbs />
    <TabNavigation items={[]} pathname={""}></TabNavigation>
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organization variables</h3>
      <div className="gap-4 my-4">
        <AddNewVariable type="organization" orgName="loading" refetch={() => {}} />
      </div>  
      <DataTable
        columns={VariablesDataTableColumns((variable: OrgEnvVariable) => null, (variable: OrgEnvVariable) => null, false)}
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
