'use client';

import { usePathname } from 'next/navigation';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import getProjectEnvsTableColumns from '@/components/pages/environments/ProjectEnvsTableColumns';
import { RouterType } from '@/components/types';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const pathname = usePathname();

  const [{ search, env_count }, setQuery] = useQueryStates({
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },

    env_count: {
      defaultValue: 5,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : 5),
    },
  });

  const setSearch = (str: string) => {
    setQuery({ search: str });
  };
  const setEnvCount = (val: string) => {
    setQuery({ env_count: Number(val) });
  };

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Environments</h3>
        <span className="text-[#737373] inline-block font-sans font-normal not-italic text-sm leading-normal tracking-normal mb-6">
          A list of all available environments for this project
        </span>

        <DataTable
          loading
          columns={getProjectEnvsTableColumns(pathname)}
          data={[]}
          searchableColumns={['title', 'region', 'deployType']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          initialPageSize={env_count}
          renderFilters={table => (
            <SelectWithOptions
              options={[
                {
                  label: '5 results per page',
                  value: 5,
                },
                {
                  label: '10 results per page',
                  value: 10,
                },
                {
                  label: '20 results per page',
                  value: 20,
                },
              ]}
              width={100}
              value={String(env_count)}
              placeholder="Results per page"
              onValueChange={newVal => {
                table.setPageSize(Number(newVal));
                setEnvCount(newVal);
              }}
            />
          )}
        />
      </SectionWrapper>
    </>
  );
}
