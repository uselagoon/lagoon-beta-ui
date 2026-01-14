import React from 'react';

import { OrganizationProjectData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/[projectSlug]/page';
import projectAndOrganizationByName from '@/lib/query/organizations/projectAndOrganizationByName';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import {
  OrgNotifications,
  createNotificationsMockState,
  mergeInitialMockState,
  sleep,
} from '../../../../../.storybook/mocks/storyHelpers';
import OrgProjectPage from './OrgProjectPage';

type ProjectData = OrganizationProjectData['project'];
type OrganizationData = OrganizationProjectData['organization'];

const createOrgProjectMockState = (
  projectName: string,
  orgName: string,
  project: ProjectData,
  organization: OrganizationData
) => ({
  orgProject: {
    [projectName]: project,
  },
  orgProjectOrg: {
    [orgName]: organization,
  },
});

const initialProject: ProjectData = {
  id: 1,
  name: 'project-alpha',
  groups: [
    { id: '1', name: 'developers', type: 'null', memberCount: 5 },
    { id: '4', name: 'project-alpha-default', type: 'project-default-group', memberCount: 1 },
  ],
  notifications: [
    { name: 'dev-alerts', type: 'SLACK' },
    { name: 'alerts', type: 'EMAIL' },
  ],
};

const initialOrganization: OrganizationData = {
  id: 1,
  name: 'test-organization',
  description: 'A test organization for development purposes',
  friendlyName: 'Test Organization',
  quotaGroup: 10,
  projects: [
    { id: 1, name: 'project-alpha', groupCount: 3 },
    { id: 2, name: 'project-beta', groupCount: 2 },
    { id: 3, name: 'project-gamma', groupCount: 1 },
  ],
  groups: [
    { name: 'developers', type: 'null', id: '1', memberCount: 5 },
    { name: 'admins', type: 'null', id: '2', memberCount: 5 },
    { name: 'testers', type: 'null', id: '3', memberCount: 5 },
    { name: 'designers', type: 'null', id: '4', memberCount: 5 },
  ],
  slacks: [
    { webhook: 'https://hooks.slack.com/1', name: 'dev-alerts', channel: '#dev', __typename: 'NotificationSlack' },
    { webhook: 'https://hooks.slack.com/2', name: 'prod-alerts', channel: '#prod', __typename: 'NotificationSlack' },
  ],
  rocketchats: [],
  teams: [
    {
      webhook: 'https://teams.webhook/1',
      name: 'team-notifications',
      __typename: 'NotificationMicrosoftTeams',
      channel: '#team',
    },
  ],
  webhook: [{ webhook: 'https://api.example.com/notify', name: 'custom-hook', __typename: 'NotificationWebhook' }],
  emails: [
    { name: 'alerts', emailAddress: 'alerts@example.com', __typename: 'NotificationEmail' },
    { name: 'support', emailAddress: 'support@example.com', __typename: 'NotificationEmail' },
  ],
};

const initialNotifications: OrgNotifications = {
  id: 1,
  name: 'test-organization',
  slacks: [
    { name: 'dev-alerts', webhook: 'https://hooks.slack.com/services/xxx', channel: '#development' },
    { name: 'prod-alerts', webhook: 'https://hooks.slack.com/services/yyy', channel: '#production' },
  ],
  rocketchats: [],
  teams: [{ name: 'team-notifications', webhook: 'https://outlook.office.com/webhook/xxx', channel: 'Alerts' }],
  webhook: [{ name: 'custom-hook', webhook: 'https://api.example.com/notify' }],
  emails: [
    { name: 'alerts', emailAddress: 'alerts@example.com' },
    { name: 'support', emailAddress: 'support@example.com' },
  ],
};

const meta: Meta<typeof OrgProjectPage> = {
  title: 'Pages/Organizations/Project',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: mergeInitialMockState(
      createOrgProjectMockState('project-alpha', 'test-organization', initialProject, initialOrganization),
      createNotificationsMockState('test-organization', initialNotifications)
    ),
  },
  render: () => (
    <MockPreloadQuery<OrganizationProjectData, { name: string; project: string }>
      query={projectAndOrganizationByName}
      variables={{ name: 'test-organization', project: 'project-alpha' }}
    >
      {queryRef => <OrgProjectPage queryRef={queryRef} projectSlug="project-alpha" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgProjectPage>;

export const Default: Story = {};

export const LinkGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Groups for project-alpha', {}, { timeout: 5000 });

    expect(canvas.getByText('developers')).toBeInTheDocument();
    expect(canvas.queryByText('admins')).not.toBeInTheDocument();

    const linkGroupButton = canvas.getByRole('button', { name: /link group/i });
    await userEvent.click(linkGroupButton);

    const groupSelect = await screen.findByRole('combobox');
    await userEvent.click(groupSelect);

    const adminsOption = await screen.findByRole('option', { name: /admins/i });
    await userEvent.click(adminsOption);

    const linkButton = screen.getByRole('button', { name: /^link$/i });
    await userEvent.click(linkButton);

    await waitFor(
      () => {
        expect(canvas.getByText('admins')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const UnlinkGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Groups for project-alpha', {}, { timeout: 5000 });

    expect(canvas.getByText('developers')).toBeInTheDocument();

    await sleep(500);

    const unlinkButton = (await canvas.findAllByRole('button', { name: /unlink-group/i }))[0];
    if (!unlinkButton) {
      throw new Error('Unlink button not found');
    }
    await userEvent.click(within(unlinkButton).getAllByRole('button')[0]);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('developers')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const LinkNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Notifications for project-alpha', {}, { timeout: 5000 });

    expect(canvas.getByText('dev-alerts')).toBeInTheDocument();
    expect(canvas.queryByText('prod-alerts')).not.toBeInTheDocument();

    const linkNotificationButton = canvas.getByRole('button', { name: /link notification/i });
    await userEvent.click(linkNotificationButton);

    const notificationSelect = await screen.findByRole('combobox');
    await userEvent.click(notificationSelect);

    const prodAlertsOption = await screen.findByRole('option', { name: /prod-alerts/i });
    await userEvent.click(prodAlertsOption);

    const linkButton = screen.getByRole('button', { name: /^link$/i });
    await userEvent.click(linkButton);

    await waitFor(
      () => {
        expect(canvas.getByText('prod-alerts')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const UnlinkNotification: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Notifications for project-alpha', {}, { timeout: 5000 });

    expect(canvas.getByText('dev-alerts')).toBeInTheDocument();

    await sleep(500);
    const notificationsRow = (await canvas.findByText('dev-alerts')).closest('tr');
    if (!notificationsRow) {
      throw new Error('Notifications row not found');
    }

    const unlinkButton = within(notificationsRow).getByRole('button', { name: /delete/i });
    if (!unlinkButton) {
      throw new Error('Unlink button not found');
    }
    await userEvent.click(unlinkButton);

    const confirmButton = await screen.findByRole('button', { name:'Confirm' });

    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('dev-alerts')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(canvas.getByText('alerts')).toBeInTheDocument();
  },
};
