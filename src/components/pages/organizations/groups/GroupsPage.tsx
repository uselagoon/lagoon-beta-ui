'use client';

import React from 'react';

import { OrganizationGroupsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { CreateGroup } from '@/components/createGroup/CreateGroup';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Checkbox, DataTable, SelectWithOptions, TabNavigation } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import GroupsDataTableColumns from './GroupsDataTableColumns';

export default function GroupsPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationGroupsData>;
  organizationSlug: string;
}) {
  const [{ results, group_query, showSystemGroups }, setQuery] = useQueryStates({
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

  const setGroupsResults = (val: string) => {
    setQuery({ results: Number(val) });
  };

  const setShowSystemGroups = () => {
    setQuery({ showSystemGroups: !showSystemGroups });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  let orgGroups = showSystemGroups
    ? organization.groups
    : organization.groups.filter(group => group.type !== 'project-default-group');

  const hasDefaultGroups = organization.groups.some(({ type }) => {
    return type === 'project-default-group';
  });

  const existingGroupNames = orgGroups.map(g => g.name);
  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Groups</h3>
      <div className="gap-4 my-4">
        <CreateGroup organizationId={organization.id} existingGroupNames={existingGroupNames} />
      </div>
      <DataTable
        columns={GroupsDataTableColumns(organizationSlug, refetch)}
        data={orgGroups}
        searchableColumns={['name']}
        onSearch={searchStr => setGroupQuery(searchStr)}
        initialSearch={group_query}
        initialPageSize={results || 10}
        renderFilters={table => (
          <div className="flex items-center gap-4">
            <Checkbox
              id="show-system-groups"
              label="Show system groups"
              checked={showSystemGroups}
              onCheckedChange={setShowSystemGroups}
              disabled={!hasDefaultGroups}
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
    </SectionWrapper>
  );
}
