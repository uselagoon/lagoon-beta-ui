import { graphql, http, HttpResponse, passthrough } from 'msw';

import { MockAllProjects, getOrganization } from './api';
import {
  defaultAdvancedTasks,
  defaultBackups,
  defaultDeployments,
  defaultEmptyNotifications,
  defaultDeployTargets,
  defaultEnvVariables,
  defaultEnvVariablesWithValues,
  defaultGroupMembers,
  defaultGroupProjects,
  defaultInsights,
  defaultOrgGroups,
  defaultOrgOwners,
  defaultOrgProjects,
  defaultOrgUsers,
  defaultOrgVariables,
  defaultOrgVariablesWithValues,
  defaultProjectVariables,
  defaultProjectVariablesWithValues,
  defaultRoutes,
  defaultSSHKeys,
  defaultTasks,
  defaultUserGroupRoles,
  defaultUserPreferences,
  createDefaultBackupEnvMeta,
  createDefaultEnvMeta,
  createDefaultEnvironment,
  createDefaultInsightsEnv,
  createDefaultProject,
  createDefaultProjectRouteMeta,
  createDefaultRouteEnvMeta,
  createDefaultTaskEnvMeta,
} from './defaultMockData';
import { stateStore } from './statefulStore';

const lagoonGraphQL = graphql;

function getState<T>(entityType: string, key: string): T | undefined {
  const state = stateStore.getState(entityType, key);
  if (state !== undefined) {
    return (Array.isArray(state) ? state[0] : state) as T;
  }
  return undefined;
}

function getStateArray<T>(entityType: string, key: string, defaultValue: T[]): T[] {
  const state = stateStore.getState(entityType, key);
  return (state as T[]) ?? defaultValue;
}


export const handlers = [
  http.get(/\.hot-update\.(json|js)$/, () => passthrough()),
  http.get(/\/__webpack_hmr/, () => passthrough()),

  lagoonGraphQL.query('allProjects', () => {
    return HttpResponse.json({
      data: { allProjects: MockAllProjects(123) },
    });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('orgProjectByName')) return undefined;

    const projectName = variables.project as string;
    const orgName = variables.name as string;

    const project = getState('orgProject', projectName);
    const organization = getState('orgProjectOrg', orgName);

    if (project && organization) {
      return HttpResponse.json({ data: { project, organization } } as never);
    }
    return undefined;
  }),

  lagoonGraphQL.query('organizationByName', ({ variables, query }) => {
    const orgName = variables.name as string;

    const orgOverview = getState('orgOverview', orgName);
    if (orgOverview && typeof orgOverview === 'object') {
      return HttpResponse.json({ data: { organization: orgOverview } });
    }

    if (query.includes('projects') && query.includes('deployTargets') && !query.includes('groups')) {
      const projects = stateStore.getState('orgProjects', orgName);
      const projectsMeta = getState<Record<string, unknown>>('orgProjectsMeta', orgName) ?? {};

      if (projects) {
        return HttpResponse.json({
          data: {
            organization: {
              id: 1,
              name: orgName,
              friendlyName: 'Test Organization',
              deployTargets: [],
              ...projectsMeta,
              projects,
            },
          },
        });
      }
    }

    const org = getOrganization();
    return HttpResponse.json({
      data: { organization: { ...org, name: orgName || org.name } },
    });
  }),

  lagoonGraphQL.query('getOrganization', ({ variables, query }) => {
    const orgName = variables.name as string;

    if (query.includes('projects') && query.includes('deployTargets') && !query.includes('groups') && !query.includes('environments')) {
      const projects = stateStore.getState('orgProjects', orgName);
      const projectsMeta = getState<Record<string, unknown>>('orgProjectsMeta', orgName) ?? {};

      if (projects) {
        return HttpResponse.json({
          data: {
            organization: {
              id: 1,
              name: orgName,
              friendlyName: 'Test Organization',
              deployTargets: [],
              ...projectsMeta,
              projects,
            },
          },
        });
      }
    }

    if (query.includes('groups') && query.includes('deployTargets') && query.includes('environments')) {
      const orgOverview = getState('orgOverview', orgName);
      if (orgOverview && typeof orgOverview === 'object') {
        return HttpResponse.json({ data: { organization: orgOverview } });
      }
    }

    if (query.includes('slacks') || query.includes('rocketchats')) {
      const notifications = getState<Record<string, unknown>>('notifications', orgName);

      if (notifications && typeof notifications === 'object' && !Array.isArray(notifications)) {
        return HttpResponse.json({ data: { organization: notifications } });
      }

      return HttpResponse.json({
        data: { organization: { ...defaultEmptyNotifications, name: orgName } },
      });
    }

    if (query.includes('owners') && query.includes('groupRoles')) {
      const owners = stateStore.getState('orgOwners', orgName) ?? stateStore.getState('orgOwners', '1') ?? defaultOrgOwners;
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, owners } },
      });
    }

    if (query.includes('groups') && query.includes('memberCount')) {
      const groups = stateStore.getState('orgGroups', 'all') ?? defaultOrgGroups;
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, friendlyName: 'Test Organization', groups } },
      });
    }

    const org = getOrganization();
    return HttpResponse.json({
      data: { organization: { ...org, name: orgName || org.name } },
    });
  }),

  lagoonGraphQL.query('getOrg', ({ variables, query }) => {
    const orgName = variables.name as string;
    const includesValue = query.includes('value');

    if (includesValue) {
      const envVariables = getStateArray('orgEnvVariablesWithValues', orgName, defaultOrgVariablesWithValues);
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, envVariables } },
      });
    }

    const envVariables = getStateArray('orgEnvVariables', orgName, defaultOrgVariables);
    return HttpResponse.json({
      data: { organization: { id: 1, name: orgName, envVariables } },
    });
  }),

  lagoonGraphQL.query('getGroup', ({ variables }) => {
    const groupName = variables.name as string;
    const orgId = variables.organization as number;

    const members = getStateArray('groupMembers', groupName, defaultGroupMembers);
    const groupProjects = getStateArray('groupProjects', groupName, defaultGroupProjects);
    const orgProjects = getStateArray('orgProjects', String(orgId), defaultOrgProjects);

    return HttpResponse.json({
      data: {
        group: {
          id: '1',
          name: groupName,
          type: 'null',
          projects: groupProjects,
          members,
        },
        organization: {
          id: orgId,
          name: 'test-organization',
          friendlyName: 'Test Organization',
          description: 'A test organization',
          quotaProject: 10,
          quotaGroup: 5,
          quotaNotification: 20,
          quotaEnvironment: 50,
          deployTargets: defaultDeployTargets,
          projects: orgProjects,
        },
      },
    });
  }),

  lagoonGraphQL.query('usersByOrganization', ({ variables }) => {
    const orgId = variables.id as number;
    const users = getStateArray('orgUsers', String(orgId), defaultOrgUsers);
    return HttpResponse.json({ data: { users } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('userByEmailAndOrganization')) return undefined;

    const { email, organization } = variables as { email: string; organization: number };
    const stateKey = `${organization}-${email}`;

    const groupRoles = getStateArray('userGroupRoles', stateKey, defaultUserGroupRoles);

    return HttpResponse.json({
      data: {
        userByEmailAndOrganization: {
          email,
          groupRoles,
          has2faEnabled: false,
          isFederatedUser: false,
        },
      },
    } as never);
  }),

  lagoonGraphQL.operation(({ query, operationName }) => {
    const isMe = operationName?.toLowerCase() === 'me' || query.includes('query me') || query.includes('query Me');
    if (!isMe) return undefined;

    const sshKeys = getStateArray('sshKeys', 'user', defaultSSHKeys);
    const userPreferences = getState('userPreferences', 'current') ?? defaultUserPreferences;

    return HttpResponse.json({
      data: {
        me: {
          id: 1,
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          emailNotifications: userPreferences,
          sshKeys,
          has2faEnabled: false,
          isFederatedUser: false,
          __typename: 'User',
        },
      },
    } as never);
  }),

  lagoonGraphQL.query('getEnvironment', ({ variables, query }) => {
    const openshiftProjectName = variables.openshiftProjectName as string;

    if (query.includes('environmentByOpenshiftProjectName') && !query.includes('insights') && !query.includes('apiRoutes') && !query.includes('backups') && !query.includes('tasks') && !query.includes('deployments') && !query.includes('envVariables') && !/facts\s*\{/.test(query)) {
      const envOverview = getState<Record<string, unknown>>('environmentOverview', openshiftProjectName);
      if (envOverview) {
        return HttpResponse.json({ data: { environment: envOverview } });
      }
      return HttpResponse.json({ data: { environment: createDefaultEnvironment(openshiftProjectName) } });
    }

    if (query.includes('environmentById')) {
      const environmentID = variables.environmentID as number;

      if (query.includes('insights') && !query.includes('facts')) {
        const insights = getStateArray('insightsDownload', String(environmentID), defaultInsights);
        return HttpResponse.json({
          data: { environment: { id: environmentID, insights } },
        });
      }

      const backups = getStateArray('backups', 'project-main', defaultBackups);
      return HttpResponse.json({
        data: { environment: { backups } },
      });
    }

    if (query.includes('apiRoutes')) {
      const routes = getStateArray('routes', openshiftProjectName, defaultRoutes);
      const routeEnvMeta = getState('routeEnvironmentMeta', openshiftProjectName) ?? createDefaultRouteEnvMeta(openshiftProjectName);

      return HttpResponse.json({
        data: { environmentRoutes: { ...routeEnvMeta, apiRoutes: routes } },
      });
    }

    if (query.includes('backups') && !query.includes('tasks')) {
      const backups = getStateArray('backups', openshiftProjectName, defaultBackups);
      const backupEnvMeta = getState('backupEnvironmentMeta', openshiftProjectName) ?? createDefaultBackupEnvMeta(openshiftProjectName);

      return HttpResponse.json({
        data: { environment: { ...backupEnvMeta, backups } },
      });
    }

    if (query.includes('insights') && /facts\s*\{/.test(query)) {
      const insightsEnv = getState<Record<string, unknown>>('insightsEnvironment', openshiftProjectName);

      if (insightsEnv) {
        return HttpResponse.json({ data: { environment: insightsEnv } });
      }

      const envOverview = getState<Record<string, unknown>>('environmentOverview', openshiftProjectName);
      if (envOverview) {
        return HttpResponse.json({
          data: {
            environment: {
              ...envOverview,
              insights: [],
              facts: (envOverview as { facts?: unknown[] }).facts || [],
            },
          },
        });
      }

      return HttpResponse.json({ data: { environment: createDefaultInsightsEnv(openshiftProjectName) } });
    }

    if (query.includes('tasks') && !query.includes('advancedTasks')) {
      const taskName = variables.taskName as string;
      const taskEnv = getState<Record<string, unknown>>('task', taskName);

      if (taskEnv) {
        return HttpResponse.json({ data: { environment: taskEnv } });
      }
    }

    if (query.includes('tasks') && query.includes('advancedTasks')) {
      const tasks = getStateArray('tasks', openshiftProjectName, defaultTasks);
      const advancedTasks = getStateArray('advancedTasks', openshiftProjectName, defaultAdvancedTasks);
      const taskEnvMeta = getState('taskEnvironmentMeta', openshiftProjectName) ?? createDefaultTaskEnvMeta(openshiftProjectName);

      return HttpResponse.json({
        data: { environment: { ...taskEnvMeta, tasks, advancedTasks } },
      });
    }

    if (query.includes('deployments')) {
      const deployments = getStateArray('deployments', openshiftProjectName, defaultDeployments);
      const envMeta = getState('environmentMeta', openshiftProjectName) ?? createDefaultEnvMeta(openshiftProjectName);

      return HttpResponse.json({
        data: { environment: { ...envMeta, deployments } },
      });
    }

    const includesValue = query.includes('value');
    const includesProjectEnvVars = query.includes('project') && query.includes('envVariables');

    const defaultEnv = {
      id: 1,
      name: openshiftProjectName,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-06-01T00:00:00Z',
      deployType: 'branch',
      environmentType: 'production',
      routes: 'https://example.com',
      openshiftProjectName,
      pendingChanges: [],
    };

    const getProjectBlock = (withValues: boolean) => {
      const projectVars = withValues
        ? getStateArray('envProjectVariablesWithValues', openshiftProjectName, defaultProjectVariablesWithValues)
        : getStateArray('envProjectVariables', openshiftProjectName, defaultProjectVariables);

      return {
        name: 'test-project',
        gitUrl: 'git@github.com:example/project.git',
        productionRoutes: 'https://example.com',
        standbyRoutes: null,
        productionEnvironment: 'main',
        standbyProductionEnvironment: null,
        problemsUi: true,
        factsUi: true,
        featureApiRoutes: true,
        envVariables: projectVars,
      };
    };

    if (includesValue) {
      const unauthorizedViewValues = getState<boolean>('unauthorizedViewValues', openshiftProjectName) ?? false;
      
      if (unauthorizedViewValues) {
        return HttpResponse.json({
          data: { environmentVars: null },
          errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
        } as never);
      }

      const envVariables = getStateArray('envEnvVariablesWithValues', openshiftProjectName, defaultEnvVariablesWithValues);

      if (includesProjectEnvVars) {
        return HttpResponse.json({
          data: { environmentVars: { ...defaultEnv, envVariables, project: getProjectBlock(true) } },
        });
      }

      return HttpResponse.json({
        data: { environmentVars: { ...defaultEnv, envVariables } },
      });
    }

    const envVariables = getStateArray('envEnvVariables', openshiftProjectName, defaultEnvVariables);

    return HttpResponse.json({
      data: { environmentVars: { ...defaultEnv, envVariables, project: getProjectBlock(false) } },
    });
  }),

  lagoonGraphQL.query('getProject', ({ variables, query }) => {
    const projectName = variables.name as string;
    const includesValue = query.includes('value');

    if (query.includes('publicKey') && !query.includes('environments')) {
      return HttpResponse.json({
        data: {
          project: {
            id: 1,
            name: projectName,
            publicKey: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIExampleDeployKey12345',
          },
        },
      });
    }

    if (query.includes('environments') && query.includes('openshift') && query.includes('pendingChanges')) {
      const projectData = getState<Record<string, unknown>>('projectEnvironments', projectName);
      if (projectData) {
        return HttpResponse.json({ data: { project: projectData } });
      }

      return HttpResponse.json({
        data: {
          project: {
            id: 1,
            name: projectName,
            productionEnvironment: 'main',
            standbyProductionEnvironment: null,
            productionRoutes: 'https://example.com',
            standbyRoutes: null,
            environments: [
              {
                id: 1,
                name: 'main',
                deployType: 'branch',
                environmentType: 'production',
                deployBaseRef: 'main',
                deployHeadRef: 'main',
                deployTitle: 'main',
                updated: new Date().toISOString(),
                routes: 'https://example.com',
                openshiftProjectName: `${projectName}-main`,
                kubernetesNamespaceName: `${projectName}-main`,
                openshift: { friendlyName: 'Production', cloudRegion: 'US-EAST' },
                project: { name: projectName, problemsUi: 0, factsUi: 5 },
                problems: [],
                deployments: [],
                pendingChanges: [],
              },
            ],
          },
        },
      });
    }

    if (query.includes('apiRoutes')) {
      const routes = getStateArray('projectRoutes', projectName, defaultRoutes);
      const projectMeta = getState('projectRouteMeta', projectName) ?? createDefaultProjectRouteMeta(projectName);

      return HttpResponse.json({
        data: { projectRoutes: { ...projectMeta, apiRoutes: routes } },
      });
    }

    const defaultProject = createDefaultProject(projectName);

    if (includesValue) {
      const unauthorizedViewValues = getState<boolean>('unauthorizedViewValues', projectName) ?? false;
      
      if (unauthorizedViewValues) {
        return HttpResponse.json({
          data: { project: null },
          errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
        } as never);
      }

      const envVariables = getStateArray('projectEnvVariablesWithValues', projectName, defaultOrgVariablesWithValues);
      return HttpResponse.json({
        data: { project: { ...defaultProject, envVariables } },
      });
    }

    const envVariables = getStateArray('projectEnvVariables', projectName, defaultOrgVariables);
    return HttpResponse.json({
      data: { project: { ...defaultProject, envVariables } },
    });
  }),
];
