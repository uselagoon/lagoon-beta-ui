'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { UserDataTableColumns } from '@/components/pages/organizations/user/_components/UserGroupsTableColumns';
import { resultsFilterValues } from '@/components/pages/organizations/user/_components/filterValues';
import { Checkbox, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ results, user_query, showDefaults }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },

    user_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    showDefaults: {
      defaultValue: false,
      parse: (value: string | undefined) => value === 'true',
      serialize: (value: boolean) => String(value),
    },
  });

  const setUserQuery = (str: string) => {
    setQuery({ user_query: str });
  };

  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };
  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Groups for</h3>

      <DataTable
        loading
        columns={UserDataTableColumns(
          _ => (
            <></>
          ),
          _ => (
            <></>
          ),

          ''
        )}
        data={[]}
        searchableColumns={['name']}
        onSearch={searchStr => setUserQuery(searchStr)}
        initialSearch={user_query}
        initialPageSize={results || 10}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                id="show-defaults"
                label="Show default groups"
                checked={showDefaults}
                onCheckedChange={setShowDefaults}
              />
              <SelectWithOptions
                options={resultsFilterValues}
                width={100}
                value={String(results || 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  table.setPageSize(Number(newVal));
                  setResults(newVal);
                }}
              />
            </div>
          </div>
        )}
      />
    </SectionWrapper>
  );
}
