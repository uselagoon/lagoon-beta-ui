'use client';

import { OrganizationGroupData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/[groupSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddProjectToGroup } from '@/components/addProjectToGroup/AddProjectToGroup';
import { AddUserToGroup } from '@/components/addUserToGroup/AddUserToGroup';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Checkbox, DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { resultsFilterValues } from '../groups/_components/groupFilterValues';
import { GroupPageProjectColumns } from './_components/GroupPageProjectsColumns';
import GroupPageUsersColumns from './_components/GroupPageUsersColumns';
import { UnlinkGroupProject } from './_components/UnlinkGroupProject';

export default function GroupPage({ queryRef }: { queryRef: QueryRef<OrganizationGroupData> }) {
  const [{ user_results, user_query, showDefaults, project_results, project_query }, setQuery] = useQueryStates({
    user_results: {
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

    project_results: {
      defaultValue: undefined,
      parse: (value: string | undefined) => (value !== undefined ? Number(value) : undefined),
    },

    project_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setUserQuery = (str: string) => {
    setQuery({ user_query: str });
  };

  const setUserResults = (val: string) => {
    setQuery({ user_results: Number(val) });
  };

  const setProjectResults = (val: string) => {
    setQuery({ project_results: Number(val) });
  };

  const setProjectQuery = (str: string) => {
    setQuery({ project_query: str });
  };

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization, group },
  } = useReadQuery(queryRef);

  const groupMemberUsers = group.members.map(user => ({
    ...user.user,
    role: user.role,
  }));

  const hasDefaultUsers = groupMemberUsers.some(({ email }) => {
    return email.startsWith('default-user');
  });

  const filteredUsers = !showDefaults
    ? groupMemberUsers.filter(({ email, firstName, lastName }) => {
        return !(!firstName && !lastName && email.startsWith('default-user'));
      })
    : groupMemberUsers;

  const filteredProjects = organization.projects.filter(project => {
    return group.projects.every(p => p.name !== project.name);
  });

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Users of {group.name}</h3>
      <div className="gap-4 my-4">
        <AddUserToGroup groupName={group.name} refetch={refetch} />
      </div>
      <DataTable
        columns={GroupPageUsersColumns(group.name, organization.name, refetch)}
        data={filteredUsers}
        searchableColumns={['firstName', 'lastName', 'email']}
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
                disabled={!hasDefaultUsers}
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

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Projects associated to {group.name}</h3>

      <div className="gap-4 my-4">
        <AddProjectToGroup projects={filteredProjects} groupName={group.name} refetch={refetch} />
      </div>

      <DataTable
        columns={GroupPageProjectColumns(
          project => (
            <UnlinkGroupProject groupName={group.name} project={project} refetch={refetch} />
          ),
          organization.name
        )}
        data={group.projects}
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
