import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import AttachRouteSheet from './AttachRouteSheet';

const meta: Meta<typeof AttachRouteSheet> = {
  title: 'Components/Sheets/AttachRouteSheet',
  component: AttachRouteSheet,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AttachRouteSheet>;

const mockEnvironments = [
  { id: 1, name: 'main', environmentType: 'production' },
  { id: 2, name: 'staging', environmentType: 'development' },
  { id: 3, name: 'develop', environmentType: 'development' },
];

export const Default: Story = {
  args: {
    projectName: 'my-project',
    domainName: 'app.example.com',
    environments: mockEnvironments as any,
    iconOnly: false,
  },
};

export const IconOnly: Story = {
  args: {
    projectName: 'my-project',
    domainName: 'app.example.com',
    environments: mockEnvironments as any,
    iconOnly: true,
  },
};

export const WithActiveStandby: Story = {
  args: {
    projectName: 'my-project',
    domainName: 'app.example.com',
    environments: mockEnvironments as any,
    prodEnvironment: 'main',
    standbyEnvironment: 'staging',
    iconOnly: false,
  },
};

export const Open: Story = {
  args: {
    projectName: 'my-project',
    domainName: 'app.example.com',
    environments: mockEnvironments as any,
    iconOnly: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole('button');
    await userEvent.click(trigger);
  },
};
