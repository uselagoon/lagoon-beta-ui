import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, fireEvent, screen, userEvent, waitFor, within } from '@storybook/test';

import { TasksData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import environmentWithTasks from '@/lib/query/environmentWithTasks';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import TasksPage from './TasksPage';

const initialTasks = [
  {
    adminOnlyView: false,
    created: new Date(Date.now() - 3600000).toISOString(),
    started: new Date(Date.now() - 3500000).toISOString(),
    completed: new Date(Date.now() - 3200000).toISOString(),
    id: 1,
    name: 'drush-cache-clear',
    service: 'cli',
    status: 'complete',
    taskName: 'task-1234',
  },
  {
    adminOnlyView: false,
    created: new Date(Date.now() - 1800000).toISOString(),
    started: new Date(Date.now() - 1700000).toISOString(),
    completed: null,
    id: 2,
    name: 'drush-sql-sync',
    service: 'cli',
    status: 'running',
    taskName: 'task-5678',
  },
];

const initialAdvancedTasks = [
  {
    id: 1,
    name: 'custom-backup',
    description: 'Create a custom backup',
    confirmationText: 'Are you sure you want to create a backup?',
    type: 'COMMAND',
    environment: 1,
    project: 1,
    service: 'cli',
    created: '2024-01-01T00:00:00Z',
    deleted: '0000-00-00 00:00:00',
    adminOnlyView: false,
    deployTokenInjection: false,
    projectKeyInjection: false,
    advancedTaskDefinitionArguments: [],
    command: 'drush cr',
    groupName: 'Custom Tasks',
  },
];

const taskEnvMeta = {
  id: 1,
  name: 'main',
  openshiftProjectName: 'project-main',
  project: {
    id: 1,
    name: 'test-project',
    problemsUi: true,
    factsUi: true,
    environments: [
      { id: 1, name: 'main' },
      { id: 2, name: 'develop' },
    ],
  },
};

const meta: Meta<typeof TasksPage> = {
  title: 'Pages/Environment/Tasks',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: {
      tasks: {
        'project-main': initialTasks,
      },
      advancedTasks: {
        'project-main': initialAdvancedTasks,
      },
      taskEnvironmentMeta: {
        'project-main': taskEnvMeta,
      },
    },
  },
  render: () => (
    <MockPreloadQuery<TasksData, { openshiftProjectName: string; limit: null }>
      query={environmentWithTasks}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
    >
      {queryRef => <TasksPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof TasksPage>;

export const Default: Story = {};

export const TriggerTask: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('drush-cache-clear', {}, { timeout: 10000 });

    const taskSelectTrigger = canvas.getByText('Select a task to run');
    fireEvent.click(taskSelectTrigger);

    await waitFor(async () => {
      const option = screen.getByText(/clear drupal caches/i);
      fireEvent.click(option);
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(canvas.getByText(/run task/i)).toBeInTheDocument();
    }, { timeout: 3000 });

    const runTaskButton = canvas.getByRole('button', { name: /run task/i });
    fireEvent.click(runTaskButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Pending')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};

export const CancelTask: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const runningText = await canvas.findByText('Running', {}, { timeout: 10000 });
    expect(runningText).toBeInTheDocument();

    const cancelIcon = canvasElement.querySelector('[data-cy="cancel-task"]');
    if (!cancelIcon) {
      throw new Error('Cancel icon not found');
    }

    const cancelButton = cancelIcon.closest('button');
    if (!cancelButton) {
      throw new Error('Cancel button not found');
    }
    fireEvent.click(cancelButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Cancelled')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
