'use client';

import TableWrapper from '@/components/tableWrapper/TableWrapper';
import { Button, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';
import OrganizationsTableColumnsWithCheckbox from "@/components/pages/organizations/DataTableColumns";

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
        <TableWrapper>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Organizations</h3>
          <Button className="px-0" variant="link">
            View all organizations
          </Button>
          <DataTable
              loading
              columns={OrganizationsTableColumnsWithCheckbox}
              data={[]}
              searchableColumns={['name']}
              onSearch={searchStr => setSearch(searchStr)}
              initialSearch={String(search)}
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
        </TableWrapper>
      </>
  );
}
