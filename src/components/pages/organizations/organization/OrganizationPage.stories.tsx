import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, within, screen, waitFor } from '@storybook/test';

import { OrganizationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import organizationByName from '@/lib/query/organizations/organizationByName';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { createOrgOverviewMockState, OrgOverview } from '../../../../../.storybook/mocks/storyHelpers';
import OrganizationPage from './OrganizationPage';

const initialOrganization: OrgOverview = {
  id: 1,
  name: 'test-organization',
  description: 'A test organization for development purposes',
  friendlyName: 'Test Organization',
  quotaProject: 10,
  quotaGroup: 5,
  quotaNotification: 20,
  quotaEnvironment: 50,
  deployTargets: [
    { id: 1, name: 'production', friendlyName: 'Production Cluster', cloudProvider: 'aws', cloudRegion: 'us-east-1' },
    { id: 2, name: 'staging', friendlyName: 'Staging Cluster', cloudProvider: 'aws', cloudRegion: 'us-west-2' },
  ],
  owners: [
    { id: '1', firstName: 'Alice', lastName: 'Owner', email: 'alice@example.com', owner: true, admin: null },
    { id: '2', firstName: 'Bob', lastName: 'Admin', email: 'bob@example.com', owner: null, admin: true },
  ],
  projects: [
    { id: 1, name: 'project-alpha', groupCount: 3 },
    { id: 2, name: 'project-beta', groupCount: 2 },
    { id: 3, name: 'project-gamma', groupCount: 1 },
  ],
  environments: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
  groups: [
    { id: '1', name: 'developers', type: 'null', memberCount: 5 },
    { id: '2', name: 'admins', type: 'null', memberCount: 3 },
  ],
  slacks: [{ webhook: 'https://hooks.slack.com/...', name: 'dev-alerts', channel: '#dev', __typename: 'NotificationSlack' }],
  rocketchats: [],
  teams: [],
  webhook: [],
  emails: [{ name: 'alerts', emailAddress: 'alerts@example.com', __typename: 'NotificationEmail' }],
};

const meta: Meta<typeof OrganizationPage> = {
  title: 'Pages/Organizations/Overview',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createOrgOverviewMockState('test-organization', initialOrganization),
  },
  render: () => (
    <MockPreloadQuery<OrganizationData, { name: string }>
      query={organizationByName}
      variables={{ name: 'test-organization' }}
    >
      {queryRef => <OrganizationPage queryRef={queryRef} orgSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrganizationPage>;

export const Default: Story = {};

export const EditName: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const nameInput = await canvas.findByDisplayValue('Test Organization', {}, { timeout: 10000 });

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Organization Name');

    const saveButton = await canvas.findByRole('button', { name: /save-name/i });
    await userEvent.click(saveButton);

    await waitFor(
      () => {
        expect(canvas.getByDisplayValue('Updated Organization Name')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const EditDescription: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const descTextarea = await canvas.findByDisplayValue('A test organization for development purposes', {}, { timeout: 10000 });

    await userEvent.clear(descTextarea);
    await userEvent.type(descTextarea, 'This is an updated organization description');

    const saveButtons = await canvas.findAllByRole('button', { name: /save-desc/i });
    const descSaveButton = saveButtons[saveButtons.length - 1];
    await userEvent.click(descSaveButton);

    await waitFor(
      () => {
        expect(canvas.getByDisplayValue('This is an updated organization description')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const CreateProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Overview', {}, { timeout: 10000 });

    expect(canvas.getByText(/Project Quota: 3 of 10/)).toBeInTheDocument();

    const createProjectButton = canvas.getByRole('button', { name: /create project/i });
    await userEvent.click(createProjectButton);

    const projectNameInput = await screen.findByPlaceholderText(/enter a project name/i);
    await userEvent.type(projectNameInput, 'new-project');

    const gitUrlInput = screen.getByPlaceholderText(/enter the url/i);
    await userEvent.type(gitUrlInput, 'git@github.com:example/new-project.git');

    const prodEnvInput = screen.getByPlaceholderText(/enter prod environment/i);
    await userEvent.type(prodEnvInput, 'main');

    const deployTargetSelect = screen.getByRole('combobox');
    await userEvent.click(deployTargetSelect);

    const productionOption = await screen.findByRole('option', { name: /production/i });
    await userEvent.click(productionOption);

    const createButton = screen.getByRole('button', { name: /^create$/i });
    await userEvent.click(createButton);

    await waitFor(
      () => {
        expect(canvas.getByText(/Project Quota: 4 of 10/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const CreateGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Overview', {}, { timeout: 10000 });

    expect(canvas.getByText(/Group Quota: 2 of 5/)).toBeInTheDocument();

    const addGroupButton = canvas.getByRole('button', { name: /add group/i });
    await userEvent.click(addGroupButton);

    const groupNameInput = await screen.findByPlaceholderText(/enter name/i);
    await userEvent.type(groupNameInput, 'new-team');

    const createButton = screen.getByRole('button', { name: /create group/i });
    await userEvent.click(createButton);

    await waitFor(
      () => {
        expect(canvas.getByText(/Group Quota: 3 of 5/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const AddUserToGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Overview', {}, { timeout: 10000 });

    const addUserButton = canvas.getByRole('button', { name: /add user/i });
    await userEvent.click(addUserButton);

    const emailInput = await screen.findByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, 'newuser@example.com');

    const groupSelect = screen.getAllByRole('combobox')[0];
    await userEvent.click(groupSelect);

    const developersOption = await screen.findByRole('option', { name: /developers/i });
    await userEvent.click(developersOption);

    const roleSelect = screen.getAllByRole('combobox')[1];
    await userEvent.click(roleSelect);

    const maintainerOption = await screen.findByRole('option', { name: /maintainer/i });
    await userEvent.click(maintainerOption);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(screen.queryByPlaceholderText(/enter email/i)).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
