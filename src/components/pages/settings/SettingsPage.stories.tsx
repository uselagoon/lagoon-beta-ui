import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { SettingsData } from '@/app/(routegroups)/settings/(ssh-keys)/page';
import me from '@/lib/query/me';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import SettingsPage from './SettingsPage';

const mockData: SettingsData = {
  me: {
    id: 1,
    email: 'user@example.com',
    sshKeys: [
      {
        id: 1,
        name: 'my-laptop',
        created: '2024-01-15T10:30:00Z',
        keyType: 'ssh-ed25519',
        keyValue: 'AAAAC3NzaC1lZDI1NTE5AAAAIExample...',
        keyFingerprint: 'SHA256:abcdefghijklmnop',
        lastUsed: '2024-06-01T14:00:00Z',
      },
      {
        id: 2,
        name: 'work-desktop',
        created: '2024-02-20T08:00:00Z',
        keyType: 'ssh-rsa',
        keyValue: 'AAAAB3NzaC1yc2EAAAADAQABAAABExample...',
        keyFingerprint: 'SHA256:qrstuvwxyz123456',
        lastUsed: '2024-05-28T09:30:00Z',
      },
    ],
  },
};

const meta: Meta<typeof SettingsPage> = {
  title: 'Pages/Settings/SSHKeys',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery query={me} variables={{}} mockData={mockData}>
      {queryRef => <SettingsPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof SettingsPage>;

export const Default: Story = {};
