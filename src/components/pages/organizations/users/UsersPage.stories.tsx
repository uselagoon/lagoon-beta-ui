import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationUsersData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/(users-page)/page';
import usersByOrganization from '@/lib/query/organizations/usersByOrganization';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import UsersPage from './UsersPage';

const mockData: OrganizationUsersData = {
  users: [
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
      groupRoles: [{ id: '2', role: 'MAINTAINER' }, { id: '3', role: 'DEVELOPER' }],
      has2faEnabled: true,
      isFederatedUser: false,
    },
    {
      id: '3',
      firstName: 'Charlie',
      lastName: 'Brown',
      email: 'charlie@example.com',
      groupRoles: [{ id: '4', role: 'DEVELOPER' }],
      has2faEnabled: false,
      isFederatedUser: true,
    },
    {
      id: '4',
      firstName: null,
      lastName: null,
      email: 'default-user@lagoon.sh',
      groupRoles: [{ id: '5', role: 'GUEST' }],
      has2faEnabled: false,
      isFederatedUser: false,
    },
  ],
};

const mockGroups = [
  { name: 'developers' },
  { name: 'admins' },
  { name: 'testers' },
];

const meta: Meta<typeof UsersPage> = {
  title: 'Pages/Organizations/Users',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={usersByOrganization}
      variables={{ id: 1 }}
      mockData={mockData}
    >
      {queryRef => (
        <UsersPage
          queryRef={queryRef}
          orgId={1}
          groups={mockGroups}
          organizationSlug="test-organization"
        />
      )}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof UsersPage>;

export const Default: Story = {};
