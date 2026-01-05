import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationGroupData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/groups/[groupSlug]/page';
import groupByNameAndOrganization from '@/lib/query/organizations/groupByNameAndOrganization';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import GroupPage from './GroupPage';

const mockData: OrganizationGroupData = {
  organization: {
    id: 1,
    name: 'test-organization',
    friendlyName: 'Test Organization',
    description: 'A test organization',
    quotaProject: 10,
    quotaGroup: 5,
    quotaNotification: 20,
    quotaEnvironment: 50,
    deployTargets: [
      { id: 1, name: 'production-cluster' },
      { id: 2, name: 'staging-cluster' },
    ],
    projects: [
      { id: 1, name: 'project-alpha' },
      { id: 2, name: 'project-beta' },
      { id: 3, name: 'project-gamma' },
    ],
  },
  group: {
    id: '1',
    name: 'developers',
    type: 'null',
    projects: [
      { id: 1, name: 'project-alpha' },
      { id: 2, name: 'project-beta' },
    ],
    members: [
      { role: 'OWNER', user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com' } },
      { role: 'MAINTAINER', user: { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com' } },
      { role: 'DEVELOPER', user: { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com' } },
      { role: 'GUEST', user: { firstName: 'Diana', lastName: 'Lee', email: 'diana@example.com' } },
    ],
  },
};

const meta: Meta<typeof GroupPage> = {
  title: 'Pages/Organizations/Group',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={groupByNameAndOrganization}
      variables={{ name: 'developers', organization: 1 }}
      mockData={mockData}
    >
      {queryRef => <GroupPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof GroupPage>;

export const Default: Story = {};
