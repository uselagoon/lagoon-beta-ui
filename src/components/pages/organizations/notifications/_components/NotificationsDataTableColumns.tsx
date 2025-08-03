'use client';

import { Notification } from '@/components/pages/organizations/notifications/_components/EditNotification';
import { Badge, DataTableColumnDef } from '@uselagoon/ui-library';

export const NotificationsDataTableColumns = (
  editNotificationModal: (notification: Notification) => React.ReactNode,
  deleteNotificationModal: (notification: Notification) => React.ReactNode
): DataTableColumnDef<Notification>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    width: '60%',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    width: '30%',
    filterFn: 'equals',
    cell: ({ row }) => {
      const type = row.original.type.replace(/_/g, ' ');
      return (
        <Badge>
          <span className="uppercase">{type}</span>
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          {editNotificationModal(row.original)}
          {deleteNotificationModal(row.original)}
        </div>
      );
    },
  },
];

export const NotificationsDataTableColumnsLoading = [
  {
    accessorKey: 'name',
    header: 'Name',
    width: '60%',
  },
  {
    accessorKey: 'type',
    header: 'Type',
    width: '30%',
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
  },
] as DataTableColumnDef<Notification>[];
