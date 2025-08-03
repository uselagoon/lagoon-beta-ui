'use client';

import { OrganizationProjectData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/[projectSlug]/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { AddGroupToProject } from '@/components/addGroupToProject/AddGroupToProject';
import OrgProjectNotFound from '@/components/errors/OrgProjectNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { Checkbox, DataTable, Select, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { Notification } from '../notifications/_components/EditNotification';
import { notificationTypeOptions } from '../notifications/_components/filterOptions';
import { OrgProjectGroupColumns } from './OrgProjectGroupColumns';
import { OrgProjectNotificationColumns } from './OrgProjectNotificationColumns';
import { AddNotificationToProject } from './_components/AddNotificationToProject';
import { UnlinkGroup } from './_components/UnlinkGroup';
import { UnlinkNotification } from './_components/UnlinkNotification';
import { transformNotifications } from './_components/transformNotifications';

export default function OrgProjectPage({
  queryRef,
  projectSlug,
}: {
  queryRef: QueryRef<OrganizationProjectData>;
  projectSlug: string;
}) {
  const [{ group_query, showDefaults, notification_query }, setQuery] = useQueryStates({
    group_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    showDefaults: {
      defaultValue: false,
      parse: (value: string | undefined) => value === 'true',
      serialize: (value: boolean) => String(value),
    },

    notification_type: {
      defaultValue: undefined,
      parse: (value: string | undefined) => value as 'slack' | 'rocketChat' | 'email' | 'webhook' | 'teams',
    },
    notification_query: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
  });

  const setGroupQuery = (str: string) => {
    setQuery({ group_query: str });
  };

  const setNotificationQuery = (str: string) => {
    setQuery({ notification_query: str });
  };

  const setShowDefaults = () => {
    setQuery({ showDefaults: !showDefaults });
  };

  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization, project },
  } = useReadQuery(queryRef);

  if (!project) {
    return <OrgProjectNotFound projectName={projectSlug} />;
  }

  const projectNotificationsByType = transformNotifications(project.notifications);

  const filteredGroups = organization.groups.filter(group => {
    return project.groups.every(p => p.name !== group.name);
  });

  const projectGroups = showDefaults
    ? project.groups
    : project.groups.filter(group => group.type !== 'project-default-group');

  const linkedNotifications = {
    slacks: (projectNotificationsByType.slacks || []) as {
      id: string;
      name: string;
      channel: string;
      webhook: String;
    }[],
    webhooks: (projectNotificationsByType.webhooks || []) as { id: string; name: string; webhook: String }[],
    rocketChats: (projectNotificationsByType.rocketChats || []) as {
      id: string;
      name: string;
      channel: string;
      webhook: String;
    }[],
    emails: (projectNotificationsByType.emails || []) as { id: string; name: string; emailAddress: string }[],
    teams: (projectNotificationsByType.teams || []) as { id: string; name: string; webhook: String }[],
  } as const;

  const allNotifications = [
    ...organization.slacks,
    ...organization.webhook,
    ...organization.rocketchats,
    ...organization.emails,
    ...organization.teams,
  ];

  const notifications = [
    ...(linkedNotifications.slacks?.map(({ id, name, webhook, channel }) => ({
      id,
      name,
      webhook,
      channel,
      type: 'slack',
    })) ?? []),
    ...(linkedNotifications.rocketChats?.map(({ id, name, channel, webhook }) => ({
      id,
      name,
      webhook,
      channel,
      type: 'rocketchat',
    })) ?? []),
    ...(linkedNotifications.teams?.map(({ id, name, webhook }) => ({
      id,
      name,
      webhook,
      type: 'teams',
    })) ?? []),
    ...(linkedNotifications.emails?.map(({ id, name, emailAddress }) => ({
      id,
      name,
      emailAddress,
      type: 'email',
    })) ?? []),
    ...(linkedNotifications.webhooks?.map(({ id, name, webhook }) => ({
      id,
      name,
      webhook,
      type: 'webhook',
    })) ?? []),
  ];

  return (
    <SectionWrapper>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Groups</h3>

      <AddGroupToProject projectName={project.name} groups={filteredGroups} refetch={refetch} />

      <DataTable
        columns={OrgProjectGroupColumns(
          group => (
            <UnlinkGroup projectName={project.name} group={group} refetch={refetch} />
          ),
          organization.name,
          refetch
        )}
        data={projectGroups}
        searchableColumns={['name']}
        onSearch={searchStr => setGroupQuery(searchStr)}
        initialSearch={group_query}
        renderFilters={_ => (
          <div className="flex items-center justify-between">
            <Checkbox
              id="show-system-groups"
              label="Show system groups"
              checked={showDefaults}
              onCheckedChange={setShowDefaults}
            />
          </div>
        )}
      />

      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mb-4">Notifications</h3>

      <AddNotificationToProject
        projectName={project.name}
        allNotifications={allNotifications}
        linkedNotifications={linkedNotifications}
      />

      <DataTable
        columns={OrgProjectNotificationColumns(notification => (
          <UnlinkNotification
            notification={notification as Notification}
            projectName={project.name}
            refetch={refetch}
          />
        ))}
        data={notifications as Notification[]}
        searchableColumns={['name']}
        onSearch={searchStr => setNotificationQuery(searchStr)}
        initialSearch={notification_query}
        renderFilters={table => (
          <div className="flex items-center justify-between">
            <SelectWithOptions
              options={notificationTypeOptions}
              placeholder="Filter by type"
              onValueChange={newVal => {
                const typeColumn = table.getColumn('type');
                setQuery({ notification_type: newVal as any });
                if (typeColumn && newVal != 'all') {
                  typeColumn.setFilterValue(newVal);
                } else {
                  typeColumn?.setFilterValue(undefined);
                }
              }}
            />
          </div>
        )}
      />
    </SectionWrapper>
  );
}
