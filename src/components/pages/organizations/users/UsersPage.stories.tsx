import React from 'react';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';
import usersByOrganization from '@/lib/query/organizations/usersByOrganization';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import UsersPage from './UsersPage';
import { sleep } from '../../../../../.storybook/mocks/storyHelpers';

const initialUsers = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    groupRoles: [{ id: '1', role: 'OWNER' }],
    has2faEnabled: true,
    isFederatedUser: false,
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    groupRoles: [{ id: '2', role: 'MAINTAINER' }],
    has2faEnabled: true,
    isFederatedUser: false,
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@example.com',
    groupRoles: [{ id: '3', role: 'DEVELOPER' }],
    has2faEnabled: false,
    isFederatedUser: false,
  },
];

const mockGroups = [{ name: 'developers' }, { name: 'admins' }, { name: 'testers' }];

const meta: Meta<typeof UsersPage> = {
  title: 'Pages/Organizations/Users',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      orgUsers: {
        '1': initialUsers,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<OrganizationUsersData, { id: number }> query={usersByOrganization} variables={{ id: 1 }}>
      {queryRef => <UsersPage queryRef={queryRef} orgId={1} groups={mockGroups} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof UsersPage>;

export const List: Story = {};

export const AddUser: Story = {
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
    await userEvent.type(emailInput, 'newuser@example.com');

    const groupSelect = (await screen.findByText(/select a group/i)).parentElement;
    if (!groupSelect) {
      throw new Error('Group select not found');
    }
    await userEvent.click(groupSelect);
    const groupOption = await screen.findByRole('option', { name: /developers/i });
    await userEvent.click(groupOption);

    const roleSelect = (await screen.findByText(/add a role for this user/i)).parentElement;
    if (!roleSelect) {
      throw new Error('Role select not found');
    }
    await userEvent.click(roleSelect);
    const roleOption = await screen.findByRole('option', { name: /maintainer/i });
    await userEvent.click(roleOption);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.getByText('newuser@example.com')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const AddUserError: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('alice@example.com', {}, { timeout: 10000 });

    const addUserButton = await canvas.findByRole('button', { name: /add user/i });
    await userEvent.click(addUserButton);

    const emailInput = await screen.findByPlaceholderText(/enter email/i);
    await userEvent.type(emailInput, 'nonexistent@example.com');

    const groupSelect = (await screen.findByText(/select a group/i)).parentElement;
    if (!groupSelect) {
      throw new Error('Group select not found');
    }
    await userEvent.click(groupSelect);
    const groupOption = await screen.findByRole('option', { name: /developers/i });
    await userEvent.click(groupOption);

    const roleSelect = (await screen.findByText(/add a role for this user/i)).parentElement;
    if (!roleSelect) {
      throw new Error('Role select not found');
    }
    await userEvent.click(roleSelect);
    const roleOption = await screen.findByRole('option', { name: /maintainer/i });
    await userEvent.click(roleOption);

    const inviteCheckbox = await screen.findByRole('checkbox', { name: /invite user to lagoon/i });
    await userEvent.click(inviteCheckbox);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(screen.getByText(/error adding user/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const RemoveUser: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('alice@example.com', {}, { timeout: 10000 });

    await sleep(500);
    const removeButton = (await canvas.findAllByRole('button', { name: 'delete' }))?.[0];
    if (!removeButton) {
      throw new Error('Remove button not found');
    }
    fireEvent.click(removeButton);

    const confirmButton = await screen.findByRole('button', { name: 'Confirm' });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('alice@example.com')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
