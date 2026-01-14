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
import { getStateArrayOrDefault, getStateOrDefault, queryIncludesAll, queryIncludesNone } from './handlerUtils';
import { generateOrganizationManageByRole } from './mocks';
import { canViewVariableValues, getCurrentRole } from './roleStore';
import { stateStore } from './statefulStore';

const lagoonGraphQL = graphql;

export const handlers = [
  http.get(/\.hot-update\.(json|js)$/, () => passthrough()),
  http.get(/\/__webpack_hmr/, () => passthrough()),

  lagoonGraphQL.operation(({ query, operationName }) => {
    console.log('[MSW DEBUG] GraphQL operation:', { operationName, queryPreview: query.substring(0, 100) });
    return undefined;
  }),

  lagoonGraphQL.query('allProjects', () => {
    return HttpResponse.json({
      data: { allProjects: MockAllProjects(123) },
    });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('orgProjectByName')) return;

    const projectName = variables.project as string;
    const orgName = variables.name as string;

    const project = getStateOrDefault('orgProject', projectName, null);
    const organization = getStateOrDefault('orgProjectOrg', orgName, null);

    if (project && organization) {
      return HttpResponse.json({ data: { project, organization } });
    }
  }),

  lagoonGraphQL.query('organizationByName', ({ variables, query }) => {
    const orgName = variables.name as string;

    const orgOverview = getStateOrDefault('orgOverview', orgName, null);
    if (orgOverview && typeof orgOverview === 'object') {
      return HttpResponse.json({ data: { organization: orgOverview } });
    }

    if (queryIncludesAll(query, ['projects', 'deployTargets']) && !query.includes('groups')) {
      const projects = stateStore.getState('orgProjects', orgName);
      const projectsMeta = getStateOrDefault<Record<string, unknown>>('orgProjectsMeta', orgName, {});

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
    const role = getCurrentRole();
    const orgName = variables.name as string;

    if (queryIncludesAll(query, ['projects', 'deployTargets']) && queryIncludesNone(query, ['groups', 'environments'])) {
      const projects = stateStore.getState('orgProjects', orgName);
      const projectsMeta = getStateOrDefault<Record<string, unknown>>('orgProjectsMeta', orgName, {});

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

    if (queryIncludesAll(query, ['groups', 'deployTargets', 'environments'])) {
      const orgOverview = getStateOrDefault('orgOverview', orgName, null);
      if (orgOverview && typeof orgOverview === 'object') {
        return HttpResponse.json({ data: { organization: orgOverview } });
      }
    }

    if (queryIncludesAll(query, ['slacks', 'rocketchats'])) {
      const notifications = getStateOrDefault<Record<string, unknown>>('notifications', orgName, null);
      console.log('[MSW] getOrganization notifications query for:', orgName, 'state:', notifications);

      if (notifications && typeof notifications === 'object' && !Array.isArray(notifications)) {
        return HttpResponse.json({ data: { organization: notifications } });
      }

      return HttpResponse.json({
        data: { organization: { ...defaultEmptyNotifications, name: orgName } },
      });
    }

    if (queryIncludesAll(query, ['owners', 'groupRoles'])) {
      const owners = stateStore.getState('orgOwners', orgName) ?? stateStore.getState('orgOwners', '1') ?? defaultOrgOwners;
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, owners } },
      });
    }

    if (queryIncludesAll(query, ['groups', 'memberCount'])) {
      const groups = stateStore.getState('orgGroups', 'all') ?? defaultOrgGroups;
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, friendlyName: 'Test Organization', groups } },
      });
    }

    const orgData = generateOrganizationManageByRole(role, orgName);
    return HttpResponse.json({ data: { organization: orgData } });
  }),

  lagoonGraphQL.query('getOrg', ({ variables, query }) => {
    const orgName = variables.name as string;
    const role = getCurrentRole();
    const includesValue = query.includes('value');

    if (includesValue) {
      if (!canViewVariableValues(role)) {
        return HttpResponse.json({
          data: { organization: null },
          errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
        });
      }

      const envVariables = getStateArrayOrDefault('orgEnvVariablesWithValues', orgName, defaultOrgVariablesWithValues);
      return HttpResponse.json({
        data: { organization: { id: 1, name: orgName, envVariables } },
      });
    }

    const envVariables = getStateArrayOrDefault('orgEnvVariables', orgName, defaultOrgVariables);
    return HttpResponse.json({
      data: { organization: { id: 1, name: orgName, envVariables } },
    });
  }),

  lagoonGraphQL.query('getGroup', ({ variables }) => {
    const groupName = variables.name as string;
    const orgId = variables.organization as number;

    const members = getStateArrayOrDefault('groupMembers', groupName, defaultGroupMembers);
    const groupProjects = getStateArrayOrDefault('groupProjects', groupName, defaultGroupProjects);
    const orgProjects = getStateArrayOrDefault('orgProjects', String(orgId), defaultOrgProjects);

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
    const users = getStateArrayOrDefault('orgUsers', String(orgId), defaultOrgUsers);
    return HttpResponse.json({ data: { users } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('userByEmailAndOrganization')) return;

    const { email, organization } = variables as { email: string; organization: number };
    const stateKey = `${organization}-${email}`;

    const groupRoles = getStateArrayOrDefault('userGroupRoles', stateKey, defaultUserGroupRoles);

    return HttpResponse.json({
      data: {
        userByEmailAndOrganization: {
          email,
          groupRoles,
          has2faEnabled: false,
          isFederatedUser: false,
        },
      },
    });
  }),

  lagoonGraphQL.operation(({ query, operationName }) => {
    const isMe = operationName?.toLowerCase() === 'me' || query.includes('query me') || query.includes('query Me');
    if (!isMe) return;

    const sshKeys = getStateArrayOrDefault('sshKeys', 'user', defaultSSHKeys);
    const userPreferences = getStateOrDefault('userPreferences', 'current', defaultUserPreferences);

    console.log('[MSW] me/Me query intercepted - operationName:', operationName, 'sshKeys from store:', sshKeys);

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
    });
  }),

  lagoonGraphQL.query('getEnvironment', ({ variables, query }) => {
    const openshiftProjectName = variables.openshiftProjectName as string;

    if (query.includes('environmentByOpenshiftProjectName') && queryIncludesNone(query, ['insights', 'apiRoutes', 'backups', 'tasks', 'deployments', 'envVariables']) && !/facts\s*\{/.test(query)) {
      const envOverview = getStateOrDefault<Record<string, unknown>>('environmentOverview', openshiftProjectName, null);
      if (envOverview) {
        return HttpResponse.json({ data: { environment: envOverview } });
      }
      return HttpResponse.json({ data: { environment: createDefaultEnvironment(openshiftProjectName) } });
    }

    if (query.includes('environmentById')) {
      const environmentID = variables.environmentID as number;

      if (query.includes('insights') && !query.includes('facts')) {
        const insights = getStateArrayOrDefault('insightsDownload', String(environmentID), defaultInsights);
        return HttpResponse.json({
          data: { environment: { id: environmentID, insights } },
        });
      }

      const backups = getStateArrayOrDefault('backups', 'project-main', defaultBackups);
      return HttpResponse.json({
        data: { environment: { backups } },
      });
    }

    if (query.includes('apiRoutes')) {
      const routes = getStateArrayOrDefault('routes', openshiftProjectName, defaultRoutes);
      const routeEnvMeta = getStateOrDefault('routeEnvironmentMeta', openshiftProjectName, createDefaultRouteEnvMeta(openshiftProjectName));

      return HttpResponse.json({
        data: { environmentRoutes: { ...routeEnvMeta, apiRoutes: routes } },
      });
    }

    if (query.includes('backups') && !query.includes('tasks')) {
      const backups = getStateArrayOrDefault('backups', openshiftProjectName, defaultBackups);
      const backupEnvMeta = getStateOrDefault('backupEnvironmentMeta', openshiftProjectName, createDefaultBackupEnvMeta(openshiftProjectName));

      return HttpResponse.json({
        data: { environment: { ...backupEnvMeta, backups } },
      });
    }

    if (query.includes('insights') && /facts\s*\{/.test(query)) {
      const insightsEnv = getStateOrDefault<Record<string, unknown>>('insightsEnvironment', openshiftProjectName, null);

      console.log('[MSW] insights+facts handler matched:', { openshiftProjectName, hasInsightsEnv: !!insightsEnv });

      if (insightsEnv) {
        return HttpResponse.json({ data: { environment: insightsEnv } });
      }

      const envOverview = getStateOrDefault<Record<string, unknown>>('environmentOverview', openshiftProjectName, null);
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
      const taskEnv = getStateOrDefault<Record<string, unknown>>('task', taskName, null);

      if (taskEnv) {
        return HttpResponse.json({ data: { environment: taskEnv } });
      }
    }

    if (queryIncludesAll(query, ['tasks', 'advancedTasks'])) {
      const tasks = getStateArrayOrDefault('tasks', openshiftProjectName, defaultTasks);
      const advancedTasks = getStateArrayOrDefault('advancedTasks', openshiftProjectName, defaultAdvancedTasks);
      const taskEnvMeta = getStateOrDefault('taskEnvironmentMeta', openshiftProjectName, createDefaultTaskEnvMeta(openshiftProjectName));

      return HttpResponse.json({
        data: { environment: { ...taskEnvMeta, tasks, advancedTasks } },
      });
    }

    if (query.includes('deployments')) {
      const deployments = getStateArrayOrDefault('deployments', openshiftProjectName, defaultDeployments);
      const envMeta = getStateOrDefault('environmentMeta', openshiftProjectName, createDefaultEnvMeta(openshiftProjectName));

      return HttpResponse.json({
        data: { environment: { ...envMeta, deployments } },
      });
    }

    const role = getCurrentRole();
    const includesValue = query.includes('value');
    const includesProjectEnvVars = queryIncludesAll(query, ['project', 'envVariables']);

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
        ? getStateArrayOrDefault('envProjectVariablesWithValues', openshiftProjectName, defaultProjectVariablesWithValues)
        : getStateArrayOrDefault('envProjectVariables', openshiftProjectName, defaultProjectVariables);

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
      if (!canViewVariableValues(role)) {
        return HttpResponse.json({
          data: { environmentVars: null },
          errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
        });
      }

      const envVariables = getStateArrayOrDefault('envEnvVariablesWithValues', openshiftProjectName, defaultEnvVariablesWithValues);

      if (includesProjectEnvVars) {
        return HttpResponse.json({
          data: { environmentVars: { ...defaultEnv, envVariables, project: getProjectBlock(true) } },
        });
      }

      return HttpResponse.json({
        data: { environmentVars: { ...defaultEnv, envVariables } },
      });
    }

    const envVariables = getStateArrayOrDefault('envEnvVariables', openshiftProjectName, defaultEnvVariables);

    console.log('[MSW] getEnvironment query (no values):', {
      openshiftProjectName,
      stateResult: stateStore.getState('envEnvVariables', openshiftProjectName),
      returning: envVariables,
    });

    return HttpResponse.json({
      data: { environmentVars: { ...defaultEnv, envVariables, project: getProjectBlock(false) } },
    });
  }),

  lagoonGraphQL.query('getProject', ({ variables, query }) => {
    const projectName = variables.name as string;
    const role = getCurrentRole();
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

    if (queryIncludesAll(query, ['environments', 'openshift', 'pendingChanges'])) {
      const projectData = getStateOrDefault<Record<string, unknown>>('projectEnvironments', projectName, null);
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
      const routes = getStateArrayOrDefault('projectRoutes', projectName, defaultRoutes);
      const projectMeta = getStateOrDefault('projectRouteMeta', projectName, createDefaultProjectRouteMeta(projectName));

      return HttpResponse.json({
        data: { projectRoutes: { ...projectMeta, apiRoutes: routes } },
      });
    }

    const defaultProject = createDefaultProject(projectName);

    if (includesValue) {
      if (!canViewVariableValues(role)) {
        return HttpResponse.json({
          data: { project: null },
          errors: [{ message: 'Unauthorized: You do not have permission to view variable values' }],
        });
      }

      const envVariables = getStateArrayOrDefault('projectEnvVariablesWithValues', projectName, defaultOrgVariablesWithValues);
      return HttpResponse.json({
        data: { project: { ...defaultProject, envVariables } },
      });
    }

    const envVariables = getStateArrayOrDefault('projectEnvVariables', projectName, defaultOrgVariables);
    return HttpResponse.json({
      data: { project: { ...defaultProject, envVariables } },
    });
  }),
];
