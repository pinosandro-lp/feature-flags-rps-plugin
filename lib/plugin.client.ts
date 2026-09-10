import type { PluginDepsMap } from '@pinosandro/react-plugin-system';
import type { FeatureFlagsDeps, FeatureFlagsOptions } from './plugin';
import type { FeatureFlagsApi } from './plugin.api';
import { createStore, validateApiOptions } from './utils/client';
import { PERSISTENCE_TYPES } from './utils/persistence';
import { createSubscriberStore } from './utils/subscribe';

/**
 * Creates an API client for managing feature flags.
 * @param _deps The dependencies map for the plugin. Currently unused.
 * @param options The options for configuring the feature flags API client.
 * @returns An object implementing the `FeatureFlagsApi` interface.
 */
export function createApiClient(
  _deps: PluginDepsMap<FeatureFlagsDeps>,
  options?: FeatureFlagsOptions,
): FeatureFlagsApi {
  const {
    initialFlags,
    createCustomStore,
    type = PERSISTENCE_TYPES.MEMORY,
    storageKey,
  } = options ?? {};

  validateApiOptions(type, createCustomStore);

  const store = createStore(type, {
    initialFlags,
    createCustomStore,
    storageKey,
  });
  const { subscribe, notify, notifyAll } = createSubscriberStore();

  return {
    isEnabled(key): boolean {
      return store.get(key) ?? false;
    },

    get(key): boolean | undefined {
      return store.get(key);
    },

    getAll(): Record<string, boolean> {
      return store.getAll();
    },

    set(key, value): void {
      if (store.get(key) === value) return;

      store.set(key, value);
      notify(key);
    },

    remove(key): void {
      if (!store.has(key)) return;

      store.delete(key);
      notify(key);
    },

    clear(): void {
      store.clear();
      notifyAll();
    },

    toggle(key): void {
      const currentValue = store.get(key);

      if (currentValue === undefined) return;

      store.set(key, !currentValue);
      notify(key);
    },

    subscribe(key, callback): () => void {
      return subscribe(key, callback);
    },
  };
}
