import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { OrganizationUserData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/[userSlug]/page';
import userByEmailAndOrganization from '@/lib/query/organizations/userByEmailAndOrganization';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { createUserGroupRolesMockState, sleep, UserGroupRole } from '../../../../../.storybook/mocks/storyHelpers';
import UserPage from './UserPage';

const initialGroups: UserGroupRole[] = [
  { id: '1', name: 'developers', role: 'OWNER', groupType: 'null' },
  { id: '2', name: 'project-alpha', role: 'MAINTAINER', groupType: 'null' },
  { id: '3', name: 'project-beta-default', role: 'DEVELOPER', groupType: 'project-default-group' },
  { id: '4', name: 'testers', role: 'REPORTER', groupType: 'null' },
  { id: '5', name: 'designers', role: 'GUEST', groupType: 'null' },
];

const meta: Meta<typeof UserPage> = {
  title: 'Pages/Organizations/User',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createUserGroupRolesMockState(1, 'alice@example.com', initialGroups),
  },
  render: () => (
    <MockPreloadQuery<OrganizationUserData, { organization: number; email: string }>
      query={userByEmailAndOrganization}
      variables={{ organization: 1, email: 'alice@example.com' }}
    >
      {queryRef => <UserPage queryRef={queryRef} orgName="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof UserPage>;

export const Default: Story = {};

export const EditUserRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Groups for alice@example.com', {}, { timeout: 10000 });

    await sleep(500);

    const editButtons = await canvas.findAllByRole('button', { name: /edit-role/i });
    const firstEditButton = editButtons[0];
    await userEvent.click(firstEditButton);

    const roleSelect = await screen.findByRole('combobox');
    await userEvent.click(roleSelect);

    const maintainerOption = await screen.findByRole('option', { name: /maintainer/i });
    await userEvent.click(maintainerOption);

    const confirmButton = screen.getByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        const developersRow = canvas.getByText('developers').closest('tr');
        expect(within(developersRow!).getByText('MAINTAINER')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const UnlinkUserFromGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Groups for alice@example.com', {}, { timeout: 10000 });
    expect(canvas.getByText('testers')).toBeInTheDocument();

    await sleep(500);

    const testersRow = canvas.getByText('testers').closest('tr');
    expect(testersRow).toBeInTheDocument();

    const unlinkButton = within(testersRow!).getByRole('button', { name: /delete/i });
    await userEvent.click(unlinkButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm|yes/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('tester')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(canvas.getByText('developers')).toBeInTheDocument();
    expect(canvas.getByText('project-alpha')).toBeInTheDocument();
  },
};
