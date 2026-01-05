import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationNotificationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/notifications/page';
import organizationByNameNotification from '@/lib/query/organizations/organizationByName.notification';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import NotificationsPage from './NotificationsPage';

const mockData: OrganizationNotificationData = {
  organization: {
    id: 1,
    name: 'test-organization',
    slacks: [
      { name: 'dev-alerts', webhook: 'https://hooks.slack.com/services/xxx', channel: '#development' },
      { name: 'prod-alerts', webhook: 'https://hooks.slack.com/services/yyy', channel: '#production' },
    ],
    rocketchats: [
      { name: 'rocket-dev', webhook: 'https://rocket.example.com/hooks/xxx', channel: '#dev' },
    ],
    teams: [
      { name: 'teams-alerts', webhook: 'https://outlook.office.com/webhook/xxx', channel: 'Alerts' },
    ],
    webhook: [
      { name: 'custom-webhook', webhook: 'https://api.example.com/notify' },
    ],
    emails: [
      { name: 'dev-team', emailAddress: 'dev-team@example.com' },
      { name: 'ops-team', emailAddress: 'ops@example.com' },
    ],
  },
};

const meta: Meta<typeof NotificationsPage> = {
  title: 'Pages/Organizations/Notifications',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByNameNotification}
      variables={{ name: 'test-organization' }}
      mockData={mockData}
    >
      {queryRef => <NotificationsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof NotificationsPage>;

export const Default: Story = {};
