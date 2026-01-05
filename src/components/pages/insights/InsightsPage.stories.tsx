import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { InsightsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/insights/page';
import environmentWIthInsightsAndFacts from '@/lib/query/environmentWIthInsightsAndFacts';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import InsightsPage from './InsightsPage';

const mockData: InsightsData = {
  environment: {
    id: 1,
    openshiftProjectName: 'project-main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
    },
    facts: [
      { id: 1, name: 'php-version', value: '8.2', source: 'lagoon', description: 'PHP Version' },
      { id: 2, name: 'drupal-version', value: '10.1', source: 'lagoon', description: 'Drupal Version' },
      { id: 3, name: 'node-version', value: '18.17.0', source: 'lagoon', description: 'Node.js Version' },
    ],
    insights: [
      {
        id: 1,
        created: new Date(Date.now() - 86400000).toISOString(),
        downloadUrl: 'https://example.com/download/1',
        file: 'sbom-report.json',
        fileId: 1,
        service: 'cli',
        size: '245KB',
        type: 'sbom',
      },
      {
        id: 2,
        created: new Date(Date.now() - 172800000).toISOString(),
        downloadUrl: 'https://example.com/download/2',
        file: 'vulnerability-scan.json',
        fileId: 2,
        service: 'cli',
        size: '128KB',
        type: 'vulnerability',
      },
    ],
  },
};

const meta: Meta<typeof InsightsPage> = {
  title: 'Pages/Environment/Insights',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWIthInsightsAndFacts}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => <InsightsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof InsightsPage>;

export const Default: Story = {};
