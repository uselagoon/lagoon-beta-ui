type EntityMap<T> = Map<string, T[]>;
type StateMap = Map<string, EntityMap<unknown>>;

class StatefulMockStore {
  private state: StateMap = new Map();
  private idCounter = 1000;

  getState<T>(entityType: string, key: string): T[] | undefined {
    const entityMap = this.state.get(entityType);
    if (!entityMap) return undefined;
    const data = entityMap.get(key);
    return data ? (structuredClone(data) as T[]) : undefined;
  }

  setState<T>(entityType: string, key: string, data: T | T[]): void {
    if (!this.state.has(entityType)) {
      this.state.set(entityType, new Map());
    }
    const dataToStore = Array.isArray(data) ? data : [data];
    this.state.get(entityType)!.set(key, structuredClone(dataToStore));
  }

  generateId(): number {
    return ++this.idCounter;
  }

  upsert<T>(
    entityType: string,
    key: string,
    item: T,
    matchFn?: (existing: T, newItem: T) => boolean
  ): T[] {
    const current = this.getState<T>(entityType, key) || [];
    const existingIndex = matchFn ? current.findIndex(e => matchFn(e, item)) : -1;

    if (existingIndex >= 0) {
      current[existingIndex] = { ...current[existingIndex], ...item };
    } else {
      const itemWithId = typeof item === 'object' && item !== null && !('id' in item)
        ? { ...item, id: this.generateId() }
        : item;
      current.push(itemWithId as T);
    }

    this.setState(entityType, key, current);
    return current;
  }

  remove<T>(entityType: string, key: string, matchFn: (item: T) => boolean): T[] {
    const current = this.getState<T>(entityType, key) || [];
    const filtered = current.filter(item => !matchFn(item));
    this.setState(entityType, key, filtered);
    return filtered;
  }

  reset(): void {
    this.state.clear();
    this.idCounter = 1000;
  }

  resetEntity(entityType: string): void {
    this.state.delete(entityType);
  }
}

export const stateStore = new StatefulMockStore();
