'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import AlldeploymentsTableColumns from '@/components/pages/allDeployments/TableColumns';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ results, search }, setQuery] = useQueryStates({
    results: {
      defaultValue: 10,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 10),
    },
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };
  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };
  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">All Deployments</h3>
        <DataTable
          loading
          columns={AlldeploymentsTableColumns}
          data={[]}
          searchableColumns={['project_name', 'status', 'priority', 'name', 'openshift_name', 'environment_name']}
          searchPlaceholder="Search deployments"
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={results}
          renderFilters={table => (
            <SelectWithOptions
              options={[
                {
                  label: '10 results per page',
                  value: 10,
                },
                {
                  label: '20 results per page',
                  value: 20,
                },
                {
                  label: '50 results per page',
                  value: 50,
                },
              ]}
              width={100}
              value={String(results)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setResults(newVal);
              }}
            />
          )}
        />
      </SectionWrapper>
    </>
  );
}
