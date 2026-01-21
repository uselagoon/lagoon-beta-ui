export type QueryRegistryEntry = {
  storeKey: string;
  dataPath?: string;
};

export const queryRegistry: Record<string, QueryRegistryEntry> = {
  'getEnvironment': { storeKey: 'envEnvVariables', dataPath: 'environmentVars' },
  'getOrg': { storeKey: 'orgEnvVariables', dataPath: 'organization' },
  'getProject': { storeKey: 'projectEnvVariables', dataPath: 'project' },
  'getOrganization': { storeKey: 'orgOverview', dataPath: 'organization' },
  'organizationByName': { storeKey: 'orgOverview', dataPath: 'organization' },
  'usersByOrganization': { storeKey: 'orgUsers', dataPath: 'users' },
  'getGroup': { storeKey: 'groupMembers', dataPath: 'group' },
  'me': { storeKey: 'sshKeys', dataPath: 'me' },
  'Me': { storeKey: 'sshKeys', dataPath: 'me' },
  'userByEmailAndOrganization': { storeKey: 'userGroupRoles', dataPath: 'userByEmailAndOrganization' },
  'environmentWithRoutes': { storeKey: 'routes', dataPath: 'environmentRoutes' },
  'projectWithRoutes': { storeKey: 'projectRoutes', dataPath: 'projectRoutes' },
  'environmentWithDeployments': { storeKey: 'deployments', dataPath: 'environment' },
  'environmentWithTasks': { storeKey: 'tasks', dataPath: 'environment' },
  'environmentWithBackups': { storeKey: 'backups', dataPath: 'environment' },
  'organizationNotifications': { storeKey: 'notifications', dataPath: 'organization' },
  'allProjects': { storeKey: 'allProjects', dataPath: 'allProjects' },
  'organizationProjects': { storeKey: 'orgProjects', dataPath: 'organization' },
  'environmentOverview': { storeKey: 'environmentOverview', dataPath: 'environment' },
  'projectEnvironments': { storeKey: 'projectEnvironments', dataPath: 'project' },
  'environmentInsights': { storeKey: 'insightsEnvironment', dataPath: 'environment' },
  'orgProjectByName': { storeKey: 'orgProject', dataPath: 'project' },
};

export function getStoreKeyForOperation(operationName: string | undefined): QueryRegistryEntry | undefined {
  if (!operationName) return undefined;
  return queryRegistry[operationName];
}
