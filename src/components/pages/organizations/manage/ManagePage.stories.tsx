import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationManageData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/manage/page';
import organizationByNameManage from '@/lib/query/organizations/organizationByName.manage';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import ManagePage from './ManagePage';

const mockData: OrganizationManageData = {
  organization: {
    id: 1,
    name: 'test-organization',
    owners: [
      { id: '1', firstName: 'Alice', lastName: 'Owner', email: 'alice@example.com', owner: true, admin: null, groupRoles: [{ id: 'g1' }] },
      { id: '2', firstName: 'Bob', lastName: 'Admin', email: 'bob@example.com', owner: null, admin: true, groupRoles: [{ id: 'g1' }] },
      { id: '3', firstName: 'Charlie', lastName: 'Viewer', email: 'charlie@example.com', owner: null, admin: null, groupRoles: [{ id: 'g1' }] },
    ],
  },
};

const meta: Meta<typeof ManagePage> = {
  title: 'Pages/Organizations/Manage',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByNameManage}
      variables={{ name: 'test-organization' }}
      mockData={mockData}
    >
      {queryRef => <ManagePage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ManagePage>;

export const Default: Story = {};
