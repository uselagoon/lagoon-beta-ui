'use client';

import { SshKey } from '@/app/(routegroups)/settings/page';
import { HighlightedText } from '@/components/cancelDeployment/styles';
import {
  Button,
  DataTableColumnDef,
  Notification,
  Sheet,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@uselagoon/ui-library';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Edit2Icon, Trash2 } from 'lucide-react';

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const renderTableColumns = (
  edit: {
    action: (...args: any) => Promise<void>;
    loading: boolean;
  },
  remove: {
    action: (...args: any) => Promise<void>;
    loading: boolean;
  },
  refetch: () => void
) => {
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
            <Sheet
              sheetTrigger={<Edit2Icon />}
              sheetTitle="Edit SSH Key"
              sheetFooterButton="Save"
              sheetDescription=""
              loading={edit.loading}
              error={false}
              additionalContent={null}
              sheetFields={[
                {
                  id: 'key_name',
                  label: 'Key Name',
                  placeholder: 'Enter a name for the variable',
                  required: true,
                  inputDefault: key.name,
                },
                {
                  id: 'key_value',
                  label: 'Key Value',
                  required: true,
                  placeholder:
                    "Begins with 'ssh-rsa', 'ssh-ed25519', 'ecdsa-sha2-nistp256', 'ecdsa-sha2-nistp384', 'ecdsa-sha2-nistp521'",
                  type: 'textarea',
                  inputDefault: key.keyValue,
                },
              ]}
              buttonAction={(_, { key_name, key_value }) => {
                edit.action(key.id, key_name, key.keyType, key_value).finally(() => {
                  refetch();
                });
              }}
            />

            <Notification
              title="Delete SSH Key"
              message={deleteKeyText}
              cancelText="Cancel"
              confirmText="Confirm"
              onConfirm={() => {
                remove.action(key.id).finally(() => {
                  refetch();
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
