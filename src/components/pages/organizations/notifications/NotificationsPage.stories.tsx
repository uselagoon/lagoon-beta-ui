import React from 'react';

import { OrganizationNotificationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/notifications/page';
import organizationByNameNotification from '@/lib/query/organizations/organizationByName.notification';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { OrgNotifications, createNotificationsMockState, sleep } from '../../../../../.storybook/mocks/storyHelpers';
import NotificationsPage from './NotificationsPage';

const initialNotifications: OrgNotifications = {
  id: 1,
  name: 'test-organization',
  slacks: [
    { name: 'dev-alerts', webhook: 'https://hooks.slack.com/services/xxx', channel: '#development' },
    { name: 'prod-alerts', webhook: 'https://hooks.slack.com/services/yyy', channel: '#production' },
  ],
  rocketchats: [{ name: 'rocket-dev', webhook: 'https://rocket.example.com/hooks/xxx', channel: '#dev' }],
  teams: [{ name: 'teams-alerts', webhook: 'https://outlook.office.com/webhook/xxx', channel: 'Alerts' }],
  webhook: [{ name: 'custom-webhook', webhook: 'https://api.example.com/notify' }],
  emails: [
    { name: 'dev-team', emailAddress: 'dev-team@example.com' },
    { name: 'ops-team', emailAddress: 'ops@example.com' },
  ],
};

const meta: Meta<typeof NotificationsPage> = {
  title: 'Pages/Organizations/Notifications',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createNotificationsMockState('test-organization', initialNotifications),
  },
  render: () => (
    <MockPreloadQuery<OrganizationNotificationData, { name: string }>
      query={organizationByNameNotification}
      variables={{ name: 'test-organization' }}
    >
      {queryRef => <NotificationsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof NotificationsPage>;

export const List: Story = {};

export const AddSlackNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: /add notification/i }, { timeout: 10000 });
    await userEvent.click(addButton);

    const serviceSelect = await screen.findByRole('combobox');
    await userEvent.click(serviceSelect);

    const slackOption = await screen.findByRole('option', { name: /slack/i });
    await userEvent.click(slackOption);

    const nameInput = await screen.findByLabelText(/name/i);
    await userEvent.type(nameInput, 'new-slack-notification');

    const webhookInput = await screen.findByLabelText(/webhook/i);
    await userEvent.type(webhookInput, 'https://hooks.slack.com/services/new');

    const channelInput = await screen.findByLabelText(/channel/i);
    await userEvent.type(channelInput, '#new-channel');

    const submitButton = await screen.findByRole('button', { name: /add notification/i });
    await userEvent.click(submitButton);

    await canvas.findByText('new-slack-notification', {}, { timeout: 5000 });
  },
};

export const AddEmailNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: /add notification/i }, { timeout: 10000 });
    await userEvent.click(addButton);

    const serviceSelect = await screen.findByRole('combobox');
    await userEvent.click(serviceSelect);

    const emailOption = await screen.findByRole('option', { name: /email/i });
    await userEvent.click(emailOption);

    const nameInput = await screen.findByLabelText(/name/i);
    await userEvent.type(nameInput, 'new-email-notification');

    const emailInput = await screen.findByLabelText(/email address/i);
    await userEvent.type(emailInput, 'newteam@example.com');

    const submitButton = await screen.findByRole('button', { name: /add notification/i });
    await userEvent.click(submitButton);

    await canvas.findByText('new-email-notification', {}, { timeout: 5000 });
  },
};

export const DeleteNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('dev-alerts', {}, { timeout: 10000 });
    await sleep(500);

    const deleteButton = within((await canvas.findAllByRole('button', { name: 'delete' }))?.[0]).findByRole('button');
    await userEvent.click(await deleteButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('dev-alerts')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const EditNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('dev-alerts', {}, { timeout: 10000 });
    await sleep(500);

    const editButton = within((await canvas.findAllByRole('button', { name: 'edit-notification' }))?.[0]).findByRole(
      'button'
    );
    await userEvent.click(await editButton);

    const nameInput = await screen.findByLabelText(/name/i);
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'updated-slack-notification');

    const updateButton = await screen.findByRole('button', { name: 'Update' });
    await userEvent.click(updateButton);

    await canvas.findByText('updated-slack-notification', {}, { timeout: 5000 });
  },
};
