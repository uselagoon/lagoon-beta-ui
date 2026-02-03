import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import AddRestore from './AddRestore';

const meta: Meta<typeof AddRestore> = {
  title: 'Components/Actions/AddRestore',
  component: AddRestore,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddRestore>;

export const NoRestore: Story = {
  args: {
    backup: {
      id: 1,
      backupId: 'backup-123',
      source: 'nginx',
      created: '2024-01-15T10:00:00Z',
      restore: null,
    },
    environmentID: 1,
  } as any,
};

export const RestorePending: Story = {
  args: {
    backup: {
      id: 2,
      backupId: 'backup-456',
      source: 'mariadb',
      created: '2024-01-15T10:00:00Z',
      restore: {
        status: 'pending',
        restoreLocation: null,
        restoreSize: null,
      },
    },
    environmentID: 1,
  } as any,
};

export const RestoreReady: Story = {
  args: {
    backup: {
      id: 3,
      backupId: 'backup-789',
      source: 'files',
      created: '2024-01-15T10:00:00Z',
      restore: {
        status: 'successful',
        restoreLocation: 'https://storage.example.com/restore/backup-789.tar.gz',
        restoreSize: 104857600,
      },
    },
    environmentID: 1,
  } as any,
};

export const RestoreFailed: Story = {
  args: {
    backup: {
      id: 4,
      backupId: 'backup-failed',
      source: 'nginx',
      created: '2024-01-15T10:00:00Z',
      restore: {
        status: 'failed',
        restoreLocation: null,
        restoreSize: null,
      },
    },
    environmentID: 1,
  } as any,
};

export const Open: Story = {
  args: {
    backup: {
      id: 1,
      backupId: 'backup-123',
      source: 'nginx',
      created: '2024-01-15T10:00:00Z',
      restore: null,
    },
    environmentID: 1,
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = (await canvas.findAllByRole('button'))[0];
    await userEvent.click(trigger);
  },
};
