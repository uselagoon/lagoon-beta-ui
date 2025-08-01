'use client';

import { Notification } from '@/components/pages/organizations/notifications/_components/EditNotification';
import { DataTableColumnDef } from '@uselagoon/ui-library';

export const NotificationsDataTableColumns = (
  editNotificationModal: (notification: Notification) => React.ReactNode,
  deleteNotificationModal: (notification: Notification) => React.ReactNode
): DataTableColumnDef<Notification>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.type.replace(/_/g, ' ');
      return <span className="capitalize">{type}</span>;
    },
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end gap-2">
          {editNotificationModal(row.original)}
          {deleteNotificationModal(row.original)}
        </div>
      );
    },
  },
];
