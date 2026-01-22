import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';
import { expect, userEvent, waitFor, within } from '@storybook/test';

import { TaskData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/tasks/[taskSlug]/page';
import environmentWithTask from '@/lib/query/environmentWithTask';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import { InitialMockState } from '../../../../.storybook/mocks/storyHelpers';
import TaskPage from './TaskPage';

const completedTaskLogs = `##############################################
BEGIN Task Setup
##############################################
Initializing task environment...
Connecting to service: cli
##############################################
STEP Task Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Execute Command
##############################################
Running: drush cache-clear
Clearing all caches...
[success] Cache rebuild complete.
##############################################
STEP Execute Command: Completed at 2024-01-01 10:00:30 (UTC) Duration 00:00:28 Elapsed 00:00:30
##############################################
##############################################
BEGIN Cleanup
##############################################
Disconnecting from service...
Task completed successfully.
##############################################
STEP Cleanup: Completed at 2024-01-01 10:00:32 (UTC) Duration 00:00:02 Elapsed 00:00:32
##############################################`;

const runningTaskLogs = `##############################################
BEGIN Task Setup
##############################################
Initializing task environment...
Connecting to service: cli
##############################################
STEP Task Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Execute Command
##############################################
Running: drush sql-sync @prod @dev
Fetching database from production...
Downloading: 45% complete...`;

const failedTaskLogs = `##############################################
BEGIN Task Setup
##############################################
Initializing task environment...
Connecting to service: cli
##############################################
STEP Task Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Execute Command
##############################################
Running: drush updatedb
Error: Database connection failed
SQLSTATE[HY000] [2002] Connection refused
##############################################
STEP Execute Command: FAILED at 2024-01-01 10:00:15 (UTC) Duration 00:00:13 Elapsed 00:00:15
##############################################`;

const now = Date.now();
const oneHour = 3600000;

type TaskFile = {
  id: number;
  filename: string;
  download: string;
  created: string;
};

type TaskEnvironment = {
  id: number;
  name: string;
  openshiftProjectName: string;
  project: {
    id: number;
    name: string;
  };
  tasks: Array<{
    id: number;
    name: string;
    taskName: string;
    status: string;
    created: string;
    started: string | null;
    completed: string | null;
    service: string;
    adminOnlyView: boolean;
    logs: string;
    files: TaskFile[];
  }>;
};

const initialEnvironment: TaskEnvironment = {
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
      status: 'running',
      created: new Date(now - oneHour).toISOString(),
      started: new Date(now - oneHour + 100000).toISOString(),
      completed: null,
      service: 'cli',
      adminOnlyView: false,
      logs: runningTaskLogs,
      files: [],
    },
  ],
};

const createTaskMockState = (environment: typeof initialEnvironment): InitialMockState => ({
  task: {
    'task-1234': environment,
  },
});

const meta: Meta<typeof TaskPage> = {
  title: 'Pages/Environment/Task',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
    initialMockState: createTaskMockState(initialEnvironment),
  },
  render: () => (
    <MockPreloadQuery<TaskData, { openshiftProjectName: string; taskName: string }>
      query={environmentWithTask}
      variables={{ openshiftProjectName: 'project-main', taskName: 'task-1234' }}
    >
      {queryRef => <TaskPage queryRef={queryRef} taskName="task-1234" />}
    </MockPreloadQuery>
  ),
};

export default meta;

type Story = StoryObj<typeof TaskPage>;

export const Default: Story = {};

export const Completed: Story = {
  parameters: {
    initialMockState: createTaskMockState({
      ...initialEnvironment,
      tasks: [
        {
          ...initialEnvironment.tasks[0],
          status: 'complete',
          completed: new Date(now - oneHour + 400000).toISOString(),
          logs: completedTaskLogs,
        },
      ],
    }),
  },
};

export const Failed: Story = {
  parameters: {
    initialMockState: createTaskMockState({
      ...initialEnvironment,
      tasks: [
        {
          ...initialEnvironment.tasks[0],
          status: 'failed',
          completed: new Date(now - oneHour + 200000).toISOString(),
          logs: failedTaskLogs,
        },
      ],
    }),
  },
};

export const WithFiles: Story = {
  parameters: {
    initialMockState: createTaskMockState({
      ...initialEnvironment,
      tasks: [
        {
          ...initialEnvironment.tasks[0],
          status: 'complete',
          completed: new Date(now - oneHour + 400000).toISOString(),
          logs: completedTaskLogs,
          files: [
            { id: 1, filename: 'database-backup.sql.gz', download: '', created: new Date(now - oneHour + 400000).toISOString() },
            { id: 2, filename: 'files-backup.tar.gz', download: '', created: new Date(now - oneHour + 400000).toISOString() },
          ],
        },
      ],
    }),
  },
};

export const CancelTask: Story = {
  parameters: {
    initialMockState: createTaskMockState(initialEnvironment),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await canvas.findByText('drush-cache-clear', {}, { timeout: 10000 });

    expect(canvas.getByText('running')).toBeInTheDocument();

    const cancelButton = canvas.getByRole('button', { name: /cancel-task/i });
    expect(cancelButton).toBeInTheDocument();

    await userEvent.click(cancelButton);

    await waitFor(
      () => {
        expect(canvas.getByText('Cancelled')).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  },
};
