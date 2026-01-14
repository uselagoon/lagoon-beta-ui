import React from 'react';

import { OrganizationGroupsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import organizationByNameGroups from '@/lib/query/organizations/organizationByName.groups';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { createOrgGroupsMockState, sleep } from '../../../../../.storybook/mocks/storyHelpers';
import GroupsPage from './GroupsPage';

const initialGroups = [
  { id: '1', name: 'developers', type: 'null', memberCount: 5 },
  { id: '2', name: 'admins', type: 'null', memberCount: 3 },
  { id: '3', name: 'testers', type: 'null', memberCount: 8 },
];

const meta: Meta<typeof GroupsPage> = {
  title: 'Pages/Organizations/Groups',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createOrgGroupsMockState(initialGroups),
  },
  render: () => (
    <MockPreloadQuery<OrganizationGroupsData, { name: string; limit: null }>
      query={organizationByNameGroups}
      variables={{ name: 'test-organization', limit: null }}
    >
      {queryRef => <GroupsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof GroupsPage>;

export const List: Story = {};

export const AddGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: 'Add Group' }, { timeout: 10000 });
    await userEvent.click(addButton);

    const nameInput = await screen.findByLabelText(/group name/i);
    await userEvent.type(nameInput, 'new-test-group');

    const createButton = await screen.findByRole('button', { name: /create/i });
    await userEvent.click(createButton);

    await canvas.findByText('new-test-group', {}, { timeout: 5000 });
  },
};

export const DeleteGroup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('developers', {}, { timeout: 10000 });

    await sleep(500);

    const deleteButton = (await canvas.findAllByRole('button', { name: /delete/i }))?.[0];
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    await fireEvent.click(deleteButton);

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
