import { startTransition } from 'react';

import {
  UPDATE_NOTIFICATION_EMAIL,
  UPDATE_NOTIFICATION_ROCKETCHAT,
  UPDATE_NOTIFICATION_SLACK,
  UPDATE_NOTIFICATION_TEAMS,
  UPDATE_NOTIFICATION_WEBHOOK,
} from '@/lib/mutation/organizations/updateNotification';
import { ApolloError, DocumentNode, useMutation } from '@apollo/client';
import { Sheet, Tooltip, TooltipContent, TooltipTrigger } from '@uselagoon/ui-library';
import { Edit2Icon } from 'lucide-react';
import { toast } from 'sonner';

export type Notification = {
  name: string;
  channel?: string;
  webhook?: string;
  emailAddress?: string;
  type: 'slack' | 'rocketchat' | 'teams' | 'email' | 'webhook';
};

type EditNotificationProps = {
  notification: Notification;
  refetch: () => void;
};

export const getNotificationMutation = (type: string) => {
  switch (type) {
    case 'slack':
      return UPDATE_NOTIFICATION_SLACK;
    case 'webhook':
      return UPDATE_NOTIFICATION_WEBHOOK;
    case 'rocketchat':
      return UPDATE_NOTIFICATION_ROCKETCHAT;
    case 'email':
      return UPDATE_NOTIFICATION_EMAIL;
    case 'teams':
      return UPDATE_NOTIFICATION_TEAMS;
  }
};

export const EditNotification: React.FC<EditNotificationProps> = ({ notification, refetch }) => {
  const mutationToUse = getNotificationMutation(notification.type) as DocumentNode;

  const [updateNotification, { loading }] = useMutation(mutationToUse, {
    variables: {
      name: notification.name,
    },
    onError: err => {
      console.error(err);
      toast.error('Error updating notification', {
        description: err.message,
      });
    },
  });

  const handleUpdateNotification = (name: string, channel?: string, webhook?: string, email?: string) => {
    return updateNotification({
      variables: {
        patch: {
          ...(name ? { name } : {}),
          ...(channel ? { channel } : {}),
          ...(webhook ? { webhook } : {}),
          ...(email ? { emailAddress: email } : {}),
        },
      },
    }).then(() => {
      startTransition(() => {
        refetch();
      });
      toast.success('Notification updated successfully!');
    });
  };

  const getSheetFields = () => {
    const fields = [
      {
        id: 'name',
        label: 'Name',
        placeholder: 'Enter notification name',
        inputDefault: notification.name,
        required: true,
      },
    ];

    if (notification.type === 'email') {
      fields.push({
        id: 'email',
        label: 'Email Address',
        placeholder: 'Enter email',
        inputDefault: notification.emailAddress || '',
        required: true,
      });
    } else {
      fields.push({
        id: 'webhook',
        label: 'Webhook',
        placeholder: 'Enter Webhook',
        inputDefault: notification.webhook || '',
        required: true,
      });
    }

    if (notification.type === 'slack' || notification.type === 'rocketchat' || notification.type === 'teams') {
      fields.push({
        id: 'channel',
        label: 'Channel',
        placeholder: 'Enter channel',
        inputDefault: notification.channel || '',
        required: true,
      });
    }

    return fields;
  };

  return (
    <Tooltip>
      <TooltipTrigger>
        <Sheet
          data-cy="edit-notification"
          sheetTrigger={<Edit2Icon />}
          sheetTitle="Edit Notification"
          sheetFooterButton="Update"
          sheetDescription={`Edit the ${notification.type} notification settings`}
          loading={loading}
          error={false}
          additionalContent={null}
          sheetFields={getSheetFields()}
          buttonAction={(_, values) => {
            const { name, channel, webhook, email } = values;
            handleUpdateNotification(name, channel, webhook, email);
          }}
        />
        </TooltipTrigger>
      <TooltipContent>Edit Notification</TooltipContent>
    </Tooltip>
  );
};
