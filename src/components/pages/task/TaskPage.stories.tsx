import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { TaskData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/[taskSlug]/page';
import environmentWithTask from '@/lib/query/environmentWithTask';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import TaskPage from './TaskPage';

const mockData: TaskData = {
  environment: {
    id: 1,
    name: 'main',
    openshiftProjectName: 'project-main',
    project: {
      id: 1,
      name: 'test-project',
    },
    tasks: [
      {
        id: 1,
        name: 'drush-cache-clear',
        taskName: 'task-1234',
        status: 'complete',
        created: new Date(Date.now() - 3600000).toISOString(),
        started: new Date(Date.now() - 3500000).toISOString(),
        completed: new Date(Date.now() - 3200000).toISOString(),
        service: 'cli',
        adminOnlyView: false,
        logs: `========================================
[2024-01-01 10:00:00] Starting task: drush-cache-clear
========================================
Clearing all caches...
Cache cleared successfully.
========================================
[2024-01-01 10:00:30] Task complete
========================================`,
        files: [],
      },
    ],
  },
};

const meta: Meta<typeof TaskPage> = {
  title: 'Pages/Environment/Task',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  render: () => (
    <MockPreloadQuery
      query={environmentWithTask}
      variables={{ openshiftProjectName: 'project-main', taskName: 'task-1234' }}
      mockData={mockData}
    >
      {queryRef => <TaskPage queryRef={queryRef} taskName="task-1234" />}
    </MockPreloadQuery>
  ),
};

export default meta;
type Story = StoryObj<typeof TaskPage>;

export const Default: Story = {};
