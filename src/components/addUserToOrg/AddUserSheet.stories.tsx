import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import AddUserSheet from './AddUserSheet';

const meta: Meta<typeof AddUserSheet> = {
  title: 'Components/Sheets/AddUserSheet',
  component: AddUserSheet,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddUserSheet>;

const mockGroupOptions = [
  { label: 'project-myproject', value: 'project-myproject' },
  { label: 'developers', value: 'developers' },
  { label: 'admins', value: 'admins' },
];

const mockRoleOptions = [
  { label: 'Maintainer', value: 'MAINTAINER' },
  { label: 'Developer', value: 'DEVELOPER' },
  { label: 'Reporter', value: 'REPORTER' },
  { label: 'Guest', value: 'GUEST' },
];

export const SingleGroup: Story = {
  args: {
    groupSelectOptions: [mockGroupOptions[0]],
    orgUserRoleOptions: mockRoleOptions,
    type: 'single',
    iconOnly: false,
  },
};

export const MultipleGroups: Story = {
  args: {
    groupSelectOptions: mockGroupOptions,
    orgUserRoleOptions: mockRoleOptions,
    type: 'multiple',
    iconOnly: false,
  },
};

export const IconOnly: Story = {
  args: {
    groupSelectOptions: mockGroupOptions,
    orgUserRoleOptions: mockRoleOptions,
    type: 'multiple',
    iconOnly: true,
  },
};

export const Open: Story = {
  args: {
    groupSelectOptions: mockGroupOptions,
    orgUserRoleOptions: mockRoleOptions,
    type: 'multiple',
    iconOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
