import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationUserData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/users/[userSlug]/page';
import userByEmailAndOrganization from '@/lib/query/organizations/userByEmailAndOrganization';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import UserPage from './UserPage';

const mockData: OrganizationUserData = {
  userByEmailAndOrganization: {
    email: 'alice@example.com',
    groupRoles: [
      { id: '1', name: 'developers', role: 'OWNER', groupType: 'null' },
      { id: '2', name: 'project-alpha', role: 'MAINTAINER', groupType: 'null' },
      { id: '3', name: 'project-beta-default', role: 'DEVELOPER', groupType: 'project-default-group' },
      { id: '4', name: 'testers', role: 'REPORTER', groupType: 'null' },
    ],
  },
};

const meta: Meta<typeof UserPage> = {
  title: 'Pages/Organizations/User',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={userByEmailAndOrganization}
      variables={{ organization: 1, email: 'alice@example.com' }}
      mockData={mockData}
    >
      {queryRef => <UserPage queryRef={queryRef} orgName="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof UserPage>;

export const Default: Story = {};
