'use client';

import { OrganizationUserData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/[userSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { EditUserRole } from '@/components/editUserRole/EditUserRole';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Checkbox, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { UnlinkGroup } from './_components/UnlinkGroup';
import { UserDataTableColumns } from './_components/UserGroupsTableColumns';
import { resultsFilterValues } from './_components/filterValues';

export default function UserPage({ queryRef, orgName }: { queryRef: QueryRef<OrganizationUserData>; orgName: string }) {
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

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { userByEmailAndOrganization },
  } = useReadQuery(queryRef);

  const userGroups = userByEmailAndOrganization?.groupRoles ?? [];

  const hasDefaultGroups = userGroups.some(({ groupType }) => {
    return groupType === 'project-default-group';
  });

  const defaultGroupsCount = userGroups.filter(group => group.groupType == 'project-default-group').length;

  const tableGroups = showDefaults
    ? userGroups
    : userGroups.filter(group => group.groupType !== 'project-default-group');

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Groups for {userByEmailAndOrganization.email}</h3>

      <DataTable
        columns={UserDataTableColumns(
          userGroup => (
            <UnlinkGroup refetch={refetch} userEmail={userByEmailAndOrganization.email} userGroup={userGroup} />
          ),
          current => (
            <EditUserRole
              groupName={current.name}
              currentRole={current.role}
              email={userByEmailAndOrganization.email}
              refetch={refetch}
            />
          ),

          orgName
        )}
        data={tableGroups}
        searchableColumns={['name']}
        onSearch={searchStr => setUserQuery(searchStr)}
        initialSearch={user_query}
        initialPageSize={results || 10}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Checkbox
                id="show-defaults"
                label={`Show default groups (${defaultGroupsCount})`}
                checked={showDefaults}
                onCheckedChange={(checked) => {
                  const pageSize = table.getState().pagination.pageSize;
                  const rows = table.getRowCount();
                  const total = checked ? userGroups.length : userGroups.length - defaultGroupsCount;
                  const allSelected = pageSize === rows;
                  if (allSelected) {
                    table.setPageSize(total);
                  }
                  setQuery({
                    showDefaults: checked as boolean,
                    ...(allSelected && { results: total })
                  });
                }}
                disabled={!hasDefaultGroups}
              />
              <SelectWithOptions
                options={resultsFilterValues}
                width={100}
                value={table.getState().pagination.pageSize === table.getRowCount() ? 'all' : String(results ?? 10)}
                placeholder="Results per page"
                onValueChange={newVal => {
                  const size = newVal === 'all' ? table.getRowCount() : Number(newVal);
                  table.setPageSize(size);
                  setQuery({ results: size });
                }}
              />
            </div>
          </div>
        )}
      />
    </SectionWrapper>
  );
}
