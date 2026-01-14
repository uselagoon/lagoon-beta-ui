import React from 'react';

import { OrganizationGroupData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/[groupSlug]/page';
import groupByNameAndOrganization from '@/lib/query/organizations/groupByNameAndOrganization';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { createGroupMembersMockState, sleep } from '../../../../../.storybook/mocks/storyHelpers';
import GroupPage from './GroupPage';

const initialMembers = [
  { role: 'OWNER', user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', comment: null } },
  { role: 'MAINTAINER', user: { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', comment: null } },
  { role: 'DEVELOPER', user: { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', comment: null } },
];

const initialGroupProjects = [
  { id: 1, name: 'project-alpha' },
  { id: 2, name: 'project-beta' },
];

const initialOrgProjects = [
  { id: 1, name: 'project-alpha' },
  { id: 2, name: 'project-beta' },
  { id: 3, name: 'project-gamma' },
];

const meta: Meta<typeof GroupPage> = {
  title: 'Pages/Organizations/Group',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createGroupMembersMockState(
      'developers',
      initialMembers,
      initialGroupProjects,
      initialOrgProjects
    ),
  },
  render: () => (
    <MockPreloadQuery<OrganizationGroupData, { name: string; organization: number }>
      query={groupByNameAndOrganization}
      variables={{ name: 'developers', organization: 1 }}
    >
      {queryRef => <GroupPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof GroupPage>;

export const List: Story = {};

export const AddMember: Story = {
  parameters: {
    test: {
      dangerouslyIgnoreUnhandledErrors: true,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('alice@example.com', {}, { timeout: 10000 });

    const addUserButton = await canvas.findByRole('button', { name: /add user/i });
    await userEvent.click(addUserButton);

    const emailInput = await screen.findByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, 'newmember@example.com');

    const roleSelect = (await screen.findByText(/add a role for this user/i)).parentElement;
    if (!roleSelect) {
      throw new Error('Role select not found');
    }
    await userEvent.click(roleSelect);
    const roleOption = await screen.findByRole('option', { name: /developer/i });
    await userEvent.click(roleOption);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.getByText('newmember@example.com')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const RemoveMember: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const aliceEmail = await canvas.findByText('alice@example.com', {}, { timeout: 10000 });
    expect(aliceEmail).toBeInTheDocument();

    const initialCount = canvas.getAllByRole('row').length;
    await sleep(500);

    const deleteButtons = await canvas.findAllByRole('button', { name: 'delete' });
    fireEvent.click(deleteButtons[0]);

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' });
    fireEvent.click(confirmButton);

    await waitFor(
      () => {
        const rows = canvas.getAllByRole('row');
        expect(rows.length).toBeLessThan(initialCount);
      },
      { timeout: 5000 }
    );

    expect(screen.queryByText('alice@example.com')).not.toBeInTheDocument();
  },
};

export const AddProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('project-alpha', {}, { timeout: 10000 });

    const addProjectButton = await canvas.findByRole('button', { name: /add project/i });
    await userEvent.click(addProjectButton);

    const projectSelect = (await screen.findByText(/select a project to add to the group/i)).parentElement;
    if (!projectSelect) {
      throw new Error('Project select not found');
    }
    await userEvent.click(projectSelect);
    const projectOption = await screen.findByRole('option', { name: /project-gamma/i });
    await userEvent.click(projectOption);

    const addButton = await screen.findByRole('button', { name: /^add$/i });
    await userEvent.click(addButton);

    await waitFor(
      () => {
        expect(canvas.getByText('project-gamma')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const UnlinkProject: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const projectBeta = await canvas.findByText('project-beta', {}, { timeout: 10000 });
    expect(projectBeta).toBeInTheDocument();

    await sleep(500);

    const deleteButtons = await canvas.findAllByRole('button', { name: 'delete' });
    const lastDeleteButton = deleteButtons[deleteButtons.length - 1];
    if (!lastDeleteButton) {
      throw new Error('Unlink button not found');
    }
    fireEvent.click(lastDeleteButton);

    const dialogTitle = await screen.findByText(/are you sure/i, {}, { timeout: 5000 });
    expect(dialogTitle).toBeInTheDocument();

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('project-beta')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
