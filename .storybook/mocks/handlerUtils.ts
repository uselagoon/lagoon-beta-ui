import { stateStore } from './statefulStore';

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

export function queryIncludesAll(query: string, fields: string[]): boolean {
  return fields.every(field => query.includes(field));
}

export function queryIncludesNone(query: string, fields: string[]): boolean {
  return !fields.some(field => query.includes(field));
}
