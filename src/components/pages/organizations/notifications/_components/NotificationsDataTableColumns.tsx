'use client';

import { Notification } from '@/components/pages/organizations/notifications/_components/EditNotification';
import {DataTableColumnDef, Label} from '@uselagoon/ui-library';
import Image from 'next/image';
import {Mail, Webhook} from "lucide-react";

const setNotificationIcon = ({type}: {type: string}) => {
  switch (type) {
    case 'slack':
      return <Image src="/notification-icons/Slack.svg" width={24} height={24} alt="slack" />;
    case 'rocketchat':
      return <Image src="/notification-icons/RocketChat.svg" width={24} height={24} alt="rocketchat" />;
    case 'email':
      return <Mail size={24} color={"rgb(76, 132, 255)"}/>;
    case 'webhook':
      return <Webhook size={24} color={"rgb(76, 132, 255)"}/>;
    case 'teams':
      return <Image src="/notification-icons/Teams.svg" width={24} height={24} alt="teams" />;
    default:
      return 'bell';
  }
}

export const NotificationsDataTableColumns = (
  editNotificationModal: (notification: Notification) => React.ReactNode,
  deleteNotificationModal: (notification: Notification) => React.ReactNode
): DataTableColumnDef<Notification>[] => [
  {
    accessorKey: 'name',
    header: 'Name',
    width: '30%',
  },
  {
    accessorKey: 'type',
    header: () => <div className="text-center">Type</div>,
    width: '40%',
    filterFn: 'equals',
    cell: ({ row }) => {
      const type = row.original.type.replace(/_/g, ' ');
      return (
        <div className="flex items-center justify-center gap-2">
          {setNotificationIcon({type: type})}
          <Label className="uppercase">{type}</Label>
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div>Actions</div>,
    width: '10%',
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
