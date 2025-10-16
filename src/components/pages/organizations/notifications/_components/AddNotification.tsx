import React, { FC, startTransition, useCallback, useState } from 'react';

import {
  ADD_EMAIL_NOTIFICATION,
  ADD_MICROSOFTTEAMS_NOTIFICATION,
  ADD_ROCKETCHAT_NOTIFICATION,
  ADD_SLACK_NOTIFICATION,
  ADD_WEBHOOK_NOTIFICATION,
} from '@/lib/mutation/organizations/addNotification';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';
import Image from "next/image";
import {Mail, Webhook} from "lucide-react";

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

  const [addSlack, { loading: slackLoading, error: slackError }] = useMutation(ADD_SLACK_NOTIFICATION);
  const [addRocketChat, { loading: rocketLoading, error: rocketError }] = useMutation(ADD_ROCKETCHAT_NOTIFICATION);
  const [addEmail, { loading: emailLoading, error: emailError }] = useMutation(ADD_EMAIL_NOTIFICATION);
  const [addTeams, { loading: teamsLoading, error: teamsError }] = useMutation(ADD_MICROSOFTTEAMS_NOTIFICATION);
  const [addWebhook, { loading: webhookLoading, error: webhookError }] = useMutation(ADD_WEBHOOK_NOTIFICATION);

  const loading = slackLoading || rocketLoading || emailLoading || teamsLoading || webhookLoading;
  const error = slackError || rocketError || emailError || teamsError || webhookError;

  const newNotificationOptions = [
    { label: 'Slack', value: 'slack', icon: <Image src="/notification-icons/Slack.svg" width={20} height={20} alt="slack" /> },
    { label: 'RocketChat', value: 'rocketchat', icon: <Image src="/notification-icons/RocketChat.svg" width={20} height={20} alt="rocketchat" /> },
    { label: 'Microsoft Teams', value: 'teams', icon: <Image src="/notification-icons/Teams.svg" width={20} height={20} alt="rocketchat" /> },
    { label: 'Email', value: 'email', icon: <Mail size={20} color={"rgb(76, 132, 255)"}/> },
    { label: 'Webhook', value: 'webhook', icon: <Webhook size={20} color={"rgb(76, 132, 255)"}/> },
  ];

  const getAction = async (
    notificationType: string,
    {
      name,
      channel,
      webhook,
      email,
    }: {
      name: string;
      channel?: string;
      webhook?: string;
      email?: string;
    }
  ) => {
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
      await getAction(notification_type, mutationVars);

      startTransition(() => {
        refetch && refetch();
      });

      toast.success('Notification added successfully!');
    } catch (err) {
      console.error(err);
      return false
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
      error={!!error}
      additionalContent={
        <>
          {error && (
            <div className="text-red-500 p-3 border border-red-300 rounded-md mt-2 bg-red-50">
              <strong>Error:</strong> {error.message}
            </div>
          )}
        </>
      }
      onFieldChange={handleFieldChange}
    />
  );
};
