import type {
  Backup,
  Deployment,
  EnvironmentRoute,
  Task,
  AdvancedTask,
  SSHKey,
  OrgUser,
  OrgGroup,
  GroupMember,
  GroupProject,
} from './storyHelpers';

export const defaultEnvVariables = [
  { id: 1, name: 'ENV_API_KEY', scope: 'GLOBAL' },
  { id: 2, name: 'ENV_DATABASE_URL', scope: 'BUILD' },
  { id: 3, name: 'ENV_CACHE_TTL', scope: 'RUNTIME' },
];

export const defaultEnvVariablesWithValues = [
  { id: 1, name: 'ENV_API_KEY', value: 'env-secret-api-key-123', scope: 'GLOBAL' },
  { id: 2, name: 'ENV_DATABASE_URL', value: 'postgres://localhost/envdb', scope: 'BUILD' },
  { id: 3, name: 'ENV_CACHE_TTL', value: '3600', scope: 'RUNTIME' },
];

export const defaultProjectVariables = [
  { id: 101, name: 'PROJECT_API_KEY', scope: 'GLOBAL' },
  { id: 102, name: 'PROJECT_DB_URL', scope: 'BUILD' },
];

export const defaultProjectVariablesWithValues = [
  { id: 101, name: 'PROJECT_API_KEY', value: 'project-secret-123', scope: 'GLOBAL' },
  { id: 102, name: 'PROJECT_DB_URL', value: 'postgres://project/db', scope: 'BUILD' },
];

export const defaultOrgVariables = [
  { id: 1, name: 'API_KEY', scope: 'GLOBAL' },
  { id: 2, name: 'DATABASE_URL', scope: 'BUILD' },
  { id: 3, name: 'CACHE_TTL', scope: 'RUNTIME' },
];

export const defaultOrgVariablesWithValues = [
  { id: 1, name: 'API_KEY', value: 'secret-api-key-123', scope: 'GLOBAL' },
  { id: 2, name: 'DATABASE_URL', value: 'postgres://localhost/db', scope: 'BUILD' },
  { id: 3, name: 'CACHE_TTL', value: '3600', scope: 'RUNTIME' },
];

export const defaultDeployments: Deployment[] = [
  {
    id: 1,
    name: 'build-1',
    status: 'complete',
    created: new Date(Date.now() - 3600000).toISOString(),
    buildStep: null,
    started: new Date(Date.now() - 3500000).toISOString(),
    completed: new Date(Date.now() - 3200000).toISOString(),
    bulkId: null,
    priority: 5,
    sourceType: 'WEBHOOK',
  },
  {
    id: 2,
    name: 'build-2',
    status: 'running',
    created: new Date(Date.now() - 1800000).toISOString(),
    buildStep: 'Running build',
    started: new Date(Date.now() - 1700000).toISOString(),
    completed: null,
    bulkId: null,
    priority: 5,
    sourceType: 'API',
  },
];

export const defaultTasks: Task[] = [
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
  },
  {
    id: 2,
    name: 'drush-sql-sync',
    taskName: 'task-5678',
    status: 'running',
    created: new Date(Date.now() - 1800000).toISOString(),
    started: new Date(Date.now() - 1700000).toISOString(),
    completed: null,
    service: 'cli',
    adminOnlyView: false,
  },
];

export const defaultAdvancedTasks: AdvancedTask[] = [
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

export const defaultBackups: Backup[] = [
  {
    id: '1',
    source: 'mariadb',
    backupId: 'backup-001',
    created: new Date(Date.now() - 86400000).toISOString(),
    restore: null,
  },
  {
    id: '2',
    source: 'files',
    backupId: 'backup-002',
    created: new Date(Date.now() - 172800000).toISOString(),
    restore: {
      id: 1,
      status: 'successful',
      restoreLocation: '/restore/backup-002',
      restoreSize: 1024000,
    },
  },
];

export const defaultRoutes: EnvironmentRoute[] = [
  {
    id: 1,
    domain: 'example.com',
    type: 'route',
    primary: true,
    service: 'nginx',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-06-15T14:20:00Z',
    source: 'API',
    environment: {
      id: 1,
      name: 'main',
      kubernetesNamespaceName: 'project-main',
      environmentType: 'production',
    },
  },
  {
    id: 2,
    domain: 'api.example.com',
    type: 'route',
    primary: false,
    service: 'api',
    created: '2024-02-20T08:00:00Z',
    updated: '2024-06-10T12:00:00Z',
    source: 'API',
    environment: {
      id: 1,
      name: 'main',
      kubernetesNamespaceName: 'project-main',
      environmentType: 'production',
    },
  },
];

export const defaultSSHKeys: SSHKey[] = [
  {
    id: 1,
    name: 'my-laptop',
    keyType: 'ssh-ed25519',
    keyValue: 'AAAAC3NzaC1lZDI1NTE5AAAAIExample...',
    keyFingerprint: 'SHA256:abcdefghijklmnop',
    created: '2024-01-15T10:30:00Z',
    lastUsed: '2024-06-01T14:00:00Z',
  },
  {
    id: 2,
    name: 'work-desktop',
    keyType: 'ssh-rsa',
    keyValue: 'AAAAB3NzaC1yc2EAAAADAQABAAABExample...',
    keyFingerprint: 'SHA256:qrstuvwxyz123456',
    created: '2024-02-20T08:00:00Z',
    lastUsed: '2024-05-28T09:30:00Z',
  },
];

export const defaultOrgUsers: OrgUser[] = [
  {
    id: '1',
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    groupRoles: [{ id: '1', role: 'OWNER' }],
    has2faEnabled: true,
    isFederatedUser: false,
  },
  {
    id: '2',
    firstName: 'Bob',
    lastName: 'Jones',
    email: 'bob@example.com',
    groupRoles: [{ id: '2', role: 'MAINTAINER' }],
    has2faEnabled: true,
    isFederatedUser: false,
  },
  {
    id: '3',
    firstName: 'Charlie',
    lastName: 'Brown',
    email: 'charlie@example.com',
    groupRoles: [{ id: '3', role: 'DEVELOPER' }],
    has2faEnabled: false,
    isFederatedUser: false,
  },
];

export const defaultOrgGroups: OrgGroup[] = [
  { id: '1', name: 'developers', type: 'null', memberCount: 5 },
  { id: '2', name: 'admins', type: 'null', memberCount: 3 },
  { id: '3', name: 'testers', type: 'null', memberCount: 8 },
];

export const defaultGroupMembers: GroupMember[] = [
  { role: 'OWNER', user: { firstName: 'Alice', lastName: 'Smith', email: 'alice@example.com', comment: null } },
  { role: 'MAINTAINER', user: { firstName: 'Bob', lastName: 'Jones', email: 'bob@example.com', comment: null } },
  { role: 'DEVELOPER', user: { firstName: 'Charlie', lastName: 'Brown', email: 'charlie@example.com', comment: null } },
];

export const defaultGroupProjects: GroupProject[] = [
  { id: 1, name: 'project-alpha' },
  { id: 2, name: 'project-beta' },
];

export const defaultOrgProjects: GroupProject[] = [
  { id: 1, name: 'project-alpha' },
  { id: 2, name: 'project-beta' },
  { id: 3, name: 'project-gamma' },
];

export const defaultOrgOwners = [
  { id: '1', firstName: 'Alice', lastName: 'Owner', email: 'alice@example.com', owner: true, admin: null, groupRoles: [{ id: 'g1' }] },
  { id: '2', firstName: 'Bob', lastName: 'Admin', email: 'bob@example.com', owner: null, admin: true, groupRoles: [{ id: 'g1' }] },
  { id: '3', firstName: 'Charlie', lastName: 'Viewer', email: 'charlie@example.com', owner: null, admin: null, groupRoles: [{ id: 'g1' }] },
];

export const defaultUserGroupRoles = [
  { id: '1', name: 'developers', role: 'OWNER', groupType: 'null' },
  { id: '2', name: 'project-alpha', role: 'MAINTAINER', groupType: 'null' },
];

export const defaultInsights = [
  { id: 1, downloadUrl: 'https://example.com/download/sbom-1.json' },
  { id: 2, downloadUrl: 'https://example.com/download/vuln-2.json' },
];

export const defaultUserPreferences = {
  sshKeyChanges: true,
  groupRoleChanges: true,
  organizationRoleChanges: true,
};

export const defaultDeployTargets = [
  { id: 1, name: 'production-cluster' },
  { id: 2, name: 'staging-cluster' },
];

export const defaultEmptyNotifications = {
  id: 1,
  name: '',
  slacks: [],
  rocketchats: [],
  teams: [],
  webhook: [],
  emails: [],
};

export function createDefaultEnvironment(openshiftProjectName: string) {
  return {
    id: 1,
    name: 'main',
    created: '2024-01-15T10:30:00Z',
    updated: '2024-06-15T14:20:00Z',
    deployType: 'branch',
    environmentType: 'production',
    routes: 'https://example.com,https://www.example.com',
    openshiftProjectName,
    project: {
      name: 'test-project',
      gitUrl: 'git@github.com:example/test-project.git',
      productionRoutes: 'https://example.com',
      standbyRoutes: null,
      productionEnvironment: 'main',
      standbyProductionEnvironment: null,
      problemsUi: 2,
      factsUi: 5,
      featureApiRoutes: true,
    },
    title: 'main',
    facts: [],
    pendingChanges: [],
  };
}

export function createDefaultProject(projectName: string) {
  return {
    id: 1,
    name: projectName,
    branches: 'main',
    pullrequests: 'true',
    created: '2024-01-01T00:00:00Z',
    gitUrl: 'git@github.com:example/project.git',
    productionEnvironment: 'main',
    standbyProductionEnvironment: null,
    productionRoutes: 'https://example.com',
    standbyRoutes: null,
    developmentEnvironmentsLimit: 5,
    deployTargetConfigs: [],
    environments: [
      {
        id: 1,
        name: 'main',
        deployType: 'branch',
        environmentType: 'production',
        routes: 'https://example.com',
        openshiftProjectName: `${projectName}-main`,
        openshift: { friendlyName: 'Production Cluster', cloudRegion: 'us-east-1' },
      },
    ],
  };
}

export function createDefaultEnvMeta(openshiftProjectName: string) {
  return {
    id: 1,
    name: 'main',
    openshiftProjectName,
    deployType: 'branch',
    deployBaseRef: 'main',
    deployHeadRef: 'main',
    deployTitle: 'main',
    project: {
      name: 'test-project',
      problemsUi: 0,
      factsUi: 5,
    },
  };
}

export function createDefaultTaskEnvMeta(openshiftProjectName: string) {
  return {
    id: 1,
    name: 'main',
    openshiftProjectName,
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
}

export function createDefaultBackupEnvMeta(openshiftProjectName: string) {
  return {
    id: 1,
    openshiftProjectName,
    deployType: 'branch',
    deployBaseRef: 'main',
    deployHeadRef: 'main',
    deployTitle: 'main',
    project: {
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
    },
  };
}

export function createDefaultRouteEnvMeta(openshiftProjectName: string) {
  return {
    id: 1,
    name: 'main',
    kubernetesNamespaceName: openshiftProjectName,
    openshiftProjectName,
    environmentType: 'production',
    project: {
      id: 1,
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
      productionEnvironment: 'main',
      standbyProductionEnvironment: undefined,
      environments: [
        { id: 1, name: 'main' },
        { id: 2, name: 'develop' },
      ],
    },
  };
}

export function createDefaultProjectRouteMeta(projectName: string) {
  return {
    id: 1,
    name: projectName,
    productionEnvironment: 'main',
    standbyProductionEnvironment: undefined,
    environments: [
      { id: 1, name: 'main', kubernetesNamespaceName: 'project-main' },
      { id: 2, name: 'develop', kubernetesNamespaceName: 'project-develop' },
    ],
  };
}

export function createDefaultInsightsEnv(openshiftProjectName: string) {
  return {
    id: 1,
    name: 'main',
    openshiftProjectName,
    project: {
      id: 1,
      name: 'test-project',
      problemsUi: true,
      factsUi: true,
      featureApiRoutes: true,
    },
    pendingChanges: [],
    insights: [
      {
        id: 1,
        file: 'sbom-report.json',
        fileId: 1,
        service: 'cli',
        type: 'sbom',
        size: '245KB',
        created: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
    facts: [
      { id: 1, name: 'php-version', value: '8.2', source: 'lagoon', description: 'PHP Version' },
    ],
  };
}
