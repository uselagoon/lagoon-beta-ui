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

export type SSHKey = {
  id: number;
  name: string;
  keyType: string;
  keyValue: string;
  keyFingerprint: string;
  created: string;
  lastUsed: string | null;
};

export type OrgUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  groupRoles: { id: string; role: string }[];
  has2faEnabled: boolean;
  isFederatedUser: boolean;
};

export type OrgGroup = {
  id: string;
  name: string;
  type: string;
  memberCount: number;
};

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

export type UserGroupRole = {
  id: string;
  name: string;
  role: string;
  groupType: string;
};
