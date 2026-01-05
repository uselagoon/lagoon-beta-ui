import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationGroupsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/(groups-page)/page';
import organizationByNameGroups from '@/lib/query/organizations/organizationByName.groups';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import GroupsPage from './GroupsPage';

const mockData: OrganizationGroupsData = {
  organization: {
    id: 1,
    name: 'test-organization',
    friendlyName: 'Test Organization',
    groups: [
      { id: '1', name: 'developers', type: 'null', memberCount: 5 },
      { id: '2', name: 'admins', type: 'null', memberCount: 3 },
      { id: '3', name: 'project-alpha-default', type: 'project-default-group', memberCount: 2 },
      { id: '4', name: 'testers', type: 'null', memberCount: 8 },
    ],
  },
};

const meta: Meta<typeof GroupsPage> = {
  title: 'Pages/Organizations/Groups',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByNameGroups}
      variables={{ name: 'test-organization', limit: null }}
      mockData={mockData}
    >
      {queryRef => <GroupsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof GroupsPage>;

export const Default: Story = {};
