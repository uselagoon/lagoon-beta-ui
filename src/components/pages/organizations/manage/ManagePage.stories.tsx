import React from 'react';

import { OrganizationManageData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/manage/page';
import organizationByNameManage from '@/lib/query/organizations/organizationByName.manage';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import { sleep } from '../../../../../.storybook/mocks/storyHelpers';
import ManagePage from './ManagePage';

type OrgOwner = OrganizationManageData['organization']['owners'][0];

const createManageMockState = (orgId: string, owners: OrgOwner[]) => ({
  orgOwners: {
    [orgId]: owners,
  },
});

const initialOwners: OrgOwner[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Owner',
    email: 'alice@example.com',
    owner: true,
    admin: null,
    groupRoles: [{ id: 'g1' }],
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Admin',
    email: 'bob@example.com',
    owner: null,
    admin: true,
    groupRoles: [{ id: 'g1' }],
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Viewer',
    email: 'charlie@example.com',
    owner: null,
    admin: null,
    groupRoles: [{ id: 'g1' }],
  },
];

const meta: Meta<typeof ManagePage> = {
  title: 'Pages/Organizations/Manage',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createManageMockState('1', initialOwners),
  },
  render: () => (
    <MockPreloadQuery<OrganizationManageData, { name: string }>
      query={organizationByNameManage}
      variables={{ name: 'test-organization' }}
    >
      {queryRef => <ManagePage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ManagePage>;

export const Default: Story = {};

export const AddUser: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Administration', {}, { timeout: 10000 });
    expect(canvas.getByText('alice@example.com')).toBeInTheDocument();
    expect(canvas.getByText('bob@example.com')).toBeInTheDocument();
    expect(canvas.getByText('charlie@example.com')).toBeInTheDocument();

    const addUserButton = canvas.getByRole('button', { name: /add user/i });
    await userEvent.click(addUserButton);

    const emailInput = await screen.findByPlaceholderText(/enter email address/i);
    await userEvent.type(emailInput, 'newuser@example.com');

    const roleSelect = screen.getByRole('combobox');
    await userEvent.click(roleSelect);

    const adminOption = await screen.findByRole('option', { name: /admin/i });
    await userEvent.click(adminOption);

    const addButton = screen.getByRole('button', { name: /^add$/i });
    await userEvent.click(addButton);

    await waitFor(
      () => {
        expect(canvas.getByText('newuser@example.com')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const EditUserRole: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Administration', {}, { timeout: 10000 });

    await sleep(500);

    const editButton = within((await canvas.findAllByRole('button', { name: 'edit-user' }))?.[0]).findByRole('button');

    await userEvent.click(await editButton);

    const roleSelect = await screen.findByRole('combobox');
    await userEvent.click(roleSelect);

    const ownerOption = await screen.findByRole('option', { name: /admin/i });
    await userEvent.click(ownerOption);

    const updateButton = screen.getByRole('button', { name: /update/i });
    await userEvent.click(updateButton);

    await waitFor(
      () => {
        const updatedRow = canvas.getByText('alice@example.com').closest('tr');
        expect(within(updatedRow!).getByText('admin')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const DeleteUser: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Administration', {}, { timeout: 10000 });
    expect(canvas.getByText('charlie@example.com')).toBeInTheDocument();

    await sleep(500);

    const charlieRow = canvas.getByText('charlie@example.com').closest('tr');
    expect(charlieRow).toBeInTheDocument();

    const deleteButton = within(charlieRow!).getByRole('button', { name: /delete|remove/i });
    await userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm|remove|yes/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('charlie@example.com')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(canvas.getByText('alice@example.com')).toBeInTheDocument();
    expect(canvas.getByText('bob@example.com')).toBeInTheDocument();
  },
};
