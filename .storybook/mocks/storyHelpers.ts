export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export type EnvVariable = {
  id: number;
  name: string;
  scope: string;
  value?: string;
};

export type EnvVariableWithValue = EnvVariable & {
  value: string;
};

export type InitialMockState = {
  [entityType: string]: {
    [key: string]: unknown[] | unknown;
  };
};

export function createOrgVariablesMockState(
  orgName: string,
  variables: EnvVariable[]
): InitialMockState {
  return {
    orgEnvVariables: {
      [orgName]: variables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
    },
    orgEnvVariablesWithValues: {
      [orgName]: variables.map(v => ({
        id: v.id,
        name: v.name,
        scope: v.scope,
        value: v.value ?? `mock-value-${v.id}`,
      })),
    },
  };
}

export function createProjectVariablesMockState(
  projectName: string,
  variables: EnvVariable[]
): InitialMockState {
  return {
    projectEnvVariables: {
      [projectName]: variables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
    },
    projectEnvVariablesWithValues: {
      [projectName]: variables.map(v => ({
        id: v.id,
        name: v.name,
        scope: v.scope,
        value: v.value ?? `mock-value-${v.id}`,
      })),
    },
  };
}

export function createEnvVariablesMockState(
  envName: string,
  envVariables: EnvVariable[],
  projectVariables?: EnvVariable[]
): InitialMockState {
  const result: InitialMockState = {
    envEnvVariables: {
      [envName]: envVariables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
    },
    envEnvVariablesWithValues: {
      [envName]: envVariables.map(v => ({
        id: v.id,
        name: v.name,
        scope: v.scope,
        value: v.value ?? `mock-value-${v.id}`,
      })),
    },
  };

  if (projectVariables) {
    result.envProjectVariables = {
      [envName]: projectVariables.map(v => ({ id: v.id, name: v.name, scope: v.scope })),
    };
    result.envProjectVariablesWithValues = {
      [envName]: projectVariables.map(v => ({
        id: v.id,
        name: v.name,
        scope: v.scope,
        value: v.value ?? `mock-project-value-${v.id}`,
      })),
    };
  }

  return result;
}

export type SSHKey = {
  id: number;
  name: string;
  keyType: string;
  keyValue: string;
  keyFingerprint: string;
  created: string;
  lastUsed: string | null;
};

export function createSSHKeysMockState(keys: SSHKey[]): InitialMockState {
  return {
    sshKeys: {
      user: keys,
    },
  };
}

export type OrgUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  groupRoles: { id: string; role: string }[];
  has2faEnabled: boolean;
  isFederatedUser: boolean;
};

export function createOrgUsersMockState(orgId: number, users: OrgUser[]): InitialMockState {
  return {
    orgUsers: {
      [String(orgId)]: users,
    },
  };
}

export type OrgGroup = {
  id: string;
  name: string;
  type: string;
  memberCount: number;
};

export function createOrgGroupsMockState(groups: OrgGroup[]): InitialMockState {
  return {
    orgGroups: {
      all: groups,
    },
  };
}

export type GroupMember = {
  role: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    comment: string | null;
  };
};

export type GroupProject = {
  id: number;
  name: string;
};

export function createGroupMembersMockState(
  groupName: string,
  members: GroupMember[],
  groupProjects?: GroupProject[],
  orgProjects?: GroupProject[]
): InitialMockState {
  const state: InitialMockState = {
    groupMembers: {
      [groupName]: members,
    },
  };

  if (groupProjects) {
    state.groupProjects = {
      [groupName]: groupProjects,
    };
  }

  if (orgProjects) {
    state.orgProjects = {
      '1': orgProjects,
    };
  }

  return state;
}

export type Deployment = {
  id: number;
  name: string;
  status: string;
  created: string;
  buildStep: string | null;
  started: string | null;
  completed: string | null;
  bulkId: string | null;
  priority: number;
  sourceType: string;
};

export type EnvironmentWithDeployments = {
  id: number;
  name: string;
  openshiftProjectName: string;
  deployType: string;
  deployBaseRef: string;
  deployHeadRef: string;
  deployTitle: string;
  project: {
    name: string;
    problemsUi: number;
    factsUi: number;
  };
  deployments: Deployment[];
};

export function createDeploymentsMockState(
  openshiftProjectName: string,
  environment: EnvironmentWithDeployments
): InitialMockState {
  return {
    deployments: {
      [openshiftProjectName]: environment.deployments,
    },
    environmentMeta: {
      [openshiftProjectName]: {
        id: environment.id,
        name: environment.name,
        openshiftProjectName: environment.openshiftProjectName,
        deployType: environment.deployType,
        deployBaseRef: environment.deployBaseRef,
        deployHeadRef: environment.deployHeadRef,
        deployTitle: environment.deployTitle,
        project: environment.project,
      },
    },
  };
}

export type Task = {
  id: number;
  name: string;
  taskName: string;
  status: string;
  created: string;
  started: string | null;
  completed: string | null;
  service: string;
  adminOnlyView: boolean;
};

export type AdvancedTask = {
  id: number;
  name: string;
  description: string;
  confirmationText: string;
  type: string;
  environment: number;
  project: number;
  service: string;
  created: string;
  deleted: string;
  adminOnlyView: boolean;
  deployTokenInjection: boolean;
  projectKeyInjection: boolean;
  advancedTaskDefinitionArguments: unknown[];
  command: string;
  groupName: string;
};

export type EnvironmentWithTasks = {
  id: number;
  name: string;
  openshiftProjectName: string;
  project: {
    id: number;
    name: string;
    problemsUi: boolean;
    factsUi: boolean;
    environments: { id: number; name: string }[];
  };
  tasks: Task[];
  advancedTasks: AdvancedTask[];
};

export function createTasksMockState(
  openshiftProjectName: string,
  environment: EnvironmentWithTasks
): InitialMockState {
  return {
    tasks: {
      [openshiftProjectName]: environment.tasks,
    },
    advancedTasks: {
      [openshiftProjectName]: environment.advancedTasks,
    },
    taskEnvironmentMeta: {
      [openshiftProjectName]: {
        id: environment.id,
        name: environment.name,
        openshiftProjectName: environment.openshiftProjectName,
        project: environment.project,
      },
    },
  };
}

export type BackupRestore = {
  id: number;
  status: string;
  restoreLocation: string | null;
  restoreSize: number | null;
};

export type Backup = {
  id: string;
  source: string;
  backupId: string;
  created: string;
  restore: BackupRestore | null;
};

export type EnvironmentWithBackups = {
  id: number;
  openshiftProjectName: string;
  deployType: string;
  deployBaseRef: string;
  deployHeadRef: string;
  deployTitle: string;
  project: {
    name: string;
    problemsUi: boolean;
    factsUi: boolean;
  };
  backups: Backup[];
};

export function createBackupsMockState(
  openshiftProjectName: string,
  environment: EnvironmentWithBackups
): InitialMockState {
  return {
    backups: {
      [openshiftProjectName]: environment.backups,
    },
    backupEnvironmentMeta: {
      [openshiftProjectName]: {
        id: environment.id,
        openshiftProjectName: environment.openshiftProjectName,
        deployType: environment.deployType,
        deployBaseRef: environment.deployBaseRef,
        deployHeadRef: environment.deployHeadRef,
        deployTitle: environment.deployTitle,
        project: environment.project,
      },
    },
  };
}

export type EnvironmentRoute = {
  id: number;
  domain: string;
  type: string;
  primary: boolean;
  service: string;
  created: string;
  updated: string;
  source: string;
  environment: {
    id: number;
    name: string;
    kubernetesNamespaceName: string;
    environmentType: string;
  };
};

export type EnvironmentWithRoutes = {
  id: number;
  name: string;
  kubernetesNamespaceName: string;
  environmentType: string;
  apiRoutes: EnvironmentRoute[];
  project: {
    id: number;
    name: string;
    environments: { id: number; name: string }[];
    productionEnvironment: string;
    standbyProductionEnvironment: string | undefined;
  };
};

export function createRoutesMockState(
  openshiftProjectName: string,
  environment: EnvironmentWithRoutes
): InitialMockState {
  return {
    routes: {
      [openshiftProjectName]: environment.apiRoutes,
    },
    routeEnvironmentMeta: {
      [openshiftProjectName]: {
        id: environment.id,
        name: environment.name,
        kubernetesNamespaceName: environment.kubernetesNamespaceName,
        environmentType: environment.environmentType,
        project: environment.project,
      },
    },
  };
}

export type ProjectRoute = {
  id: number;
  domain: string;
  type: string;
  primary: boolean;
  service: string;
  created: string;
  updated: string;
  source: string;
  environment: {
    id: number;
    name: string;
    kubernetesNamespaceName: string;
    environmentType: string;
  } | null;
};

export type ProjectWithRoutes = {
  id: number;
  name: string;
  productionEnvironment: string;
  standbyProductionEnvironment: string | undefined;
  apiRoutes: ProjectRoute[];
  environments: { id: number; name: string; kubernetesNamespaceName: string }[];
};

export function createProjectRoutesMockState(
  projectName: string,
  project: ProjectWithRoutes
): InitialMockState {
  return {
    projectRoutes: {
      [projectName]: project.apiRoutes,
    },
    projectRouteMeta: {
      [projectName]: {
        id: project.id,
        name: project.name,
        productionEnvironment: project.productionEnvironment,
        standbyProductionEnvironment: project.standbyProductionEnvironment,
        environments: project.environments,
      },
    },
  };
}

export function mergeInitialMockState(...states: InitialMockState[]): InitialMockState {
  const merged: InitialMockState = {};

  for (const state of states) {
    for (const [entityType, entities] of Object.entries(state)) {
      if (!merged[entityType]) {
        merged[entityType] = {};
      }
      for (const [key, data] of Object.entries(entities)) {
        merged[entityType][key] = data;
      }
    }
  }

  return merged;
}

export type OrgOverview = {
  id: number;
  name: string;
  description: string;
  friendlyName: string;
  quotaProject: number;
  quotaGroup: number;
  quotaNotification: number;
  quotaEnvironment: number;
  deployTargets: { id: number; name: string; friendlyName: string; cloudProvider: string; cloudRegion: string }[];
  owners: { id: string; firstName: string; lastName: string; email: string; owner: boolean | null; admin: boolean | null }[];
  projects: { id: number; name: string; groupCount: number }[];
  environments: { id: number }[];
  groups: { id: string; name: string; type: string; memberCount: number }[];
  slacks: { webhook: string; name: string; channel: string; __typename: string }[];
  rocketchats: { webhook: string; name: string; channel: string; __typename: string }[];
  teams: { webhook: string; name: string; channel: string; __typename: string }[];
  webhook: { webhook: string; name: string; __typename: string }[];
  emails: { name: string; emailAddress: string; __typename: string }[];
};

export function createOrgOverviewMockState(orgKey: string, organization: OrgOverview): InitialMockState {
  return {
    orgOverview: {
      [orgKey]: organization,
    },
  };
}

export type NotificationSlack = {
  name: string;
  webhook: string;
  channel: string;
};

export type NotificationRocketChat = {
  name: string;
  webhook: string;
  channel: string;
};

export type NotificationEmail = {
  name: string;
  emailAddress: string;
};

export type NotificationTeams = {
  name: string;
  webhook: string;
  channel?: string;
};

export type NotificationWebhook = {
  name: string;
  webhook: string;
};

export type OrgNotifications = {
  id: number;
  name: string;
  slacks: NotificationSlack[];
  rocketchats: NotificationRocketChat[];
  emails: NotificationEmail[];
  teams: NotificationTeams[];
  webhook: NotificationWebhook[];
};

export function createNotificationsMockState(orgKey: string, notifications: OrgNotifications): InitialMockState {
  return {
    notifications: {
      [orgKey]: notifications,
    },
  };
}

export type OrgProject = {
  id: number;
  name: string;
  groupCount: number;
};

export type DeployTarget = {
  id: number;
  name: string;
  friendlyName: string;
  cloudProvider: string;
  cloudRegion: string;
};

export type OrgProjectsData = {
  id: number;
  name: string;
  friendlyName: string;
  projects: OrgProject[];
  deployTargets: DeployTarget[];
};

export function createOrgProjectsMockState(orgKey: string, orgData: OrgProjectsData): InitialMockState {
  return {
    orgProjects: {
      [orgKey]: orgData.projects,
    },
    orgProjectsMeta: {
      [orgKey]: [
        {
          id: orgData.id,
          name: orgData.name,
          friendlyName: orgData.friendlyName,
          deployTargets: orgData.deployTargets,
        },
      ],
    },
  };
}

export type EnvironmentOverview = {
  id: number;
  name: string;
  created: string;
  updated: string;
  deployType: string;
  environmentType: string;
  routes: string;
  openshiftProjectName: string;
  project: {
    name: string;
    gitUrl: string;
    productionRoutes: string | null;
    standbyRoutes: string | null;
    productionEnvironment: string;
    standbyProductionEnvironment: string | null;
    problemsUi: number;
    factsUi: number;
  };
  title: string;
  facts: unknown[];
  pendingChanges: unknown[];
};

export function createEnvironmentOverviewMockState(
  openshiftProjectName: string,
  environment: EnvironmentOverview
): InitialMockState {
  return {
    environmentOverview: {
      [openshiftProjectName]: environment,
    },
  };
}

export type UserGroupRole = {
  id: string;
  name: string;
  role: string;
  groupType: string;
};

export function createUserGroupRolesMockState(
  orgId: number,
  email: string,
  groupRoles: UserGroupRole[]
): InitialMockState {
  return {
    userGroupRoles: {
      [`${orgId}-${email}`]: groupRoles,
    },
  };
}
