'use client';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddUser } from '@/components/addUserToOrg/Adduser';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Checkbox, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import UsersDataTableColumns from './UsersDataTableColumns';
import { resultsFilterValues } from './_components/filterOptions';

export default function UsersPage({
  orgId,
  queryRef,
  groups,
  organizationSlug,
}: {
  orgId: number;
  queryRef: QueryRef<OrganizationUsersData>;
  groups: {
    name: string;
  }[];
  organizationSlug: string;
}) {
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

  const setGroupsResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { users },
  } = useReadQuery(queryRef);

  const groupSelectOptions = groups.map(group => {
    return { value: group.name, label: group.name };
  });

  const filteredUsers = showDefaults ? users : users.filter(u => !u.email.startsWith('default-user'));

  return (
    <>
      <SectionWrapper>
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Users</h3>
        <div className="gap-4 my-4">
          <AddUser groupOptions={groupSelectOptions} type="multiple" />
        </div>
        <DataTable
          columns={UsersDataTableColumns(orgId, organizationSlug, refetch)}
          data={filteredUsers}
          searchableColumns={['firstName', 'lastName', 'email']}
          onSearch={searchStr => setUserQuery(searchStr)}
          initialSearch={user_query}
          initialPageSize={results || 10}
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
                  value={String(results || 10)}
                  placeholder="Results per page"
                  onValueChange={newVal => {
                    table.setPageSize(Number(newVal));
                    setGroupsResults(newVal);
                  }}
                />
              </div>
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
