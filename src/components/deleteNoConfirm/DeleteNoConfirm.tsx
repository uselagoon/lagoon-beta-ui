import React, { FC, ReactNode, startTransition } from 'react';

import { Button, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Trash, Unlink } from 'lucide-react';
import { toast } from 'sonner';

import { capitalize } from '../utils';

/**
 * Alternative to DeleteConfirm, but users do not need to enter the name of what they're deleting.
 */
interface DeleteProps {
  deleteType: 'delete' | 'unlink' | 'remove';
  deleteItemType: string;
  deleteConfirmText?: string;
  title: ReactNode;
  deleteMessage: ReactNode;
  action: () => void | Promise<any>;
  refetch?: () => void;
  loading: boolean;
}

const DeleteNoConfirm: FC<DeleteProps> = ({
  deleteType,
  deleteItemType,
  deleteConfirmText,
  title,
  deleteMessage,
  action,
  refetch,
  loading,
}) => {
  const confirmAction = async () => {
    try {
      await action();

      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error('Error', {
        id: 'delete_error',
        description: (err as { message: string })?.message,
      });
    }
  };

  return (
    <Notification
      title={title as string}
      message={<>{deleteMessage}</>}
      cancelText="Cancel"
      confirmText={deleteConfirmText ?? 'Confirm'}
      onConfirm={confirmAction}
    >
      <Button variant="outline" disabled={loading} aria-label="delete">
        <Tooltip>
          <TooltipTrigger>
            {deleteType === 'delete' || deleteType === 'remove' ? (
              <Trash data-cy="delete-dialog" />
            ) : (
              <Unlink data-cy="delete-dialog" />
            )}
          </TooltipTrigger>
          <TooltipContent>
            {capitalize(deleteType)} {deleteItemType}
          </TooltipContent>
        </Tooltip>
      </Button>
    </Notification>
  );
};

export default DeleteNoConfirm;
