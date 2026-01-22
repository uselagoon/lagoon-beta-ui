import React from 'react';

import { SettingsData } from '@/app/(routegroups)/settings/(ssh-keys)/page';
import me from '@/lib/query/me';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, screen, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { sleep } from '../../../../.storybook/mocks/storyHelpers';
import SettingsPage from './SettingsPage';

const initialKeys = [
  {
    id: 1,
    name: 'my-laptop',
    keyType: 'ssh-ed25519',
    keyValue: 'AAAAC3NzaC1lZDI1NTE5AAAAIExample...',
    keyFingerprint: 'SHA256:abcdefghijklmnop',
    created: '2024-01-15T10:30:00Z',
    lastUsed: '2024-06-01T14:00:00Z',
  },
  {
    id: 2,
    name: 'work-desktop',
    keyType: 'ssh-rsa',
    keyValue: 'AAAAB3NzaC1yc2EAAAADAQABAAABExample...',
    keyFingerprint: 'SHA256:qrstuvwxyz123456',
    created: '2024-02-20T08:00:00Z',
    lastUsed: '2024-05-28T09:30:00Z',
  },
];

const meta: Meta<typeof SettingsPage> = {
  title: 'Pages/Settings/SSHKeys',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      sshKeys: {
        user: initialKeys,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<SettingsData, Record<string, never>> query={me} variables={{}}>
      {queryRef => <SettingsPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof SettingsPage>;

export const List: Story = {};

export const AddSSHKey: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const addButton = await canvas.findByRole('button', { name: /add new key/i }, { timeout: 10000 });
    await userEvent.click(addButton);

    const nameInput = await screen.findByLabelText(/key name/i);
    await userEvent.type(nameInput, 'new-test-key');

    const valueInput = await screen.findByLabelText(/key value/i);
    await userEvent.type(valueInput, 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAINewTestKey');

    const saveButton = await screen.findByRole('button', { name: /save/i });
    await userEvent.click(saveButton);

    await canvas.findByText(content => content.trim().endsWith('new-test-key'), {}, { timeout: 5000 });
  },
};

export const DeleteSSHKey: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText(content => content.trim().endsWith('my-laptop'), {}, { timeout: 10000 });

    await sleep(500);

    const deleteButton = (await canvas.findAllByRole('button', { name: 'delete-key' }))?.[0];
    if (!deleteButton) {
      throw new Error('Delete button not found');
    }
    await userEvent.click(deleteButton);

    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    await userEvent.click(confirmButton);

    await waitFor(
      () => {
        expect(canvas.queryByText('my-laptop')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
