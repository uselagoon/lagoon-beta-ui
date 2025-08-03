'use client';

import { OrganizationNotificationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/notifications/page';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { AddNotification } from './_components/AddNotification';
import { DeleteNotification } from './_components/DeleteNotification';
import { EditNotification, Notification } from './_components/EditNotification';
import { NotificationsDataTableColumns } from './_components/NotificationsDataTableColumns';
import { notificationTypeOptions } from './_components/filterOptions';

type NotificationType = 'slack' | 'rocketchat' | 'email' | 'webhook' | 'teams';

export default function NotificationsPage({
  queryRef,
  organizationSlug,
}: {
  queryRef: QueryRef<OrganizationNotificationData>;
  organizationSlug: string;
}) {
  const { refetch } = useQueryRefHandlers(queryRef);

  const {
    data: { organization },
  } = useReadQuery(queryRef);

  if (!organization) {
    return <OrganizationNotFound orgName={organizationSlug} />;
  }

  const [{ search, type }, setQuery] = useQueryStates({
    search: {
      defaultValue: '',
      parse: (value: string | undefined) => (value !== undefined ? String(value) : ''),
    },
    type: {
      defaultValue: null,
      parse: (value: string | undefined) => (value !== null ? (value as NotificationType) : null),
    },
  });

  const setSearch = (val: string) => {
    setQuery({ search: val });
  };

  const setType = (val: string) => {
    if (val === 'all') {
      setQuery({ type: null });
    } else {
      setQuery({ type: val as NotificationType });
    }
  };

  const allNotifications: Notification[] = [
    ...(organization.slacks?.map(notification => ({ ...notification, type: 'slack' as const })) || []),
    ...(organization.rocketchats?.map(notification => ({ ...notification, type: 'rocketchat' as const })) || []),
    ...(organization.emails?.map(notification => ({ ...notification, type: 'email' as const })) || []),
    ...(organization.teams?.map(notification => ({ ...notification, type: 'teams' as const })) || []),
    ...(organization.webhook?.map(notification => ({ ...notification, type: 'webhook' as const })) || []),
  ];

  const filteredNotifications = type ? allNotifications.filter(n => n.type === type) : allNotifications;

  return (
    <>
      <SectionWrapper>
        <div className="flex flex-col items-start gap-4 mb-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notifications</h3>
          <AddNotification orgId={organization.id} refetch={refetch} />
        </div>

        <DataTable
          columns={NotificationsDataTableColumns(
            notification => (
              <EditNotification notification={notification as Notification} refetch={refetch} />
            ),
            notification => (
              <DeleteNotification notification={notification as Notification} refetch={refetch} />
            )
          )}
          data={filteredNotifications}
          searchableColumns={['name']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <SelectWithOptions
                options={notificationTypeOptions}
                placeholder="Filter by type"
                onValueChange={newVal => {
                  const typeColumn = table.getColumn('type');
                  setType(newVal);
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
    </>
  );
}
