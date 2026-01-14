import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { DeleteRouteDialog } from './DeleteRoute';

const meta: Meta<typeof DeleteRouteDialog> = {
  title: 'Components/Dialogs/DeleteRoute',
  component: DeleteRouteDialog,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteRouteDialog>;

export const Default: Story = {
  args: {
    route: {
      id: 1,
      domain: 'app.example.com',
    },
    refetch: () => {},
    projectName: 'my-project',
  } as any,
};

export const LongDomain: Story = {
  args: {
    route: {
      id: 2,
      domain: 'very-long-subdomain.staging.my-application.example.com',
    },
    refetch: () => {},
    projectName: 'my-project',
  } as any,
};

export const Open: Story = {
  args: {
    route: {
      id: 1,
      domain: 'app.example.com',
    },
    refetch: () => {},
    projectName: 'my-project',
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
