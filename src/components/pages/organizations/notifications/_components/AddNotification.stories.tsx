import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { AddNotification } from './AddNotification';

const meta: Meta<typeof AddNotification> = {
  title: 'Components/Sheets/AddNotification',
  component: AddNotification,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AddNotification>;

export const Default: Story = {
  args: {
    orgId: 1,
    refetch: () => {},
  },
};

export const Open: Story = {
  args: {
    orgId: 1,
    refetch: () => {},
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
