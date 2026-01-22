import React from 'react';

import { PreferencesData } from '@/app/(routegroups)/settings/preferences/page';
import me from '@/lib/query/me';
import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import PreferencesPage from './PreferencesPage';

const createPreferencesMockState = (preferences: {
  sshKeyChanges: boolean;
  groupRoleChanges: boolean;
  organizationRoleChanges: boolean;
}) => ({
  userPreferences: {
    current: preferences,
  },
});

const initialPreferences = {
  sshKeyChanges: true,
  groupRoleChanges: true,
  organizationRoleChanges: false,
};

const meta: Meta<typeof PreferencesPage> = {
  title: 'Pages/Settings/Preferences',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createPreferencesMockState(initialPreferences),
  },
  render: () => (
    <MockPreloadQuery<PreferencesData, Record<string, never>> query={me} variables={{}}>
      {queryRef => <PreferencesPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof PreferencesPage>;

export const Default: Story = {};

export const UpdatePreferences: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('Email preferences', {}, { timeout: 10000 });

    const orgRoleCheckbox = canvas.getByRole('checkbox', { name: /organization role changes/i });
    expect(orgRoleCheckbox).not.toBeChecked();

    await userEvent.click(orgRoleCheckbox);
    expect(orgRoleCheckbox).toBeChecked();

    const updateButton = canvas.getByRole('button', { name: /update preferences/i });
    await userEvent.click(updateButton);

    await waitFor(
      () => {
        expect(orgRoleCheckbox).toBeChecked();
      },
      { timeout: 5000 }
    );
  },
};
