import { FC, startTransition, useState, useCallback } from 'react';

import {
  ADD_EMAIL_NOTIFICATION,
  ADD_MICROSOFTTEAMS_NOTIFICATION,
  ADD_ROCKETCHAT_NOTIFICATION,
  ADD_SLACK_NOTIFICATION,
  ADD_WEBHOOK_NOTIFICATION,
} from '@/lib/mutation/organizations/addNotification';
import { ApolloError, useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Sheet } from '@uselagoon/ui-library';

type AddNotificationProps = {
  orgId: number;
  refetch: () => void;
};

/**
 * Add notification to an organization.
 */

export const AddNotification: FC<AddNotificationProps> = ({ orgId, refetch }) => {
  const [newNotificationType, setNewNotificationType] = useState<
    'slack' | 'rocketchat' | 'teams' | 'email' | 'webhook' | undefined
  >();

  const [addSlack] = useMutation(ADD_SLACK_NOTIFICATION);
  const [addRocketChat] = useMutation(ADD_ROCKETCHAT_NOTIFICATION);
  const [addEmail] = useMutation(ADD_EMAIL_NOTIFICATION);
  const [addTeams] = useMutation(ADD_MICROSOFTTEAMS_NOTIFICATION);
  const [addWebhook] = useMutation(ADD_WEBHOOK_NOTIFICATION);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const newNotificationOptions = [
    { label: 'Slack', value: 'slack' },
    { label: 'RocketChat', value: 'rocketchat' },
    { label: 'Microsoft Teams', value: 'teams' },
    { label: 'Email', value: 'email' },
    { label: 'Webhook', value: 'webhook' },
  ];

  const getAction = async (notificationType: string, {
    name,
    channel,
    webhook,
    email,
  }: {
    name: string;
    channel?: string;
    webhook?: string;
    email?: string;
  }) => {
    switch (notificationType) {
      case 'slack':
        return await addSlack({
          variables: {
            organization: orgId,
            name,
            channel: channel,
            webhook: webhook,
          },
        });
      case 'rocketchat':
        return await addRocketChat({
          variables: {
            organization: orgId,
            name,
            channel: channel,
            webhook: webhook,
          },
        });
      case 'email':
        return await addEmail({
          variables: {
            organization: orgId,
            name,
            emailAddress: email,
          },
        });
      case 'teams':
        return await addTeams({
          variables: {
            organization: orgId,
            name,
            webhook: webhook,
          },
        });
      case 'webhook':
        return await addWebhook({
          variables: {
            organization: orgId,
            name,
            webhook: webhook,
          },
        });
      default:
        throw new Error('wrong notification type');
    }
  };

  const handleAddNotification = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, values: any) => {
    const { name, channel, webhook, email, notification_type } = values;

    const mutationVars = { name, channel, webhook, email };

    try {
      setLoading(true);
      setError(false);

      await getAction(notification_type, mutationVars);

      startTransition(() => {
        (refetch ?? (() => {}))();
      });

      toast.success('Notification added successfully!', {
        position: 'top-center',
      });
    } catch (err) {
      console.error(err);
      setError(true);
      toast.error('There was a problem adding a notification.', {
        position: 'top-center',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = useCallback((fieldId: string, value: string | boolean) => {
    if (fieldId === 'notification_type') {
      setNewNotificationType(value as typeof newNotificationType);
    }
  }, []);

  const getSheetFields = useCallback(() => {
    const baseFields = [
      {
        id: 'notification_type',
        label: 'Select Service',
        type: 'select' as const,
        placeholder: 'Make a selection',
        required: true,
        options: newNotificationOptions,
        triggerFieldUpdate: true,
      },
      {
        id: 'name',
        label: 'Name',
        type: 'text' as const,
        placeholder: 'Enter notification name',
        required: true,
      },
    ];

    const conditionalFields = [];

    if (newNotificationType === 'email') {
      conditionalFields.push({
        id: 'email',
        label: 'Email Address',
        type: 'email' as const,
        placeholder: 'Enter email',
        required: true,
      });
    }

    if (newNotificationType && newNotificationType !== 'email') {
      conditionalFields.push({
        id: 'webhook',
        label: 'Webhook',
        type: 'text' as const,
        placeholder: 'Enter Webhook',
        required: true,
      });
    }

    if (newNotificationType === 'slack' || newNotificationType === 'rocketchat') {
      conditionalFields.push({
        id: 'channel',
        label: 'Channel',
        type: 'text' as const,
        placeholder: 'Enter channel',
        required: true,
      });
    }

    return [...baseFields, ...conditionalFields];
  }, [newNotificationType]);

  return (
    <Sheet
      sheetTrigger="Add Notification"
      sheetTitle="Add Notification"
      sheetDescription="Add a new notification to your organization"
      sheetFooterButton="Add Notification"
      buttonAction={handleAddNotification}
      sheetFields={getSheetFields()}
      loading={loading}
      error={error}
      additionalContent=""
      onFieldChange={handleFieldChange}
    />
  );
};