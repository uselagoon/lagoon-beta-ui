'use client';

import React, { SetStateAction } from 'react';

import {usePathname, useRouter} from 'next/navigation';

import {
  OrgGroup,
  OrganizationGroupsData,
} from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import { AddUserToGroup } from '@/components/addUserToGroup/AddUserToGroup';
import { CreateGroup } from '@/components/createGroup/CreateGroup';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';

import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';

import { useQueryStates } from 'nuqs';

import {Breadcrumb, DetailStat, TabNavigation, DataTable, SelectWithOptions, Checkbox} from "@uselagoon/ui-library";
import Link from "next/link";
import TableWrapper from "@/components/tableWrapper/TableWrapper";
import {organizationNavItems} from "@/components/shared/organizationNavItems";
import GroupsDataTableColumns from "./GroupsDataTableColumns";

export default function GroupsPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationGroupsData>;
  organizationSlug: string;
}) {
  const [{ results, group_query, group_sort, showSystemGroups }, setQuery] = useQueryStates({
    results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => {
        if (value == undefined || Number.isNaN(value)) {
          return undefined;
        }

        const num = Number(value);

        if (num > 100) {
          return 100;
        }
        return num;
      },
    },
    group_sort: {
      defaultValue: null,
      parse: (value: string | undefined) => (value !== undefined ? String(value) : null),
    },
    group_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    showSystemGroups: {
      defaultValue: false,
      parse: (value: string | undefined) => value === 'true',
      serialize: (value: boolean) => String(value),
    },
  });

  const setGroupQuery = (str: string) => {
    setQuery({ group_query: str });
  };
  const setGroupSort = (val: string) => {
    if (['name_asc', 'name_desc', 'memberCount_asc', 'memberCount_desc'].includes(val)) {
      setQuery({ group_sort: val });
    } else {
      setQuery({ group_sort: null });
    }
  };

  const setGroupsResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const setShowSystemGroups = () => {
    setQuery({ showSystemGroups: !showSystemGroups });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const path = usePathname();
  const router = useRouter();
  const navItems = organizationNavItems(organizationSlug);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  // const pathname = usePathname();

  // const client = useApolloClient();

  // const batchUpdateGroupData = (groupsWithMemberCount: Array<{ id: string; memberCount: number }>) => {
  //   client.cache.batch({
  //     update(cache) {
  //       groupsWithMemberCount.forEach(group => {
  //         const id = client.cache.identify({ __typename: 'OrgGroup', id: group.id });
  //         cache.modify({
  //           id,
  //           fields: {
  //             memberCount() {
  //               return group.memberCount;
  //             },
  //           },
  //         });
  //       });
  //     },
  //   });
  // };

  // const queryOnDataChange = async (data: Partial<OrgGroup>[]) => {
  //   const groupNames = data.map(d => d.name);

  //   const promises = groupNames.map(name => {
  //     return client.query({
  //       query: GET_SINGLE_GROUP,
  //       variables: { name, organization: organization.id },
  //       fetchPolicy: 'network-only',
  //     });
  //   });

  //   const groupsPromises = await Promise.allSettled(promises);

  //   const groupsWithMemberCount = groupsPromises
  //     .filter(pr => pr.status === 'fulfilled')
  //     .map(({ value }) => value.data.group);

  //   batchUpdateGroupData(groupsWithMemberCount);
  // };

  // const onAddUser = async (groupName: string) => {
  //   await queryOnDataChange([{ name: groupName }]);
  // };

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  let orgGroups = showSystemGroups ? organization.groups : organization.groups.filter(group => group.type !== 'project-default-group');

  const existingGroupNames = orgGroups.map(g => g.name);
  return (
    <>
        <Breadcrumb
          type="orgs"
          items={[
            {
              title: <Link href="/organizations">Organizations</Link>,
              key: "organizations"
            },
            {
              title: organization.name,
              copyText: organization.name,
              key: "org"
            },
          ]}
        />
        <TabNavigation items={navItems} pathname={path} onTabNav={(key) => router.push(`${key}`)}></TabNavigation>
        <TableWrapper>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Groups</h3>
          <DataTable
            columns={GroupsDataTableColumns(organizationSlug)}
            data={orgGroups}
            searchableColumns={['name']}
            onSearch={searchStr => setGroupQuery(searchStr)}
            initialSearch={group_query}
            initialPageSize={results || 10}
            renderFilters={table => (
              <div className="flex items-center gap-4">
                <Checkbox
                  id="show-system-groups"
                  label='Show system groups'
                  checked={showSystemGroups}
                  onCheckedChange={setShowSystemGroups}
                />
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
                  value={String(results || 10)}
                  placeholder="Results per page"
                  onValueChange={newVal => {
                    table.setPageSize(Number(newVal));
                    setGroupsResults(newVal);
                  }}
                />
              </div>
            )}
          />
        </TableWrapper>
    </>
  );
}
