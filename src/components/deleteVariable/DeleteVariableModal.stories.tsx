import type { Meta, StoryObj } from '@storybook/react';
import { userEvent, within } from '@storybook/test';

import { DeleteVariableDialog } from './DeleteVariableModal';

const meta: Meta<typeof DeleteVariableDialog> = {
  title: 'Components/Dialogs/DeleteVariable',
  component: DeleteVariableDialog,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof DeleteVariableDialog>;

export const ProjectVariable: Story = {
  args: {
    currentEnv: {
      id: 1,
      name: 'API_KEY',
      value: 'secret-value',
      scope: 'BUILD',
    },
    refetch: () => {},
    type: 'project',
    projectName: 'my-project',
  } as any,
};

export const EnvironmentVariable: Story = {
  args: {
    currentEnv: {
      id: 2,
      name: 'DATABASE_URL',
      value: 'postgres://localhost:5432/db',
      scope: 'RUNTIME',
    },
    refetch: () => {},
    type: 'environment',
    environmentName: 'main',
    projectName: 'my-project',
  } as any,
};

export const OrganizationVariable: Story = {
  args: {
    currentEnv: {
      id: 3,
      name: 'ORG_SECRET',
      value: 'org-secret-value',
      scope: 'GLOBAL',
    },
    refetch: () => {},
    type: 'organization',
    orgName: 'my-organization',
  } as any,
};

export const Open: Story = {
  args: {
    currentEnv: {
      id: 1,
      name: 'API_KEY',
      value: 'secret-value',
      scope: 'BUILD',
    },
    refetch: () => {},
    type: 'project',
    projectName: 'my-project',
  } as any,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = (await canvas.findAllByRole('button'))[0];
    await userEvent.click(trigger);
  },
};
