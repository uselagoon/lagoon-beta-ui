import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { EditNotification } from './EditNotification';

const meta: Meta<typeof EditNotification> = {
  title: 'Components/Sheets/EditNotification',
  component: EditNotification,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof EditNotification>;

export const SlackNotification: Story = {
  args: {
    notification: {
      name: 'deployment-alerts',
      type: 'slack',
      webhook: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
      channel: '#deployments',
    },
    refetch: () => {},
  },
};

export const EmailNotification: Story = {
  args: {
    notification: {
      name: 'email-alerts',
      type: 'email',
      emailAddress: 'alerts@example.com',
    },
    refetch: () => {},
  },
};

export const TeamsNotification: Story = {
  args: {
    notification: {
      name: 'teams-alerts',
      type: 'teams',
      webhook: 'https://outlook.office.com/webhook/XXX',
      channel: 'Deployments',
    },
    refetch: () => {},
  },
};

export const RocketChatNotification: Story = {
  args: {
    notification: {
      name: 'rocketchat-alerts',
      type: 'rocketchat',
      webhook: 'https://rocketchat.example.com/hooks/XXX',
      channel: '#alerts',
    },
    refetch: () => {},
  },
};

export const WebhookNotification: Story = {
  args: {
    notification: {
      name: 'webhook-alerts',
      type: 'webhook',
      webhook: 'https://api.example.com/webhooks/deployments',
    },
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    notification: {
      name: 'deployment-alerts',
      type: 'slack',
      webhook: 'https://hooks.slack.com/services/XXX/YYY/ZZZ',
      channel: '#deployments',
    },
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
