import type { Meta, StoryObj } from '@storybook/react';

import LogViewer from './LogViewer';

const sampleLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Setting up environment variables...
Configuring build parameters...
Initializing containers...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-15 10:00:00 (UTC) Duration 00:00:05 Elapsed 00:00:05
##############################################
##############################################
BEGIN Build Process
##############################################
Running npm install...
Installing dependencies...
npm WARN deprecated package@1.0.0: This package is deprecated
Building application...
Build successful!
##############################################
STEP Build Process: Completed at 2024-01-15 10:00:30 (UTC) Duration 00:00:25 Elapsed 00:00:30
##############################################
##############################################
BEGIN Deploy
##############################################
Pushing to registry...
Deploying to cluster...
Deployment complete!
##############################################
STEP Deploy: Completed at 2024-01-15 10:01:00 (UTC) Duration 00:00:30 Elapsed 00:01:00
##############################################`;

const errorLogs = `##############################################
BEGIN Initial Setup
##############################################
Starting build...
##############################################
STEP Initial Setup: Completed at 2024-01-15 10:00:00 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Build
##############################################
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
npm ERR! Found: react@18.2.0
npm ERR! Could not resolve dependency
Build failed!`;

const warningLogs = `##############################################
BEGIN Build Process
##############################################
npm WARN deprecated request@2.88.2: request has been deprecated
npm WARN deprecated uuid@3.4.0: Please upgrade to version 7 or higher
Building with warnings...
##############################################
STEP Build Process: Completed at 2024-01-15 10:00:15 (UTC) Duration 00:00:15 Elapsed 00:00:15 WithWarnings
##############################################`;

const simpleLogs = `Starting deployment...
Pulling images...
Running migrations...
Deployment complete!`;

const meta: Meta<typeof LogViewer> = {
  title: 'Components/Display/LogViewer',
  component: LogViewer,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    showParsed: { control: 'boolean' },
    highlightWarnings: { control: 'boolean' },
    showSuccessSteps: { control: 'boolean' },
    forceLastSectionOpen: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof LogViewer>;

export const DeploymentLogs: Story = {
  args: {
    logs: sampleLogs,
    status: 'COMPLETE',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: false,
    logsTarget: 'deployment',
  },
};

export const RunningDeployment: Story = {
  args: {
    logs: sampleLogs,
    status: 'RUNNING',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: true,
    logsTarget: 'deployment',
  },
};

export const FailedDeployment: Story = {
  args: {
    logs: errorLogs,
    status: 'FAILED',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: true,
    logsTarget: 'deployment',
  },
};

export const WithWarnings: Story = {
  args: {
    logs: warningLogs,
    status: 'COMPLETE',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: false,
    logsTarget: 'deployment',
  },
};

export const RawLogs: Story = {
  args: {
    logs: sampleLogs,
    status: 'COMPLETE',
    showParsed: false,
    highlightWarnings: false,
    showSuccessSteps: true,
    forceLastSectionOpen: false,
    logsTarget: 'deployment',
  },
};

export const TaskLogs: Story = {
  args: {
    logs: simpleLogs,
    status: 'COMPLETE',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: false,
    logsTarget: 'task',
    taskDuration: '00:02:30',
  },
};

export const NoLogs: Story = {
  args: {
    logs: null,
    status: 'PENDING',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: true,
    forceLastSectionOpen: false,
    logsTarget: 'deployment',
  },
};

export const HideSuccessSteps: Story = {
  args: {
    logs: warningLogs,
    status: 'COMPLETE',
    showParsed: true,
    highlightWarnings: true,
    showSuccessSteps: false,
    forceLastSectionOpen: false,
    logsTarget: 'deployment',
  },
};
