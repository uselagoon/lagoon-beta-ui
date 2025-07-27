'use client';

import { ProjectsData } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';
import BreadcrumbWithSearch from '@/components/breadcrumbWithSearch/BreadcrumbWithSearch';
import TableWrapper from '@/components/tableWrapper/TableWrapper';
import { Button, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import DataTableColumns from './DataTableColumns';

export default function ProjectsPage({ data }: { data: ProjectsData }) {
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
      <BreadcrumbWithSearch />
      <TableWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
        <Button className="px-0" variant="link">
          View all projects
        </Button>

        <DataTable
          columns={DataTableColumns}
          data={data.allProjects}
          searchableColumns={['name', 'gitUrl']}
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
      </TableWrapper>
    </>
  );
}
