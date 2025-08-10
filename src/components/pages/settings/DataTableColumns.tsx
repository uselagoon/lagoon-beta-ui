'use client';

import { SshKey } from '@/app/(routegroups)/settings/(ssh-keys)/page';
import { HighlightedText } from '@/components/cancelDeployment/styles';
import {
  Button,
  DataTableColumnDef,
  Notification,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Trash2 } from 'lucide-react';

import { EditSshSheet } from './EditSshSheet';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const renderTableColumns = (remove: {
  action: (...args: any) => Promise<void>;
  loading: boolean;
  refetchAction: () => void;
}) => {
  return [
    {
      accessorKey: 'name',
      header: 'Key ID - Name',
      width: '15%',
      cell: ({ row }) => {
        const { id, name } = row.original;

        return `${id} - ${name}`;
      },
    },
    {
      accessorKey: 'keyType',
      header: 'Type',
      width: '10%',
    },
    {
      accessorKey: 'keyFingerprint',
      header: 'Fingerprint',
      width: '30%',
    },
    {
      header: 'Created',
      accessorKey: 'created',
      width: '17.4%',
      cell: ({ row }) => {
        const createdDate = row.original.created;

        return createdDate ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(createdDate).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(createdDate).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Last Used',
      accessorKey: 'lastUsed',
      width: '17.4%',
      cell: ({ row }) => {
        const lastUsed = row.original?.lastUsed;
        return lastUsed ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(lastUsed).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(lastUsed).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          'Never'
        );
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const key = row.original;

        const deleteKeyText = (
          <>
            This action will delete the SSH key <HighlightedText>{key.name}</HighlightedText> and cannot be undone.
          </>
        );

        return (
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger>
                <EditSshSheet name={key.name} id={key.id} keyType={key.keyType} keyValue={key.keyValue} />
              </TooltipTrigger>
              <TooltipContent>Edit Key</TooltipContent>
            </Tooltip>

            <Notification
              title="Delete SSH Key"
              message={deleteKeyText}
              cancelText="Cancel"
              confirmText="Confirm"
              onConfirm={() => {
                remove.action(key.id).finally(() => {
                  remove.refetchAction();
                });
              }}
            >
              <Button variant="outline" disabled={remove.loading}>
                <Trash2 data-cy="delete-key" />
              </Button>
            </Notification>
          </div>
        );
      },
    },
  ] as DataTableColumnDef<SshKey>[];
};

export const renderSshColumnsNoActions = () => {
  return [
    {
      accessorKey: 'name',
      header: 'Key ID - Name',
      width: '15%',
      cell: ({ row }) => {
        const { id, name } = row.original;

        return `${id} - ${name}`;
      },
    },
    {
      accessorKey: 'keyType',
      header: 'Type',
      width: '10%',
    },
    {
      accessorKey: 'keyFingerprint',
      header: 'Fingerprint',
      width: '30%',
    },
    {
      header: 'Created',
      accessorKey: 'created',
      width: '17.4%',
      cell: ({ row }) => {
        const createdDate = row.original.created;

        return createdDate ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(createdDate).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(createdDate).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          '-'
        );
      },
    },
    {
      header: 'Last Used',
      accessorKey: 'lastUsed',
      width: '17.4%',
      cell: ({ row }) => {
        const lastUsed = row.original?.lastUsed;
        return lastUsed ? (
          <Tooltip>
            <TooltipTrigger>{dayjs.utc(lastUsed).local().fromNow()}</TooltipTrigger>
            <TooltipContent>{dayjs.utc(lastUsed).local().format('YYYY-MM-DD HH:mm:ss')}</TooltipContent>
          </Tooltip>
        ) : (
          'Never'
        );
      },
    },
  ] as DataTableColumnDef<SshKey>[];
};
