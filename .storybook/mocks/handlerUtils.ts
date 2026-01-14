import { graphql, HttpResponse } from 'msw';

import { stateStore } from './statefulStore';

export const ORG_KEYS = ['1', 'test-organization'];
export const ENV_KEYS = ['project-main', 'test-project-main'];
export const PROJECT_KEYS = ['test-project'];

export function getStateOrDefault<T>(entityType: string, key: string, defaultValue: T): T {
  const state = stateStore.getState(entityType, key);
  if (state !== undefined) {
    return (Array.isArray(state) ? state[0] : state) as T;
  }
  return defaultValue;
}

export function getStateArrayOrDefault<T>(entityType: string, key: string, defaultValue: T[]): T[] {
  const state = stateStore.getState(entityType, key);
  return (state as T[]) ?? defaultValue;
}

export function updateStateAcrossKeys<T>(
  entityType: string,
  keys: string[],
  updater: (current: T | undefined) => T
): void {
  for (const key of keys) {
    const current = stateStore.getState(entityType, key) as T | undefined;
    const updated = updater(current);
    stateStore.setState(entityType, key, updated as unknown as unknown[]);
  }
}

export function findAndUpdateInKeys<T extends Record<string, unknown>>(
  entityType: string,
  keys: string[],
  predicate: (item: T) => boolean,
  updater: (item: T) => T
): void {
  for (const key of keys) {
    const items = stateStore.getState(entityType, key) as T[] | undefined;
    if (items) {
      const updated = items.map(item => (predicate(item) ? updater(item) : item));
      stateStore.setState(entityType, key, updated as unknown[]);
    }
  }
}

export function removeFromKeys<T>(
  entityType: string,
  keys: string[],
  predicate: (item: T) => boolean
): void {
  for (const key of keys) {
    stateStore.remove(entityType, key, predicate);
  }
}

export function queryIncludesAll(query: string, fields: string[]): boolean {
  return fields.every(field => query.includes(field));
}

export function queryIncludesAny(query: string, fields: string[]): boolean {
  return fields.some(field => query.includes(field));
}

export function queryIncludesNone(query: string, fields: string[]): boolean {
  return !fields.some(field => query.includes(field));
}

type NotificationType = 'Slack' | 'RocketChat' | 'Email' | 'MicrosoftTeams' | 'Webhook';

type NotificationFieldMap = {
  Slack: { webhook: string; channel: string };
  RocketChat: { webhook: string; channel: string };
  Email: { emailAddress: string };
  MicrosoftTeams: { webhook: string };
  Webhook: { webhook: string };
};

const notificationStateKeys: Record<NotificationType, string> = {
  Slack: 'slacks',
  RocketChat: 'rocketchats',
  Email: 'emails',
  MicrosoftTeams: 'teams',
  Webhook: 'webhook',
};

export function createAddNotificationHandler<T extends NotificationType>(
  type: T,
  extractFields: (variables: Record<string, unknown>) => NotificationFieldMap[T]
) {
  return graphql.mutation(`addNotification${type}`, ({ variables }) => {
    const { organization, name } = variables as { organization: number; name: string };
    const fields = extractFields(variables as Record<string, unknown>);

    const newNotification = { name, ...fields, __typename: `Notification${type}` };
    const stateKey = notificationStateKeys[type];

    for (const key of ORG_KEYS) {
      const notifications = getStateOrDefault<Record<string, unknown[]>>('notifications', key, null);
      if (notifications && typeof notifications === 'object') {
        const existing = notifications[stateKey] || [];
        stateStore.setState('notifications', key, {
          ...notifications,
          [stateKey]: [...existing, newNotification],
        });
      }
    }

    return HttpResponse.json({
      data: {
        [`addNotification${type}`]: newNotification,
      },
    });
  });
}

export function createUpdateNotificationHandler(type: NotificationType) {
  const stateKey = notificationStateKeys[type];

  return graphql.mutation(`UpdateNotification${type}`, ({ variables }) => {
    const { name, patch } = variables as {
      name: string;
      patch: Record<string, unknown>;
    };

    for (const key of ORG_KEYS) {
      const notifications = getStateOrDefault<Record<string, unknown[]>>('notifications', key, null);
      if (notifications && notifications[stateKey]) {
        const updated = (notifications[stateKey] as { name: string }[]).map(n =>
          n.name === name ? { ...n, ...patch } : n
        );
        stateStore.setState('notifications', key, { ...notifications, [stateKey]: updated });
      }
    }

    return HttpResponse.json({
      data: {
        [`updateNotification${type}`]: { name: (patch.name as string) || name, ...patch },
      },
    });
  });
}

export function createDeleteNotificationHandler(type: NotificationType) {
  const stateKey = notificationStateKeys[type];
  const mutationName = `deleteNotification${type}`;

  return graphql.operation(({ query, variables }) => {
    if (!query.includes('mutation removeNotification') || !query.includes(mutationName)) {
      return;
    }

    const { name } = variables as { name: string };

    for (const key of ORG_KEYS) {
      const notifications = getStateOrDefault<Record<string, unknown[]>>('notifications', key, null);
      if (notifications && notifications[stateKey]) {
        const filtered = (notifications[stateKey] as { name: string }[]).filter(n => n.name !== name);
        stateStore.setState('notifications', key, { ...notifications, [stateKey]: filtered });
      }
    }

    return HttpResponse.json({ data: { [mutationName]: 'success' } });
  });
}

export const notificationFieldExtractors: {
  [K in NotificationType]: (v: Record<string, unknown>) => NotificationFieldMap[K];
} = {
  Slack: v => ({ webhook: v.webhook as string, channel: v.channel as string }),
  RocketChat: v => ({ webhook: v.webhook as string, channel: v.channel as string }),
  Email: v => ({ emailAddress: v.emailAddress as string }),
  MicrosoftTeams: v => ({ webhook: v.webhook as string }),
  Webhook: v => ({ webhook: v.webhook as string }),
};

export const NOTIFICATION_TYPES: NotificationType[] = ['Slack', 'RocketChat', 'Email', 'MicrosoftTeams', 'Webhook'];
