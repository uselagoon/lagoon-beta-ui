import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { ProblemsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/problems/page';
import environmentWithProblems from '@/lib/query/environmentWithProblems';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import ProblemsPage from './ProblemsPage';

const mockData: ProblemsData = {
  environment: {
    id: 1,
    openshiftProjectName: 'project-main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
    },
    problems: [
      {
        id: 1,
        identifier: 'CVE-2024-1234',
        environment: { id: 1, name: 'main' },
        data: {},
        severity: 'CRITICAL',
        source: 'trivy',
        service: 'cli',
        created: new Date(Date.now() - 86400000).toISOString(),
        deleted: '0000-00-00 00:00:00',
        severityScore: 9.8,
        associatedPackage: 'openssl',
        description: 'Critical vulnerability in OpenSSL affecting TLS connections',
        version: '1.1.1k',
        fixedVersion: '1.1.1l',
        links: 'https://nvd.nist.gov/vuln/detail/CVE-2024-1234',
      },
      {
        id: 2,
        identifier: 'CVE-2024-5678',
        environment: { id: 1, name: 'main' },
        data: {},
        severity: 'HIGH',
        source: 'trivy',
        service: 'nginx',
        created: new Date(Date.now() - 172800000).toISOString(),
        deleted: '0000-00-00 00:00:00',
        severityScore: 7.5,
        associatedPackage: 'nginx',
        description: 'High severity vulnerability in nginx HTTP parser',
        version: '1.21.0',
        fixedVersion: '1.21.5',
        links: 'https://nvd.nist.gov/vuln/detail/CVE-2024-5678',
      },
      {
        id: 3,
        identifier: 'CVE-2024-9012',
        environment: { id: 1, name: 'main' },
        data: {},
        severity: 'MEDIUM',
        source: 'trivy',
        service: 'php',
        created: new Date(Date.now() - 259200000).toISOString(),
        deleted: '0000-00-00 00:00:00',
        severityScore: 5.3,
        associatedPackage: 'php',
        description: 'Medium severity issue in PHP session handling',
        version: '8.1.0',
        fixedVersion: '8.1.5',
        links: 'https://nvd.nist.gov/vuln/detail/CVE-2024-9012',
      },
    ],
  },
};

const meta: Meta<typeof ProblemsPage> = {
  title: 'Pages/Environment/Problems',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithProblems}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => <ProblemsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof ProblemsPage>;

export const Default: Story = {};
