import React, { FC, ReactNode, startTransition, useState } from 'react';

import { Button, Input, Label, Notification, Tooltip, TooltipContent, TooltipTrigger } from '@/ui-library';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

import { HighlightedText } from '../cancelDeployment/styles';

interface DeleteProps {
  deleteType: string;
  deleteName: string;
  deleteMessage?: string | ReactNode;
  icon?: ReactNode;
  renderAsButton?: boolean;
  action: () => void | Promise<any>;
  refetch?: () => void;
  loading: boolean;
  data?: Record<string, any> | null;
  buttonText?: string;
  deleteText?: string;
}

/**
 * Confirms the deletion of the specified name and type.
 */

export const DeleteConfirm: FC<DeleteProps> = ({
  deleteType,
  deleteName,
  deleteMessage,
  icon,
  loading,
  action,
  refetch,
  data,
  renderAsButton = true,
  buttonText = '',
  deleteText = '',
}) => {
  const [inputValue, setInputValue] = useState('');

  const confirmDisabled = inputValue !== deleteName || loading;

  const confirmAction = async () => {
    try {
      await action();
      startTransition(() => {
        refetch && refetch();
      });
    } catch (err) {
      console.error(err);
      toast.error('Error', {
        id: 'cancel_error',
        description: (err as { message: string })?.message,
      });
    }
  };

  const content = icon ? icon : buttonText ? buttonText : <Trash data-cy="delete-variable" />;

  const trigger = (
    <Tooltip>
      {renderAsButton ? (
        <TooltipTrigger>{content}</TooltipTrigger>
      ) : (
        <TooltipTrigger asChild>
          <span className="flex items-center">{content}</span>
        </TooltipTrigger>
      )}
      <TooltipContent>Delete {deleteType}</TooltipContent>
    </Tooltip>
  );

  return (
    <Notification
      title="Confirm deletion"
      message={
        <>
          {deleteMessage ? (
            <p>{deleteMessage}</p>
          ) : (
            <p>
              This will delete all resources associated with the {deleteType}{' '}
              <HighlightedText>{deleteName}</HighlightedText> and cannot be undone. Make sure this is something you
              really want to do!
            </p>
          )}

          {deleteText ? <p>{deleteText}</p> : <p>Type the name of the {deleteType} to confirm.</p>}

          <div className="grid gap-2">
            <Label htmlFor="variable_name" className="sr-only">
              Variable name
            </Label>
            <Input
              label=""
              data-cy="delete-confirm-input"
              id="variable_name"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
            />
          </div>
        </>
      }
      cancelText="Cancel"
      confirmText={data ? 'Success' : 'Delete'}
      confirmDisabled={confirmDisabled}
      onConfirm={confirmAction}
    >
      {renderAsButton ? (
        <Button variant="outline" disabled={loading} aria-label="delete">
          {trigger}
        </Button>
      ) : (
        <div className="flex items-center self-center cursor-pointer" aria-label="delete">
          {trigger}
        </div>
      )}
    </Notification>
  );
};

export default DeleteConfirm;
