'use client';

import { useRouter } from 'next/navigation';

import { ProjectsData } from '@/app/(routegroups)/(projectroutes)/projects/(projects-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { ProjectBreadcrumbs } from '@/components/breadcrumbs/ProjectBreadcrumbs';
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

  const router = useRouter();

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };
  const setResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  return (
    <>
      <ProjectBreadcrumbs />
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>
        <Button className="px-0" variant="link">
          View all projects
        </Button>

        <DataTable
          columns={DataTableColumns}
          data={data.allProjects}
          searchableColumns={['project_name', 'production_route', 'gitUrl']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          onRowClick={row => {
            const { name } = row.original;
            router.push(`/projects/${name}`);
          }}
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
