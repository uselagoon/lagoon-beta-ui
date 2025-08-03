'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { GroupPageProjectColumns } from '@/components/pages/organizations/group/_components/GroupPageProjectsColumns';
import GroupPageUsersColumns from '@/components/pages/organizations/group/_components/GroupPageUsersColumns';
import { resultsFilterValues } from '@/components/pages/organizations/groups/_components/groupFilterValues';
import { Checkbox, DataTable, SelectWithOptions, Skeleton } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const [{ user_results, user_query, showDefaults, project_results, project_query }, setQuery] = useQueryStates({
    user_results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },

    user_sort: {
      defaultValue: null,
      parse: (value: string | undefined) => (value !== undefined ? String(value) : null),
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
    project_results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },

    project_sort: {
      defaultValue: null,
      parse: (value: string | undefined) => (value !== undefined ? String(value) : null),
    },

    project_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setUserQuery = (str: string) => {
    setQuery({ user_query: str });
  };

  const setProjectResults = (val: string) => {
    setQuery({ project_results: Number(val) });
  };

  const setUserResults = (val: string) => {
    setQuery({ user_results: Number(val) });
  };

  const setProjectQuery = (str: string) => {
    setQuery({ project_query: str });
  };

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Users</h3>
      <div className="gap-4 my-4">
        <Skeleton className="h-8 w-[100px]" />
      </div>
      <DataTable
        loading
        columns={GroupPageUsersColumns('', '', () => {})}
        data={[]}
        onSearch={searchStr => setUserQuery(searchStr)}
        initialSearch={user_query}
        initialPageSize={user_results || 10}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                id="show-defaults"
                label="Show default users"
                checked={showDefaults}
                onCheckedChange={setShowDefaults}
              />
              <SelectWithOptions
                options={resultsFilterValues}
                width={100}
                value={String(user_results || 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  table.setPageSize(Number(newVal));
                  setUserResults(newVal);
                }}
              />
            </div>
          </div>
        )}
      />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects</h3>

      <div className="gap-4 my-4">
        <Skeleton className="h-8 w-[100px]" />
      </div>

      <DataTable
        loading
        columns={GroupPageProjectColumns(
          _ => (
            <></>
          ),
          ''
        )}
        data={[]}
        onSearch={searchStr => setProjectQuery(searchStr)}
        initialSearch={project_query}
        initialPageSize={project_results || 10}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <SelectWithOptions
                options={resultsFilterValues}
                width={100}
                value={String(project_results || 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  table.setPageSize(Number(newVal));
                  setProjectResults(newVal);
                }}
              />
            </div>
          </div>
        )}
      />
    </SectionWrapper>
  );
}
