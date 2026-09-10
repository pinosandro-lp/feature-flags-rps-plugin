import { PERSISTENCE_TYPES } from './persistence';
import type { PersistenceTypeWithStorageKey } from '../types/persistence';
import type { IFeatureFlagsStore } from '../types/featureFlags';
import { FEATURE_FLAGS_PLUGIN_ID } from '../plugin';

/**
 * Retrieves the appropriate storage object based on the persistence type. Returns `null` if the type is not supported.
 * @param type The persistence type for which to retrieve the storage object.
 * @returns The corresponding `Storage` object, or `null` if the type is not supported.
 */
function getStorage(type: PersistenceTypeWithStorageKey): Storage | null {
  if (typeof window === 'undefined') {
    return null;
  }

  switch (type) {
    case PERSISTENCE_TYPES.LOCAL_STORAGE:
      return window.localStorage;
    case PERSISTENCE_TYPES.SESSION_STORAGE:
      return window.sessionStorage;
    default:
      return null;
  }
}

/**
 * Reads the feature flags from the given storage using the specified key.
 * Returns `null` if the stored data is not a valid feature flags record.
 * @param storage The storage object from which to read the data.
 * @param key The key under which the feature flags are stored.
 * @returns The parsed feature flags record, or `null` if invalid or not found.
 */
function readFromStorage(
  storage: Storage,
  key: string,
): Record<string, boolean> | null {
  try {
    const stored = storage.getItem(key);

    if (!stored) return null;

    const parsed: unknown = JSON.parse(stored);

    if (!isFeatureFlagsRecord(parsed)) {
      return null;
    }

    return parsed;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      `${FEATURE_FLAGS_PLUGIN_ID}: Failed to parse stored flags`,
      error,
    );

    return null;
  }
}

/**
 * Checks if the given value is a valid feature flags record.
 * @param value The value to check.
 * @returns `true` if the value is a valid feature flags record, `false` otherwise.
 */
function isFeatureFlagsRecord(
  value: unknown,
): value is Record<string, boolean> {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false;
  }

  return Object.values(value).every(value => typeof value === 'boolean');
}

/**
 * Compares the initial feature flags with the stored ones and updates the storage if there are differences.
 * @param storage The storage object to update.
 * @param persistenceKey The key under which the main feature flags are stored.
 * @param initialFlagsKey The key under which the initial feature flags are stored.
 * @param initialFlags The initial feature flags to compare and update.
 */
export function diffAndUpdateStorage(
  storage: Storage,
  persistenceKey: string,
  initialFlagsKey: string,
  initialFlags: Record<string, boolean>,
): void {
  const storedInitialFlags = readFromStorage(storage, initialFlagsKey) ?? {};

  const storedInitialFlagsKeys = Object.keys(storedInitialFlags);
  const initialFlagsKeys = Object.keys(initialFlags);

  const hasDifferentKeys =
    storedInitialFlagsKeys.length !== initialFlagsKeys.length ||
    initialFlagsKeys.some(key => !(key in storedInitialFlags));

  const hasDifferentValues = initialFlagsKeys.some(
    key => storedInitialFlags[key] !== initialFlags[key],
  );

  const hasDifferences = hasDifferentKeys || hasDifferentValues;

  if (hasDifferences) {
    storage.setItem(initialFlagsKey, JSON.stringify(initialFlags));

    const store = readFromStorage(storage, persistenceKey) ?? {};

    const newInitialFlags = initialFlagsKeys.filter(key => !(key in store));

    for (const key of newInitialFlags) {
      store[key] = initialFlags[key];
    }

    storage.setItem(persistenceKey, JSON.stringify(store));
  }
}

/**
 * Creates a feature flags store backed by the specified storage type.
 * @param type The persistence type with storage key.
 * @param persistenceKey The key under which the main feature flags are stored.
 * @param initialFlags The initial feature flags to populate the store with.
 * @returns An object implementing the `IFeatureFlagsStore` interface.
 */
export function createStorageStore(
  type: PersistenceTypeWithStorageKey,
  persistenceKey: string,
  initialFlags?: Record<string, boolean>,
): IFeatureFlagsStore {
  const storage = getStorage(type);

  if (!storage) {
    throw new Error(
      `${FEATURE_FLAGS_PLUGIN_ID}: Storage of type ${type} is not available`,
    );
  }

  const initialFlagsKey = `${persistenceKey}_initial_flags`;

  if (initialFlags) {
    diffAndUpdateStorage(
      storage,
      persistenceKey,
      initialFlagsKey,
      initialFlags,
    );
  }

  return {
    get(key: string): boolean | undefined {
      const stored = readFromStorage(storage, persistenceKey) ?? {};
      return stored[key];
    },

    set(key: string, value: boolean): void {
      const stored = readFromStorage(storage, persistenceKey) ?? {};
      stored[key] = value;

      storage.setItem(persistenceKey, JSON.stringify(stored));
    },

    getAll(): Record<string, boolean> {
      return readFromStorage(storage, persistenceKey) ?? {};
    },

    has(key: string): boolean {
      const stored = readFromStorage(storage, persistenceKey) ?? {};
      return key in stored;
    },

    delete(key: string): void {
      const all = readFromStorage(storage, persistenceKey) ?? {};
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [key]: _, ...rest } = all;

      storage.setItem(persistenceKey, JSON.stringify(rest));
    },

    clear(): void {
      storage.removeItem(persistenceKey);
    },

    reset(): void {
      if (initialFlags) {
        const stringifiedInitialFlags = JSON.stringify(initialFlags);

        storage.setItem(persistenceKey, stringifiedInitialFlags);
        storage.setItem(initialFlagsKey, stringifiedInitialFlags);
      } else {
        storage.removeItem(persistenceKey);
        storage.removeItem(initialFlagsKey);
      }
    },
  } satisfies IFeatureFlagsStore;
}
