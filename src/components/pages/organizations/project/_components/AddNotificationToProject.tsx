import { FC, startTransition } from 'react';

import {
  OrgEmail,
  OrgWebhook,
} from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import addNotificationToproject from '@/lib/mutation/organizations/addNotificationToproject';
import { ApolloError, useMutation } from '@apollo/client';
import { Sheet } from '@uselagoon/ui-library';
import { toast } from 'sonner';

type BasicNotification = {
  name: string;
  type: string;
};

type Props = {
  projectName: string;
  allNotifications: ((OrgWebhook & { __typename: string }) | (OrgEmail & { __typename: string }))[];
  linkedNotifications: {
    slacks: any;
    webhooks: any;
    rocketChats: any;
    emails: any;
    teams: any;
  };

  refetch?: () => void;
};

/**
 * Link notification to project modal
 */

export const AddNotificationToProject: FC<Props> = ({
  projectName,
  linkedNotifications,
  allNotifications,
  refetch,
}) => {
  const [addNotification, { error, loading }] = useMutation(addNotificationToproject, {
    refetchQueries: ['getOrganization'],
  });

  const linkedNotificationsNames = [
    ...linkedNotifications.slacks.map((notification: BasicNotification) => notification.name),
    ...linkedNotifications.webhooks.map((notification: BasicNotification) => notification.name),
    ...linkedNotifications.rocketChats.map((notification: BasicNotification) => notification.name),
    ...linkedNotifications.emails.map((notification: BasicNotification) => notification.name),
    ...linkedNotifications.teams.map((notification: BasicNotification) => notification.name),
  ];

  const filteredNotifications = allNotifications.filter(
    notification => !linkedNotificationsNames.includes(notification.name)
  );

  const notificationOptions = filteredNotifications.map(notification => {
    return {
      label: notification.__typename.split('Notification')[1].toLowerCase() + ': ' + notification.name,
      value: notification.__typename.split('Notification')[1].toUpperCase() + ':' + notification.name,
    };
  });

  const handleAddNotification = async (notification: string) => {
    try {
      await addNotification({
        variables: {
          projectName,
          notificationType: notification.split(':')[0],
          notificationName: notification.split(':')[1],
        },
      });
      startTransition(() => {
        (refetch ?? (() => {}))();
      });
    } catch (err) {
      console.error(err);
      toast.error('There was a problem linking a notification', {
        id: 'notification_link_err',
        description: (err as ApolloError).message,
      });
    }
  };

  return (
    <>
      <Sheet
        data-cy="add-notification"
        sheetTrigger="Link Notification"
        sheetTitle={`Link notification to ${projectName}`}
        sheetFooterButton="Link"
        loading={loading}
        error={!error}
        additionalContent={null}
        sheetFields={[
          {
            id: 'notification_name',
            label: 'Notification',
            required: true,
            placeholder: 'Select a notification to link',
            type: 'select',
            options: notificationOptions.length ? notificationOptions : undefined,
          },
        ]}
        buttonAction={(_, { notification_name }) => {
          handleAddNotification(notification_name);
        }}
      />
    </>
  );
};
