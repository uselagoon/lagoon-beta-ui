'use client';

import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import UsersDataTableColumns from '@/components/pages/organizations/users/UsersDataTableColumns';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import { DataTable, Skeleton } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

export default function Loading() {
  const navItems = organizationNavItems('loading');

  const [{ user_query }, setQuery] = useQueryStates({
    user_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setUserQuery = (str: string) => {
    setQuery({ user_query: str });
  };

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Users</h3>
        <div className="my-6 flex gap-4">
          <span className="text mr-4">Add a user to a group</span>
          <Skeleton className="h-7 w-[100px]" />
        </div>

        <DataTable
          loading
          columns={UsersDataTableColumns(1, () => {})}
          data={[]}
          searchableColumns={['firstName', 'lastName', 'email']}
          onSearch={searchStr => setUserQuery(searchStr)}
          initialSearch={user_query}
          initialPageSize={10}
        />
      </SectionWrapper>
    </>
  );
}
