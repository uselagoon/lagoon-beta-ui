import { Badge, DataTableColumnDef } from '@uselagoon/ui-library';

import { Notification } from '../notifications/_components/EditNotification';

export const OrgProjectNotificationColumns = (
  unlink: (notification: Notification) => React.ReactNode
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
      return <div className="flex gap-2">{unlink(row.original)}</div>;
    },
  },
];
