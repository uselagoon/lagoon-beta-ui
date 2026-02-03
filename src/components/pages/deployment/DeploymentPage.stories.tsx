import React from 'react';

import type { Meta, StoryObj } from '@storybook/react';

import { DeploymentData } from '@/app/(routegroups)/(projectroutes)/projects/[projectSlug]/[environmentSlug]/deployments/[deploymentSlug]/page';
import environmentWithDeployment from '@/lib/query/environmentWithDeployment';

import { MockPreloadQuery } from '../../../../.storybook/decorators/MockPreloadQuery';
import DeploymentPage from './DeploymentPage';

type DeploymentStatus = 'complete' | 'running' | 'failed' | 'error' | 'queued' | 'new' | 'cancelled';

type DeploymentArgs = {
  status: DeploymentStatus;
  withWarnings: boolean;
  isBulkDeployment: boolean;
};

const completedDeploymentLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Configuring environment variables...
Setting up build context...
Pulling base images...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Configure Container Registry
##############################################
Logging into container registry...
Registry authentication successful
##############################################
STEP Configure Container Registry: Completed at 2024-01-01 10:00:05 (UTC) Duration 00:00:03 Elapsed 00:00:05
##############################################
##############################################
BEGIN Build Image with Docker Compose
##############################################
Building nginx service...
Step 1/8 : FROM nginx:alpine
Step 2/8 : COPY nginx.conf /etc/nginx/nginx.conf
Step 3/8 : COPY . /app
Successfully built 8a7b3c4d5e6f
Successfully tagged project-main/nginx:latest
##############################################
STEP Build Image with Docker Compose: Completed at 2024-01-01 10:01:30 (UTC) Duration 00:01:25 Elapsed 00:01:30
##############################################
##############################################
BEGIN Push to Registry
##############################################
Pushing project-main/nginx:latest...
digest: sha256:abc123def456...
Pushed successfully
##############################################
STEP Push to Registry: Completed at 2024-01-01 10:02:00 (UTC) Duration 00:00:30 Elapsed 00:02:00
##############################################
##############################################
BEGIN Deploy to Kubernetes
##############################################
Applying Kubernetes manifests...
deployment.apps/nginx configured
service/nginx unchanged
Waiting for rollout...
deployment "nginx" successfully rolled out
##############################################
STEP Deploy to Kubernetes: Completed at 2024-01-01 10:03:00 (UTC) Duration 00:01:00 Elapsed 00:03:00
##############################################
##############################################
BEGIN Run Post-Rollout Tasks
##############################################
Running post-deployment hooks...
Clearing caches...
All post-rollout tasks completed
##############################################
STEP Run Post-Rollout Tasks: Completed at 2024-01-01 10:03:15 (UTC) Duration 00:00:15 Elapsed 00:03:15
##############################################`;

const runningDeploymentLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Configuring environment variables...
Setting up build context...
Pulling base images...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Configure Container Registry
##############################################
Logging into container registry...
Registry authentication successful
##############################################
STEP Configure Container Registry: Completed at 2024-01-01 10:00:05 (UTC) Duration 00:00:03 Elapsed 00:00:05
##############################################
##############################################
BEGIN Build Image with Docker Compose
##############################################
Building nginx service...
Step 1/8 : FROM nginx:alpine
 ---> a1b2c3d4e5f6
Step 2/8 : COPY nginx.conf /etc/nginx/nginx.conf
 ---> Using cache
Step 3/8 : COPY . /app
 ---> Running...
Installing dependencies from package.json...`;

const failedDeploymentLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Configuring environment variables...
Setting up build context...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Configure Container Registry
##############################################
Logging into container registry...
Registry authentication successful
##############################################
STEP Configure Container Registry: Completed at 2024-01-01 10:00:05 (UTC) Duration 00:00:03 Elapsed 00:00:05
##############################################
##############################################
BEGIN Build Image with Docker Compose
##############################################
Building nginx service...
Step 1/8 : FROM nginx:alpine
Step 2/8 : COPY nginx.conf /etc/nginx/nginx.conf
COPY failed: file not found in build context: nginx.conf
ERROR: Service 'nginx' failed to build
##############################################
STEP Build Image with Docker Compose: FAILED at 2024-01-01 10:00:35 (UTC) Duration 00:00:30 Elapsed 00:00:35
##############################################`;

const cancelledDeploymentLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Configuring environment variables...
Setting up build context...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02
##############################################
##############################################
BEGIN Configure Container Registry
##############################################
Logging into container registry...

BUILD CANCELLED BY USER

Cleaning up resources...
Build cancelled at 2024-01-01 10:00:10 (UTC)`;

const warningDeploymentLogs = `##############################################
BEGIN Initial Environment Setup
##############################################
Configuring environment variables...
Setting up build context...
WARNING: Using deprecated environment variable format
Pulling base images...
##############################################
STEP Initial Environment Setup: Completed at 2024-01-01 10:00:02 (UTC) Duration 00:00:02 Elapsed 00:00:02 WithWarnings
##############################################
##############################################
BEGIN Configure Container Registry
##############################################
Logging into container registry...
Registry authentication successful
##############################################
STEP Configure Container Registry: Completed at 2024-01-01 10:00:05 (UTC) Duration 00:00:03 Elapsed 00:00:05
##############################################
##############################################
BEGIN Build Image with Docker Compose
##############################################
Building nginx service...
Step 1/8 : FROM nginx:alpine
WARNING: Image nginx:alpine is deprecated, consider using nginx:1.25-alpine
Step 2/8 : COPY nginx.conf /etc/nginx/nginx.conf
Step 3/8 : COPY . /app
WARN: Large file detected: dist/bundle.js (15MB)
Successfully built 8a7b3c4d5e6f
##############################################
STEP Build Image with Docker Compose: Completed at 2024-01-01 10:01:30 (UTC) Duration 00:01:25 Elapsed 00:01:30 WithWarnings
##############################################
##############################################
BEGIN Deploy to Kubernetes
##############################################
Applying Kubernetes manifests...
deployment.apps/nginx configured
service/nginx unchanged
WARNING: Resource limits not set for container nginx
Waiting for rollout...
deployment "nginx" successfully rolled out
##############################################
STEP Deploy to Kubernetes: Completed at 2024-01-01 10:03:00 (UTC) Duration 00:01:30 Elapsed 00:03:00 WithWarnings
##############################################`;

const getDeploymentConfig = (status: DeploymentStatus) => {
  const configs: Record<DeploymentStatus, { buildLog: string; buildStep: string | null; hasStarted: boolean; hasCompleted: boolean }> = {
    complete: { buildLog: completedDeploymentLogs, buildStep: null, hasStarted: true, hasCompleted: true },
    running: { buildLog: runningDeploymentLogs, buildStep: 'Building nginx', hasStarted: true, hasCompleted: false },
    failed: { buildLog: failedDeploymentLogs, buildStep: null, hasStarted: true, hasCompleted: true },
    error: { buildLog: failedDeploymentLogs, buildStep: null, hasStarted: true, hasCompleted: true },
    queued: { buildLog: 'Waiting for available build slot...\nPosition in queue: 3', buildStep: 'Waiting', hasStarted: false, hasCompleted: false },
    new: { buildLog: 'Initializing deployment...', buildStep: 'Initializing', hasStarted: false, hasCompleted: false },
    cancelled: { buildLog: cancelledDeploymentLogs, buildStep: null, hasStarted: true, hasCompleted: true },
  };
  return configs[status];
};

const createMockData = (args: DeploymentArgs): DeploymentData => {
  const config = getDeploymentConfig(args.status);
  const buildLog = args.withWarnings ? warningDeploymentLogs : config.buildLog;
  return {
    environment: {
      openshiftProjectName: 'project-main',
      project: {
        name: 'test-project',
        problemsUi: true,
        factsUi: true,
      },
      deployments: [
        {
          id: 1,
          name: 'build-42',
          status: args.status,
          created: new Date(Date.now() - 3600000).toISOString(),
          buildStep: config.buildStep,
          started: config.hasStarted ? new Date(Date.now() - 3500000).toISOString() : null,
          completed: config.hasCompleted ? new Date(Date.now() - 3200000).toISOString() : null,
          bulkId: args.isBulkDeployment ? 'bulk-deploy-2024-001' : null,
          priority: 5,
          buildLog,
        },
      ],
    },
  };
};

const meta = {
  title: 'Pages/Environment/Deployment',
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
    },
  },
  args: {
    status: 'complete' as DeploymentStatus,
    withWarnings: false,
    isBulkDeployment: false,
  },
  argTypes: {
    status: {
      control: 'select',
      options: ['new', 'queued', 'running', 'complete', 'failed', 'cancelled'] as DeploymentStatus[],
    },
    withWarnings: {
      control: 'boolean',
    },
    isBulkDeployment: {
      control: 'boolean',
    },
  },
  render: (args: DeploymentArgs) => {
    const mockData = createMockData(args);
    const key = JSON.stringify(args);
    return (
      <MockPreloadQuery
        key={key}
        query={environmentWithDeployment}
        variables={{ openshiftProjectName: 'project-main', deploymentName: 'build-42' }}
        mockData={mockData}
      >
        {queryRef => <DeploymentPage queryRef={queryRef} deploymentName="build-42" />}
      </MockPreloadQuery>
    );
  },
} satisfies Meta<DeploymentArgs>;

export default meta;
type Story = StoryObj<DeploymentArgs>;

export const Default: Story = {};

export const Running: Story = {
  args: { status: 'running' },
};

export const Failed: Story = {
  args: { status: 'failed' },
};

export const Cancelled: Story = {
  args: { status: 'cancelled' },
};
