import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationProjectsData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/projects/(projects-page)/page';
import organizationByNameProjects from '@/lib/query/organizations/organizationByName.projects';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import OrgProjectsPage from './ProjectsPage';

const mockData: OrganizationProjectsData = {
  organization: {
    id: 1,
    name: 'test-organization',
    friendlyName: 'Test Organization',
    projects: [
      { id: 1, name: 'project-alpha', groupCount: 3 },
      { id: 2, name: 'project-beta', groupCount: 2 },
      { id: 3, name: 'project-gamma', groupCount: 5 },
      { id: 4, name: 'project-delta', groupCount: 1 },
    ],
    deployTargets: [
      { id: 1, name: 'production', friendlyName: 'Production Cluster', cloudProvider: 'aws', cloudRegion: 'us-east-1' },
      { id: 2, name: 'staging', friendlyName: 'Staging Cluster', cloudProvider: 'aws', cloudRegion: 'us-west-2' },
    ],
  },
};

const meta: Meta<typeof OrgProjectsPage> = {
  title: 'Pages/Organizations/Projects',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByNameProjects}
      variables={{ name: 'test-organization' }}
      mockData={mockData}
    >
      {queryRef => <OrgProjectsPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgProjectsPage>;

export const Default: Story = {};
