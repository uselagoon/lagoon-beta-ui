import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { TasksData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/(tasks-page)/page';
import environmentWithTasks from '@/lib/query/environmentWithTasks';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import TasksPage from './TasksPage';

const mockData: TasksData = {
  environment: {
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
    tasks: [
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
    ],
    advancedTasks: [
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
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithTasks}
      variables={{ openshiftProjectName: 'project-main', limit: null }}
      mockData={mockData}
    >
      {queryRef => <TasksPage queryRef={queryRef} environmentSlug="project-main" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof TasksPage>;

export const Default: Story = {};
