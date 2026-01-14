import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { BackupsData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/backups/page';
import environmentWithBackups from '@/lib/query/environmentWithBackups';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { createBackupsMockState } from '../../../../.storybook/mocks/storyHelpers';
import BackupsPage from './BackupsPage';

const initialEnvironment = {
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
        restoreLocation: 'https://storage.example.com/restore/backup-002.tar.gz',
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
    {
      id: '4',
      source: 'files',
      backupId: 'backup-004',
      created: new Date(Date.now() - 345600000).toISOString(),
      restore: {
        id: 3,
        status: 'failed',
        restoreLocation: null,
        restoreSize: null,
      },
    },
  ],
};

const meta: Meta<typeof BackupsPage> = {
  title: 'Pages/Environment/Backups',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createBackupsMockState('project-main', initialEnvironment),
  },
  render: () => (
    <MockPreloadQuery<BackupsData, { openshiftProjectName: string; limit: null }>
      query={environmentWithBackups}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
    >
      {queryRef => <BackupsPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof BackupsPage>;

export const Default: Story = {};

export const RetrieveBackup: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('backup-001', {}, { timeout: 10000 });

    const retrieveButton = canvasElement.querySelector('[data-cy="retrieve"]');
    if (!retrieveButton) {
      throw new Error('Retrieve button not found');
    }
    const button = retrieveButton.closest('button');
    if (!button) {
      throw new Error('Button not found');
    }
    await userEvent.click(button);

    await waitFor(
      () => {
        expect(canvas.getAllByText('Successful').length).toBeGreaterThan(1);
      },
      { timeout: 5000 }
    );
  },
};
