'use client';

import { useQueryStates } from 'nuqs';
import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import { TabNavigation } from '@uselagoon/ui-library';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import UsersDataTableColumns from '@/components/pages/organizations/users/UsersDataTableColumns';
import { DataTable } from '@uselagoon/ui-library';

export default function Loading() {
  const navItems = organizationNavItems("loading");

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
    <OrgBreadcrumbs />
    <TabNavigation items={navItems} pathname={""}></TabNavigation>
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Users</h3>
      <DataTable
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
