import type { IFeatureFlagsStore } from '../types/featureFlags';

/**
 * Creates an in-memory feature flags store.
 * @param initialFlags Initial feature flags to populate the store with.
 * @returns An object implementing the `IFeatureFlagsStore` interface.
 */
export function createMemoryStore(
  initialFlags?: Record<string, boolean>,
): IFeatureFlagsStore {
  const store = new Map<string, boolean>(Object.entries(initialFlags ?? {}));

  return {
    get(key: string): boolean | undefined {
      return store.get(key);
    },

    set(key: string, value: boolean): void {
      store.set(key, value);
    },

    getAll(): Record<string, boolean> {
      return Object.fromEntries(store);
    },

    has(key: string): boolean {
      return store.has(key);
    },

    delete(key: string): void {
      store.delete(key);
    },

    clear(): void {
      store.clear();
    },

    reset(): void {
      store.clear();
      if (initialFlags) {
        Object.entries(initialFlags).forEach(([key, value]) => {
          store.set(key, value);
        });
      }
    },
  } satisfies IFeatureFlagsStore;
}
