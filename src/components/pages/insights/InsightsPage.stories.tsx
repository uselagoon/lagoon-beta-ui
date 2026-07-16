import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { InsightsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/insights/page';
import environmentWIthInsightsAndFacts from '@/lib/query/environmentWIthInsightsAndFacts';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { InitialMockState } from '../../../../.storybook/mocks/storyHelpers';
import InsightsPage from './InsightsPage';

type InsightsEnvironment = {
  id: number;
  name: string;
  openshiftProjectName: string;
  project: {
    id: number;
    name: string;
    problemsUi: boolean;
    factsUi: boolean;
    featureApiRoutes?: boolean;
  };
  pendingChanges: Array<{ details: string }>;
  facts: Array<{
    id: number;
    name: string;
    value: string;
    source: string;
    description: string;
  }>;
  insights: Array<{
    id: number;
    created: string;
    downloadUrl?: string;
    file: string;
    fileId: number;
    service: string;
    size: string;
    type: string;
  }>;
};

const now = Date.now();
const oneDay = 86400000;

const initialEnvironment: InsightsEnvironment = {
  id: 1,
  name: 'main',
  openshiftProjectName: 'project-main',
  project: {
    id: 1,
    name: 'test-project',
    problemsUi: true,
    factsUi: true,
    featureApiRoutes: true,
  },
  pendingChanges: [],
  facts: [
    { id: 1, name: 'php-version', value: '8.2', source: 'lagoon', description: 'PHP Version' },
    { id: 2, name: 'drupal-version', value: '10.1', source: 'lagoon', description: 'Drupal Version' },
    { id: 3, name: 'node-version', value: '18.17.0', source: 'lagoon', description: 'Node.js Version' },
  ],
  insights: [
    {
      id: 1,
      created: new Date(now - oneDay).toISOString(),
      file: 'sbom-report.json',
      fileId: 1,
      service: 'cli',
      size: '245KB',
      type: 'sbom',
    },
    {
      id: 2,
      created: new Date(now - 2 * oneDay).toISOString(),
      file: 'vulnerability-scan.json',
      fileId: 2,
      service: 'cli',
      size: '128KB',
      type: 'vulnerability',
    },
  ],
};

const insightsDownloadData = [
  { id: 1, downloadUrl: 'https://example.com/download/sbom-report.json' },
  { id: 2, downloadUrl: 'https://example.com/download/vulnerability-scan.json' },
];

const createInsightsMockState = (environment: InsightsEnvironment): InitialMockState => ({
  insightsEnvironment: {
    'project-main': environment,
  },
  insightsDownload: {
    '1': insightsDownloadData,
  },
});

const meta: Meta<typeof InsightsPage> = {
  title: 'Pages/Environment/Insights',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createInsightsMockState(initialEnvironment),
  },
  render: () => (
    <MockPreloadQuery<InsightsData, { openshiftProjectName: string; limit: null }>
      query={environmentWIthInsightsAndFacts}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
    >
      {queryRef => <InsightsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof InsightsPage>;

export const Default: Story = {};

export const WithManyFacts: Story = {
  parameters: {
    initialMockState: createInsightsMockState({
      ...initialEnvironment,
      facts: [
        { id: 1, name: 'php-version', value: '8.2', source: 'lagoon', description: 'PHP Version' },
        { id: 2, name: 'drupal-version', value: '10.1', source: 'lagoon', description: 'Drupal Version' },
        { id: 3, name: 'node-version', value: '18.17.0', source: 'lagoon', description: 'Node.js Version' },
        { id: 4, name: 'composer-version', value: '2.5.8', source: 'lagoon', description: 'Composer Version' },
        { id: 5, name: 'nginx-version', value: '1.24.0', source: 'lagoon', description: 'Nginx Version' },
        { id: 6, name: 'mariadb-version', value: '10.11', source: 'lagoon', description: 'MariaDB Version' },
        { id: 7, name: 'redis-version', value: '7.0', source: 'lagoon', description: 'Redis Version' },
        { id: 8, name: 'solr-version', value: '8.11', source: 'lagoon', description: 'Solr Version' },
        { id: 9, name: 'varnish-version', value: '7.1', source: 'lagoon', description: 'Varnish Version' },
        { id: 10, name: 'elasticsearch-version', value: '8.9', source: 'lagoon', description: 'Elasticsearch Version' },
        { id: 11, name: 'python-version', value: '3.11', source: 'lagoon', description: 'Python Version' },
        { id: 12, name: 'ruby-version', value: '3.2', source: 'lagoon', description: 'Ruby Version' },
      ],
    }),
  },
};

export const EmptyInsights: Story = {
  parameters: {
    initialMockState: createInsightsMockState({
      ...initialEnvironment,
      insights: [],
    }),
  },
};
