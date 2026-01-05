import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationProjectData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/[projectSlug]/page';
import projectAndOrganizationByName from '@/lib/query/organizations/projectAndOrganizationByName';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import OrgProjectPage from './OrgProjectPage';

const mockData: OrganizationProjectData = {
  organization: {
    id: 1,
    name: 'test-organization',
    description: 'A test organization',
    friendlyName: 'Test Organization',
    quotaGroup: 10,
    projects: [
      { id: 1, name: 'project-alpha' },
      { id: 2, name: 'project-beta' },
    ],
    groups: [
      { id: '1', name: 'developers', type: 'null', memberCount: 5 },
      { id: '2', name: 'admins', type: 'null', memberCount: 3 },
      { id: '3', name: 'testers', type: 'null', memberCount: 4 },
    ],
    slacks: [{ webhook: 'https://hooks.slack.com/...', name: 'dev-alerts', channel: '#dev', __typename: 'NotificationSlack' }],
    rocketchats: [],
    teams: [],
    webhook: [{ webhook: 'https://api.example.com/notify', name: 'custom-hook', __typename: 'NotificationWebhook' }],
    emails: [{ name: 'alerts', emailAddress: 'alerts@example.com', __typename: 'NotificationEmail' }],
  },
  project: {
    id: 1,
    name: 'project-alpha',
    groups: [
      { id: '1', name: 'developers', type: 'null', memberCount: 5 },
      { id: '4', name: 'project-alpha-default', type: 'project-default-group', memberCount: 1 },
    ],
    notifications: [
      { name: 'dev-alerts', type: 'slack' },
      { name: 'alerts', type: 'email' },
    ],
  },
};

const meta: Meta<typeof OrgProjectPage> = {
  title: 'Pages/Organizations/Project',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={projectAndOrganizationByName}
      variables={{ name: 'test-organization', project: 'project-alpha' }}
      mockData={mockData}
    >
      {queryRef => <OrgProjectPage queryRef={queryRef} projectSlug="project-alpha" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgProjectPage>;

export const Default: Story = {};
