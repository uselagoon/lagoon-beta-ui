import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { PreferencesData } from '@/app/(routegroups)/settings/preferences/page';
import me from '@/lib/query/me';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import PreferencesPage from './PreferencesPage';

const mockData: PreferencesData = {
  me: {
    id: 1,
    email: 'user@example.com',
    emailNotifications: {
      sshKeyChanges: true,
      groupRoleChanges: true,
      organizationRoleChanges: false,
    },
  },
};

const meta: Meta<typeof PreferencesPage> = {
  title: 'Pages/Settings/Preferences',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery query={me} variables={{}} mockData={mockData}>
      {queryRef => <PreferencesPage queryRef={queryRef} />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof PreferencesPage>;

export const Default: Story = {};
