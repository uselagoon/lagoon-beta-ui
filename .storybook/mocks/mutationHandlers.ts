import { graphql, HttpResponse } from 'msw';

import { stateStore } from './statefulStore';

const lagoonGraphQL = graphql;

const ORG_KEYS = ['1', 'test-organization'];
const ENV_KEYS = ['project-main', 'test-project-main'];
const PROJECT_KEYS = ['test-project'];

type EnvVariableInput = {
  organization?: string;
  project?: string;
  environment?: string;
  name: string;
  scope: string;
  value: string;
};

type DeleteEnvVariableInput = {
  organization?: string;
  project?: string;
  environment?: string;
  name: string;
};

function getEntityTypeAndKeys(input: { organization?: string; project?: string; environment?: string }): {
  entityType: string;
  entityTypeWithValues: string;
  keys: string[];
} {
  if (input.environment) {
    return {
      entityType: 'envEnvVariables',
      entityTypeWithValues: 'envEnvVariablesWithValues',
      keys: [input.environment],
    };
  }
  if (input.project) {
    return {
      entityType: 'projectEnvVariables',
      entityTypeWithValues: 'projectEnvVariablesWithValues',
      keys: [input.project],
    };
  }
  if (input.organization) {
    return {
      entityType: 'orgEnvVariables',
      entityTypeWithValues: 'orgEnvVariablesWithValues',
      keys: [input.organization],
    };
  }
  return { entityType: 'unknown', entityTypeWithValues: 'unknown', keys: [] };
}

function getState<T>(entityType: string, key: string): T | undefined {
  const state = stateStore.getState(entityType, key);
  if (state !== undefined) {
    return (Array.isArray(state) ? state[0] : state) as T;
  }
  return undefined;
}

type NotificationType = 'Slack' | 'RocketChat' | 'Email' | 'MicrosoftTeams' | 'Webhook';

const notificationStateKeys: Record<NotificationType, string> = {
  Slack: 'slacks',
  RocketChat: 'rocketchats',
  Email: 'emails',
  MicrosoftTeams: 'teams',
  Webhook: 'webhook',
};

const notificationFieldExtractors: Record<NotificationType, (v: Record<string, unknown>) => Record<string, unknown>> = {
  Slack: v => ({ webhook: v.webhook as string, channel: v.channel as string }),
  RocketChat: v => ({ webhook: v.webhook as string, channel: v.channel as string }),
  Email: v => ({ emailAddress: v.emailAddress as string }),
  MicrosoftTeams: v => ({ webhook: v.webhook as string }),
  Webhook: v => ({ webhook: v.webhook as string }),
};

const NOTIFICATION_TYPES: NotificationType[] = ['Slack', 'RocketChat', 'Email', 'MicrosoftTeams', 'Webhook'];

const notificationHandlers = [
  ...NOTIFICATION_TYPES.map(type => {
    return lagoonGraphQL.mutation(`addNotification${type}`, ({ variables }) => {
      const { name } = variables as { organization: number; name: string };
      const fields = notificationFieldExtractors[type](variables as Record<string, unknown>);
      const newNotification = { name, ...fields, __typename: `Notification${type}` };
      const stateKey = notificationStateKeys[type];

      for (const key of ORG_KEYS) {
        const notifications = getState<Record<string, unknown[]>>('notifications', key);
        if (notifications && typeof notifications === 'object') {
          const existing = notifications[stateKey] || [];
          const updated = {
            ...notifications,
            [stateKey]: [...existing, newNotification],
          };
          stateStore.setState<Record<string, unknown[]>>('notifications', key, updated);
        }
      }

      return HttpResponse.json({
        data: { [`addNotification${type}`]: newNotification },
      });
    });
  }),

  ...NOTIFICATION_TYPES.map(type => {
    const stateKey = notificationStateKeys[type];
    return lagoonGraphQL.mutation(`UpdateNotification${type}`, ({ variables }) => {
      const { name, patch } = variables as { name: string; patch: Record<string, unknown> };

      for (const key of ORG_KEYS) {
        const notifications = getState<Record<string, unknown[]>>('notifications', key);
        if (notifications && notifications[stateKey]) {
          const updated = (notifications[stateKey] as { name: string }[]).map(n =>
            n.name === name ? { ...n, ...patch } : n
          );
          const updatedNotifications = { ...notifications, [stateKey]: updated };
          stateStore.setState<Record<string, unknown[]>>('notifications', key, updatedNotifications);
        }
      }

      return HttpResponse.json({
        data: { [`updateNotification${type}`]: { name: (patch.name as string) || name, ...patch } },
      });
    });
  }),

  ...NOTIFICATION_TYPES.map(type => {
    const stateKey = notificationStateKeys[type];
    const mutationName = `deleteNotification${type}`;

    return lagoonGraphQL.operation(({ query, variables }) => {
      if (!query.includes('mutation removeNotification') || !query.includes(mutationName)) {
        return;
      }

      const { name } = variables as { name: string };

      for (const key of ORG_KEYS) {
        const notifications = getState<Record<string, unknown[]>>('notifications', key);
        if (notifications && notifications[stateKey]) {
          const filtered = (notifications[stateKey] as { name: string }[]).filter(n => n.name !== name);
          const updatedNotifications = { ...notifications, [stateKey]: filtered };
          stateStore.setState<Record<string, unknown[]>>('notifications', key, updatedNotifications);
        }
      }

      return HttpResponse.json({ data: { [mutationName]: 'success' } } as never);
    });
  }),
];

export const mutationHandlers = [
  lagoonGraphQL.mutation('addEnvVariable', ({ variables }) => {
    const { input } = variables as { input: EnvVariableInput };
    const { entityType, entityTypeWithValues, keys } = getEntityTypeAndKeys(input);

    const newVar = {
      id: stateStore.generateId(),
      name: input.name,
      scope: input.scope.toLowerCase(),
      value: input.value,
    };

    for (const key of keys) {
      stateStore.upsert(entityType, key, { id: newVar.id, name: newVar.name, scope: newVar.scope });
      stateStore.upsert(entityTypeWithValues, key, newVar);
    }

    return HttpResponse.json({ data: { addOrUpdateEnvVariableByName: newVar } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('deleteEnvVariableByName')) return undefined;

    const { input } = variables as { input: DeleteEnvVariableInput };
    const { entityType, entityTypeWithValues, keys } = getEntityTypeAndKeys(input);

    for (const key of keys) {
      stateStore.remove(entityType, key, (item: { name: string }) => item.name === input.name);
      stateStore.remove(entityTypeWithValues, key, (item: { name: string }) => item.name === input.name);
    }

    return HttpResponse.json({ data: { deleteEnvVariableByName: 'success' } } as never);
  }),

  lagoonGraphQL.mutation('addUserSSHPublicKey', ({ variables }) => {
    const { input } = variables as {
      input: { name: string; publicKey: string; user: { id: number; email: string } };
    };

    const keyType = input.publicKey.split(' ')[0] || 'ssh-rsa';
    const keyValue = input.publicKey.split(' ')[1] || input.publicKey;

    const newKey = {
      id: stateStore.generateId(),
      name: input.name,
      keyType,
      keyValue,
      keyFingerprint: `SHA256:${Math.random().toString(36).substring(2, 18)}`,
      created: new Date().toISOString(),
      lastUsed: null,
    };

    stateStore.upsert('sshKeys', 'user', newKey, (e, n) => e.id === n.id);
    return HttpResponse.json({ data: { addUserSSHPublicKey: newKey } });
  }),

  lagoonGraphQL.mutation('deleteUserSSHPublicKey', ({ variables }) => {
    const { input } = variables as { input: { id: number } };
    stateStore.remove('sshKeys', 'user', (item: { id: number }) => item.id === input.id);
    return HttpResponse.json({ data: { deleteUserSSHPublicKey: 'success' } });
  }),

  lagoonGraphQL.mutation('updateUserSSHPublicKey', ({ variables }) => {
    const { input } = variables as {
      input: { id: number; patch: { name?: string; publicKey?: string } };
    };

    type SSHKeyType = { id: number; name: string; keyType: string; keyValue: string; keyFingerprint: string; created: string; lastUsed: string | null };
    const sshKeys = stateStore.getState('sshKeys', 'user') as SSHKeyType[] | null;
    let updatedKey: SSHKeyType | undefined;

    if (sshKeys) {
      const updated = sshKeys.map(key => {
        if (key.id === input.id) {
          const newKey = { ...key };
          if (input.patch.name) newKey.name = input.patch.name;
          if (input.patch.publicKey) {
            newKey.keyType = input.patch.publicKey.split(' ')[0] || key.keyType;
            newKey.keyValue = input.patch.publicKey.split(' ')[1] || input.patch.publicKey;
          }
          updatedKey = newKey;
          return newKey;
        }
        return key;
      });
      stateStore.setState('sshKeys', 'user', updated);
    }

    return HttpResponse.json({
      data: { updateUserSSHPublicKey: { id: input.id, name: updatedKey?.name, keyValue: updatedKey?.keyValue } },
    });
  }),

  lagoonGraphQL.mutation('AddUserToOrganization', ({ variables }) => {
    const { email, organization, owner, admin } = variables as {
      email: string; organization: number; owner?: boolean; admin?: boolean;
    };

    const newUser = {
      id: String(stateStore.generateId()),
      firstName: email.split('@')[0],
      lastName: 'User',
      email,
      groupRoles: [{ id: 'g1' }],
      has2faEnabled: false,
      isFederatedUser: false,
      owner: owner === true ? true : null,
      admin: admin === true ? true : null,
    };

    stateStore.upsert('orgUsers', String(organization), newUser, (e: typeof newUser, n: typeof newUser) => e.email === n.email);
    stateStore.upsert('orgOwners', String(organization), newUser, (e: typeof newUser, n: typeof newUser) => e.email === n.email);

    return HttpResponse.json({ data: { addUserToOrganization: { id: newUser.id } } });
  }),

  lagoonGraphQL.mutation('removeUserFromOrganization', ({ variables }) => {
    const { organization, email } = variables as { organization: number; email: string };
    stateStore.remove('orgUsers', String(organization), (item: { email: string }) => item.email === email);
    stateStore.remove('orgOwners', String(organization), (item: { email: string }) => item.email === email);
    return HttpResponse.json({ data: { removeUserFromOrganization: { id: organization } } });
  }),

  lagoonGraphQL.mutation('removeUserFromOrganizationGroups', ({ variables }) => {
    const { organization, email } = variables as { organization: number; email: string };
    stateStore.remove('orgUsers', String(organization), (item: { email: string }) => item.email === email);
    return HttpResponse.json({ data: { removeUserFromOrganizationGroups: { id: organization } } });
  }),

  lagoonGraphQL.mutation('addGroupToOrganization', ({ variables }) => {
    const { group, organization } = variables as { group: string; organization: number };

    const newGroup = {
      id: String(stateStore.generateId()),
      name: group,
      type: 'null',
      memberCount: 0,
    };

    stateStore.upsert('orgGroups', String(organization), newGroup, (e: typeof newGroup, n: typeof newGroup) => e.name === n.name);
    stateStore.upsert('orgGroups', 'all', newGroup, (e: typeof newGroup, n: typeof newGroup) => e.name === n.name);

    for (const key of [String(organization), 'test-organization']) {
      const org = getState<Record<string, unknown>>('orgOverview', key);
      if (org && typeof org === 'object') {
        const orgObj = org as Record<string, unknown>;
        const existingGroups = (orgObj.groups as { id: string; name: string; type: string; memberCount: number }[]) || [];
        stateStore.setState('orgOverview', key, { ...orgObj, groups: [...existingGroups, newGroup] });
      }
    }

    return HttpResponse.json({ data: { addGroupToOrganization: { name: group } } });
  }),

  lagoonGraphQL.mutation('addGroupMember', ({ variables }) => {
    const { email, group, role } = variables as { email: string; group: string; role: string };

    const newMember = {
      role,
      user: { firstName: email.split('@')[0], lastName: 'User', email, comment: null },
    };

    stateStore.upsert('groupMembers', group, newMember, (e: typeof newMember, n: typeof newMember) => e.user.email === n.user.email);
    return HttpResponse.json({ data: { addGroupMember: { id: stateStore.generateId() } } });
  }),

  lagoonGraphQL.mutation('deleteGroup', ({ variables }) => {
    const { groupName } = variables as { groupName: string };
    stateStore.remove('orgGroups', 'all', (item: { name: string }) => item.name === groupName);
    return HttpResponse.json({ data: { deleteGroup: 'success' } });
  }),

  lagoonGraphQL.mutation('addUserToGroup', ({ variables }) => {
    const { email, group, role, inviteUser } = variables as { email: string; group: string; role: string; inviteUser?: boolean };

    if (inviteUser === false) {
      return HttpResponse.json({
        data: null,
        errors: [{ message: `User ${email} does not exist and invite is disabled` }],
      });
    }

    const newMember = {
      role,
      user: { firstName: email.split('@')[0], lastName: 'User', email, comment: null },
    };

    stateStore.upsert('groupMembers', group, newMember, (e: { user: { email: string } }, n: { user: { email: string } }) => e.user.email === n.user.email);

    const orgGroups = stateStore.getState('orgGroups', 'all') as { name: string; memberCount: number }[] | undefined;
    if (orgGroups) {
      const updatedGroups = orgGroups.map(g => g.name === group ? { ...g, memberCount: g.memberCount + 1 } : g);
      stateStore.setState('orgGroups', 'all', updatedGroups);
    }

    for (let i = 1; i <= 10; i++) {
      const existingUsers = stateStore.getState('orgUsers', String(i));
      if (existingUsers) {
        const newOrgUser = {
          id: String(stateStore.generateId()),
          firstName: email.split('@')[0],
          lastName: 'User',
          email,
          groupRoles: [{ id: String(stateStore.generateId()), role }],
          has2faEnabled: false,
          isFederatedUser: false,
        };
        stateStore.upsert('orgUsers', String(i), newOrgUser, (e: { email: string }, n: { email: string }) => e.email === n.email);
        break;
      }
    }

    for (let i = 1; i <= 10; i++) {
      const key = `${i}-${email}`;
      const userGroups = stateStore.getState('userGroupRoles', key) as { id: string; name: string; role: string; groupType: string }[] | undefined;
      if (userGroups) {
        const updated = userGroups.map(g => g.name === group ? { ...g, role } : g);
        stateStore.setState('userGroupRoles', key, updated);
        break;
      }
    }

    return HttpResponse.json({ data: { addUserToGroup: { name: group } } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('removeUserFromGroup') || !query.includes('groupId')) return undefined;

    const { email, groupId } = variables as { email: string; groupId: string };
    stateStore.remove('groupMembers', groupId, (item: { user: { email: string } }) => item.user.email === email);

    for (let i = 1; i <= 10; i++) {
      const key = `${i}-${email}`;
      const userGroups = stateStore.getState('userGroupRoles', key);
      if (userGroups) {
        stateStore.remove('userGroupRoles', key, (item: { id: string }) => item.id === groupId);
        break;
      }
    }

    return HttpResponse.json({ data: { removeUserFromGroup: { id: groupId, name: 'removed-group' } } } as never);
  }),

  lagoonGraphQL.mutation('removeUserFromGroup', ({ variables }) => {
    const { groupName, email } = variables as { groupName: string; email: string };
    stateStore.remove('groupMembers', groupName, (item: { user: { email: string } }) => item.user.email === email);
    return HttpResponse.json({ data: { removeUserFromGroup: { name: groupName } } });
  }),

  lagoonGraphQL.mutation('addProjectToGroup', ({ variables }) => {
    const { projectName, groupName } = variables as { projectName: string; groupName: string };

    const newProject = { id: stateStore.generateId(), name: projectName };
    stateStore.upsert('groupProjects', groupName, newProject, (e: { name: string }, n: { name: string }) => e.name === n.name);

    const project = getState<Record<string, unknown>>('orgProject', projectName);
    if (project && typeof project === 'object') {
      const projectObj = project as Record<string, unknown>;
      const existingGroups = (projectObj.groups as { id: string; name: string; type: string; memberCount: number }[]) || [];

      const org = getState<Record<string, unknown>>('orgProjectOrg', 'test-organization');
      const orgGroups = org && typeof org === 'object' ? ((org as Record<string, unknown>).groups as { name: string; type: string }[]) || [] : [];
      const groupInfo = orgGroups.find(g => g.name === groupName);

      const newGroup = {
        id: String(stateStore.generateId()),
        name: groupName,
        type: groupInfo?.type || 'null',
        memberCount: 0,
      };

      stateStore.setState('orgProject', projectName, { ...projectObj, groups: [...existingGroups, newGroup] } );
    }

    return HttpResponse.json({ data: { addProjectToGroup: { name: groupName } } });
  }),

  lagoonGraphQL.mutation('removeGroupFromProject', ({ variables }) => {
    const { groupName, projectName } = variables as { groupName: string; projectName: string };

    stateStore.remove('groupProjects', groupName, (item: { name: string }) => item.name === projectName);

    const project = getState<Record<string, unknown>>('orgProject', projectName);
    if (project && typeof project === 'object') {
      const projectObj = project as Record<string, unknown>;
      const existingGroups = (projectObj.groups as { name: string }[]) || [];
      stateStore.setState('orgProject', projectName, { ...projectObj, groups: existingGroups.filter(g => g.name !== groupName) } );
    }

    return HttpResponse.json({ data: { removeGroupFromProject: { name: groupName } } });
  }),

  lagoonGraphQL.mutation('addNotificationToProject', ({ variables }) => {
    const { projectName, notificationType, notificationName } = variables as {
      projectName: string; notificationType: string; notificationName: string;
    };

    const project = getState<Record<string, unknown>>('orgProject', projectName);
    if (project && typeof project === 'object') {
      const projectObj = project as Record<string, unknown>;
      const existingNotifications = (projectObj.notifications as { name: string; type: string }[]) || [];
      const newNotification = { name: notificationName, type: notificationType.toUpperCase() };
      stateStore.setState('orgProject', projectName, { ...projectObj, notifications: [...existingNotifications, newNotification] } );
    }

    return HttpResponse.json({ data: { addNotificationToProject: { id: stateStore.generateId() } } });
  }),

  lagoonGraphQL.mutation('removeNotificationFromProject', ({ variables }) => {
    const { projectName, notificationName } = variables as { projectName: string; notificationType: string; notificationName: string };

    const project = getState<Record<string, unknown>>('orgProject', projectName);
    if (project && typeof project === 'object') {
      const projectObj = project as Record<string, unknown>;
      const existingNotifications = (projectObj.notifications as { name: string; type: string }[]) || [];
      stateStore.setState('orgProject', projectName, { ...projectObj, notifications: existingNotifications.filter(n => n.name !== notificationName) } );
    }

    return HttpResponse.json({ data: { removeNotificationFromProject: { name: notificationName } } });
  }),

  lagoonGraphQL.mutation('cancelDeployment', ({ variables }) => {
    const { deploymentId } = variables as { deploymentId: number };

    for (const key of ENV_KEYS) {
      const deployments = stateStore.getState('deployments', key) as { id: number; status: string; completed?: string }[] | undefined;
      if (deployments) {
        const updated = deployments.map(d => d.id === deploymentId ? { ...d, status: 'cancelled', completed: new Date().toISOString() } : d);
        stateStore.setState('deployments', key, updated);
      }
    }

    return HttpResponse.json({ data: { cancelDeployment: 'success' } });
  }),

  lagoonGraphQL.mutation('deployEnvironmentLatest', () => {
    for (const key of ENV_KEYS) {
      const deployments = stateStore.getState('deployments', key);
      if (deployments) {
        const newDeployment = {
          id: stateStore.generateId(),
          name: `build-${Date.now()}`,
          status: 'pending',
          created: new Date().toISOString(),
          buildStep: null,
          started: null,
          completed: null,
          bulkId: null,
          priority: 5,
          sourceType: 'API',
        };
        stateStore.setState('deployments', key, [newDeployment, ...(deployments as object[])]);
        break;
      }
    }

    return HttpResponse.json({ data: { deployEnvironmentLatest: 'success' } });
  }),

  lagoonGraphQL.mutation('cancelTask', ({ variables }) => {
    const { taskId, taskName } = variables as { taskId: number; taskName: string };

    const taskEnv = getState<{ tasks: Record<string, unknown>[] }>('task', taskName);
    if (taskEnv?.tasks?.[0]) {
      const updatedTaskEnv = { ...taskEnv };
      updatedTaskEnv.tasks = [...taskEnv.tasks];
      updatedTaskEnv.tasks[0] = { ...updatedTaskEnv.tasks[0], status: 'cancelled', completed: new Date().toISOString() };
      stateStore.setState('task', taskName, updatedTaskEnv);
    }

    for (const key of ENV_KEYS) {
      const tasks = stateStore.getState('tasks', key) as { id: number; status: string }[] | undefined;
      if (tasks) {
        const updated = tasks.map(t => t.id === taskId ? { ...t, status: 'cancelled', completed: new Date().toISOString() } : t);
        stateStore.setState('tasks', key, updated);
      }
    }

    return HttpResponse.json({ data: { cancelTask: 'success', cancelDeployment: 'success' } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    const taskMutations = [
      'taskDrushCacheClear', 'taskDrushCron', 'taskDrushSqlSync', 'taskDrushRsyncFiles',
      'taskDrushSqlDump', 'taskDrushArchiveDump', 'taskDrushUserLogin', 'invokeRegisteredTask',
    ];

    const matchedMutation = taskMutations.find(m => query.includes(m));
    if (!matchedMutation) return undefined;

    const newTask = {
      id: stateStore.generateId(),
      name: matchedMutation.replace('taskDrush', 'drush-').replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
      taskName: `task-${Date.now()}`,
      status: 'pending',
      created: new Date().toISOString(),
      started: null,
      completed: null,
      service: 'cli',
      adminOnlyView: false,
      remoteId: null,
      command: matchedMutation,
    };

    for (const key of ENV_KEYS) {
      const tasks = stateStore.getState('tasks', key);
      if (tasks) {
        stateStore.setState('tasks', key, [newTask, ...(tasks as object[])]);
        break;
      }
    }

    return HttpResponse.json({ data: { [matchedMutation]: newTask } } as never);
  }),

  lagoonGraphQL.mutation('addRestore', ({ variables }) => {
    const { input } = variables as { input: { backupId: string } };

    const restoreId = stateStore.generateId();
    for (const key of ENV_KEYS) {
      const backups = stateStore.getState('backups', key) as { backupId: string; restore: unknown }[] | undefined;
      if (backups) {
        const updated = backups.map(b => b.backupId === input.backupId ? {
        ...b,
        restore: {
          id: restoreId,
          status: 'successful',
          restoreLocation: `https://storage.example.com/restore/${input.backupId}.tar.gz`,
          restoreSize: 2048000,
        },
        } : b);
        stateStore.setState('backups', key, updated);
      }
    }

    return HttpResponse.json({ data: { addRestore: { id: restoreId } } });
  }),

  lagoonGraphQL.mutation('addRouteToProject', ({ variables }) => {
    const { input } = variables as {
      input: { project: string; domain: string; environment: string; service: string };
    };

    const newRoute = {
      id: stateStore.generateId(),
      domain: input.domain,
      type: 'route',
      primary: false,
      service: input.service,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      source: 'API',
      environment: {
        id: 1,
        name: input.environment,
        kubernetesNamespaceName: `${input.project}-${input.environment}`,
        environmentType: 'development',
      },
    };

    for (const key of ENV_KEYS) {
      const routes = stateStore.getState('routes', key);
      if (routes) {
        stateStore.upsert('routes', key, newRoute, (e: typeof newRoute, n: typeof newRoute) => e.domain === n.domain);
        break;
      }
    }

    for (const key of PROJECT_KEYS) {
      const routes = stateStore.getState('projectRoutes', key);
      if (routes) {
        stateStore.upsert('projectRoutes', key, newRoute, (e: typeof newRoute, n: typeof newRoute) => e.domain === n.domain);
        break;
      }
    }

    return HttpResponse.json({ data: { addRouteToProject: { id: newRoute.id } } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('addOrUpdateRouteOnEnvironment')) return undefined;

    const { domain, environment, service, primary, type } = variables as {
      domain: string; environment: string; project: string; service: string; primary?: boolean; type?: string;
    };

    type RouteType = { domain: string; service: string; primary: boolean; type: string; updated: string; [key: string]: unknown };

    for (const key of ENV_KEYS) {
      const routes = stateStore.getState<RouteType>('routes', key);
      if (routes) {
        const existingIndex = routes.findIndex(r => r.domain === domain);
        if (existingIndex >= 0) {
          const updated = [...routes];
          updated[existingIndex] = {
            ...updated[existingIndex],
            service,
            primary: primary ?? false,
            type: type ?? 'route',
            updated: new Date().toISOString(),
          };
          stateStore.setState('routes', key, updated);
        } else {
          const newRoute = {
            id: stateStore.generateId(),
            domain,
            type: type ?? 'route',
            primary: primary ?? false,
            service,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            source: 'API',
            environment: { id: 1, name: environment, kubernetesNamespaceName: key, environmentType: 'production' },
          };
          stateStore.upsert('routes', key, newRoute);
        }
      }
    }

    for (const key of PROJECT_KEYS) {
      const routes = stateStore.getState<RouteType>('projectRoutes', key);
      if (routes) {
        const existingIndex = routes.findIndex(r => r.domain === domain);
        if (existingIndex >= 0) {
          const updated = [...routes];
          updated[existingIndex] = {
            ...updated[existingIndex],
            service,
            primary: primary ?? false,
            type: type ?? 'route',
            updated: new Date().toISOString(),
          };
          stateStore.setState('projectRoutes', key, updated);
        }
      }
    }

    return HttpResponse.json({ data: { addOrUpdateRouteOnEnvironment: { id: stateStore.generateId() } } } as never);
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('removeRouteFromEnvironment')) return undefined;

    const { domain } = variables as { domain: string };
    for (const key of ENV_KEYS) {
      stateStore.remove('routes', key, (item: { domain: string }) => item.domain === domain);
    }
    for (const key of PROJECT_KEYS) {
      stateStore.remove('projectRoutes', key, (item: { domain: string }) => item.domain === domain);
    }

    return HttpResponse.json({ data: { removeRouteFromEnvironment: { id: 1 } } } as never);
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('deleteRoute')) return undefined;

    const { id } = variables as { id: number };
    for (const key of PROJECT_KEYS) {
      stateStore.remove('projectRoutes', key, (item: { id: number }) => item.id === id);
    }
    for (const key of ENV_KEYS) {
      stateStore.remove('routes', key, (item: { id: number }) => item.id === id);
    }

    return HttpResponse.json({ data: { deleteRoute: 'success' } } as never);
  }),

  lagoonGraphQL.mutation('updateOrganizationFriendlyName', ({ variables }) => {
    const { id, friendlyName } = variables as { id: number; friendlyName: string };

    for (const key of [String(id), 'test-organization']) {
      const org = getState<Record<string, unknown>>('orgOverview', key);
      if (org && typeof org === 'object') {
        stateStore.setState('orgOverview', key, { ...org, friendlyName } );
      }
    }

    return HttpResponse.json({ data: { updateOrganization: { id, friendlyName } } });
  }),

  lagoonGraphQL.mutation('updateOrganizationDescription', ({ variables }) => {
    const { id, description } = variables as { id: number; description: string };

    for (const key of [String(id), 'test-organization']) {
      const org = getState<Record<string, unknown>>('orgOverview', key);
      if (org && typeof org === 'object') {
        stateStore.setState('orgOverview', key, { ...org, description } );
      }
    }

    return HttpResponse.json({ data: { updateOrganization: { id, description } } });
  }),

  lagoonGraphQL.mutation('addProjectToOrganization', ({ variables }) => {
    const { organization, name } = variables as {
      organization: number; name: string; gitUrl: string; productionEnvironment: string; kubernetes: number;
    };

    const newProject = { id: stateStore.generateId(), name, groupCount: 0 };

    for (const key of [String(organization), 'test-organization']) {
      const projects = stateStore.getState('orgProjects', key) as { id: number; name: string; groupCount: number }[] | undefined;
      if (projects) {
        stateStore.setState('orgProjects', key, [...projects, newProject]);
      }

      const org = getState<Record<string, unknown>>('orgOverview', key);
      if (org && typeof org === 'object') {
        const orgObj = org as Record<string, unknown>;
        const existingProjects = (orgObj.projects as { id: number; name: string; groupCount: number }[]) || [];
        stateStore.setState('orgOverview', key, { ...orgObj, projects: [...existingProjects, newProject] } );
      }
    }

    return HttpResponse.json({ data: { addProject: { id: newProject.id, name: newProject.name } } });
  }),

  lagoonGraphQL.mutation('deleteProject', ({ variables }) => {
    const { project } = variables as { project: string };

    for (const key of ORG_KEYS) {
      const projects = stateStore.getState('orgProjects', key) as { name: string }[] | undefined;
      if (projects) {
        stateStore.setState('orgProjects', key, projects.filter(p => p.name !== project));
      }
    }

    return HttpResponse.json({ data: { deleteProject: 'success' } });
  }),

  lagoonGraphQL.mutation('deleteEnvironment', ({ variables }) => {
    const { input } = variables as { input: { name: string; project: string } };

    const projectData = getState<Record<string, unknown>>('projectEnvironments', input.project);
    if (projectData?.environments) {
      const updatedEnvironments = (projectData.environments as { name: string }[]).filter(env => env.name !== input.name);
      stateStore.setState('projectEnvironments', input.project, { ...projectData, environments: updatedEnvironments });
    }

    return HttpResponse.json({ data: { deleteEnvironment: 'success' } });
  }),

  lagoonGraphQL.operation(({ query, variables }) => {
    if (!query.includes('deployEnvironmentBranch')) return undefined;

    const { project, branch } = variables as { project: string; branch: string };

    const projectData = getState<Record<string, unknown>>('projectEnvironments', project);
    if (projectData?.environments) {
      const newEnvironment = {
        id: stateStore.generateId(),
        name: branch,
        deployType: 'branch',
        environmentType: 'development',
        deployBaseRef: branch,
        deployHeadRef: branch,
        deployTitle: branch,
        updated: new Date().toISOString(),
        routes: null,
        openshiftProjectName: `${project}-${branch}`,
        kubernetesNamespaceName: `${project}-${branch}`,
        openshift: { friendlyName: 'Development', cloudRegion: 'US-WEST' },
        project: { name: project, problemsUi: 0, factsUi: 0 },
        problems: [],
        deployments: [],
        pendingChanges: [],
      };

      stateStore.setState('projectEnvironments', project, {
        ...projectData,
        environments: [...(projectData.environments as unknown[]), newEnvironment],
      });
    }

    return HttpResponse.json({ data: { deployEnvironmentBranch: 'success' } } as never);
  }),

  lagoonGraphQL.mutation('switchActiveStandby', ({ variables }) => {
    const { input } = variables as { input: { project: { name: string } } };

    for (const key of ['project-main', 'project-standby', 'test-project-main', 'test-project-standby']) {
      const env = getState<Record<string, unknown>>('environmentOverview', key);
      if (env && (env as { project?: { name?: string } }).project?.name === input.project.name) {
        const project = env.project as Record<string, unknown>;
        const oldProd = project.productionEnvironment;
        const oldStandby = project.standbyProductionEnvironment;

        stateStore.setState('environmentOverview', key, {
          ...env,
          project: { ...project, productionEnvironment: oldStandby, standbyProductionEnvironment: oldProd },
        });
      }
    }

    return HttpResponse.json({
      data: { switchActiveStandby: { id: 1, remoteId: 'switch-' + Date.now() } },
    });
  }),

  lagoonGraphQL.mutation('updateUser', ({ variables }) => {
    const { email, sshKeyChanges, groupRoleChanges, organizationRoleChanges } = variables as {
      email: string; sshKeyChanges: boolean; groupRoleChanges: boolean; organizationRoleChanges: boolean;
    };

    const updatedPreferences = { sshKeyChanges, groupRoleChanges, organizationRoleChanges };
    stateStore.setState('userPreferences', 'current', updatedPreferences );

    return HttpResponse.json({
      data: { updateUser: { email, emailNotifications: updatedPreferences } },
    });
  }),

  ...notificationHandlers,
];
