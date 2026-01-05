import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/(organization-overview)/page';
import organizationByName from '@/lib/query/organizations/organizationByName';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import OrganizationPage from './OrganizationPage';

const mockData: OrganizationData = {
  organization: {
    id: 1,
    name: 'test-organization',
    description: 'A test organization for development purposes',
    friendlyName: 'Test Organization',
    quotaProject: 10,
    quotaGroup: 5,
    quotaNotification: 20,
    quotaEnvironment: 50,
    deployTargets: [
      { id: 1, name: 'production', friendlyName: 'Production Cluster', cloudProvider: 'aws', cloudRegion: 'us-east-1' },
      { id: 2, name: 'staging', friendlyName: 'Staging Cluster', cloudProvider: 'aws', cloudRegion: 'us-west-2' },
    ],
    owners: [
      { id: '1', firstName: 'Alice', lastName: 'Owner', email: 'alice@example.com', owner: true, admin: null },
      { id: '2', firstName: 'Bob', lastName: 'Admin', email: 'bob@example.com', owner: null, admin: true },
    ],
    projects: [
      { id: 1, name: 'project-alpha', groupCount: 3 },
      { id: 2, name: 'project-beta', groupCount: 2 },
      { id: 3, name: 'project-gamma', groupCount: 1 },
    ],
    environments: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    groups: [
      { id: '1', name: 'developers', type: 'null', memberCount: 5 },
      { id: '2', name: 'admins', type: 'null', memberCount: 3 },
    ],
    slacks: [{ webhook: 'https://hooks.slack.com/...', name: 'dev-alerts', channel: '#dev', __typename: 'NotificationSlack' }],
    rocketchats: [],
    teams: [],
    webhook: [],
    emails: [{ name: 'alerts', emailAddress: 'alerts@example.com', __typename: 'NotificationEmail' }],
  },
};

const meta: Meta<typeof OrganizationPage> = {
  title: 'Pages/Organizations/Overview',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByName}
      variables={{ name: 'test-organization' }}
      mockData={mockData}
    >
      {queryRef => <OrganizationPage queryRef={queryRef} orgSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrganizationPage>;

export const Default: Story = {};
