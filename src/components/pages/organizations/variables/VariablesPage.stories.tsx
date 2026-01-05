import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { OrganizationVariablesData } from '@/app/(routegroups)/(orgroutes)/organizations/[organizationSlug]/variables/page';
import organizationByNameWithEnvVars from '@/lib/query/organizations/organizationByNameWithEnvVars';

import { MockPreloadQuery } from '../../../../../.storybook/decorators/MockPreloadQuery';
import OrgVariablesPage from './VariablesPage';

const mockData: OrganizationVariablesData = {
  organization: {
    id: 1,
    name: 'test-organization',
    envVariables: [
      { id: 1, name: 'API_KEY', scope: 'GLOBAL' },
      { id: 2, name: 'DATABASE_URL', scope: 'BUILD' },
      { id: 3, name: 'CACHE_TTL', scope: 'RUNTIME' },
      { id: 4, name: 'SECRET_TOKEN', scope: 'GLOBAL' },
    ],
  },
};

const meta: Meta<typeof OrgVariablesPage> = {
  title: 'Pages/Organizations/Variables',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={organizationByNameWithEnvVars}
      variables={{ name: 'test-organization' }}
      mockData={mockData}
    >
      {queryRef => <OrgVariablesPage queryRef={queryRef} organizationSlug="test-organization" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof OrgVariablesPage>;

export const Default: Story = {};
