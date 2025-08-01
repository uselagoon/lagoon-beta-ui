'use client';

import { usePathname, useRouter } from 'next/navigation';

import { OrganizationNotificationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/notifications/page';
import { OrgBreadcrumbs } from '@/components/breadcrumbs/OrgBreadcrumbs';
import OrganizationNotFound from '@/components/errors/OrganizationNotFound';
import SectionWrapper from '@/components/SectionWrapper/SectionWrapper';
import { organizationNavItems } from '@/components/shared/organizationNavItems';
import { QueryRef, useQueryRefHandlers, useReadQuery } from '@apollo/client';
import { DataTable, SelectWithOptions, TabNavigation } from '@uselagoon/ui-library';
import { useQueryStates } from 'nuqs';

import { AddNotification } from './_components/AddNotification';
import { DeleteNotification } from './_components/DeleteNotification';
import { EditNotification, Notification } from './_components/EditNotification';
import { notificationTypeOptions } from './_components/filterOptions';
import { NotificationsDataTableColumns } from './_components/NotificationsDataTableColumns';

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
    if (val === '') {
      setQuery({ type: null });
    } else {
      setQuery({ type: val as NotificationType });
    }
  };

  const navItems = organizationNavItems(organizationSlug);
  const path = usePathname();
  const router = useRouter();

  const allNotifications: Notification[] = [
    ...(organization.slacks?.map(notification=> ({ ...notification, type: 'slack' as const })) || []),
    ...(organization.rocketchats?.map(notification=> ({ ...notification, type: 'rocketchat' as const })) || []),
    ...(organization.emails?.map(notification=> ({ ...notification, type: 'email' as const })) || []),
    ...(organization.teams?.map(notification=> ({ ...notification, type: 'teams' as const })) || []),
    ...(organization.webhook?.map(notification=> ({ ...notification, type: 'webhook' as const })) || []),
  ];

  const filteredNotifications = type ? allNotifications.filter(n => n.type === type) : allNotifications;

  return (
    <>
      <OrgBreadcrumbs />
      <TabNavigation items={navItems} pathname={path} onTabNav={key => router.push(`${key}`)}></TabNavigation>
      <SectionWrapper>
        <div className="flex items-center justify-between mb-4">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">Notifications</h3>
          <AddNotification orgId={organization.id} refetch={refetch} />
        </div>

        <DataTable
          columns={NotificationsDataTableColumns(
            notification => <EditNotification notification={notification as Notification} refetch={refetch} />,
            notification => <DeleteNotification notification={notification as Notification} refetch={refetch} />
          )}
          data={filteredNotifications}
          searchableColumns={['name']}
          onSearch={searchStr => setSearch(searchStr)}
          initialSearch={search}
          renderFilters={table => (
            <div className="flex items-center justify-between">
              <SelectWithOptions
                options={notificationTypeOptions.filter(o => o.value !== null) as { label: string; value: string }[]}
                value={type || ''}
                placeholder="Filter by type"
                onValueChange={newVal => {
                  setType(newVal);
                }}
              />
            </div>
          )}
        />
      </SectionWrapper>
    </>
  );
}
