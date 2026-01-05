import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { BackupsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import environmentWithBackups from '@/lib/query/environmentWithBackups';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import BackupsPage from './BackupsPage';

const mockData: BackupsData = {
  environment: {
    id: 1,
    openshiftProjectName: 'project-main',
    deployType: 'branch',
    deployBaseRef: 'main',
    deployHeadRef: 'main',
    deployTitle: 'main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
    },
    backups: [
      {
        id: '1',
        source: 'mariadb',
        backupId: 'backup-001',
        created: new Date(Date.now() - 86400000).toISOString(),
        restore: null,
      },
      {
        id: '2',
        source: 'files',
        backupId: 'backup-002',
        created: new Date(Date.now() - 172800000).toISOString(),
        restore: {
          id: 1,
          status: 'successful',
          restoreLocation: '/restore/backup-002',
          restoreSize: 1024000,
        },
      },
      {
        id: '3',
        source: 'mariadb',
        backupId: 'backup-003',
        created: new Date(Date.now() - 259200000).toISOString(),
        restore: {
          id: 2,
          status: 'pending',
          restoreLocation: null,
          restoreSize: null,
        },
      },
    ],
  },
};

const meta: Meta<typeof BackupsPage> = {
  title: 'Pages/Environment/Backups',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithBackups}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => <BackupsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof BackupsPage>;

export const Default: Story = {};
