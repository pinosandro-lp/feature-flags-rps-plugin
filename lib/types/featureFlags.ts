import type { PluginOptions } from '@pinosandro/react-plugin-system';
import type { PERSISTENCE_TYPES } from '../utils/persistence';
import type {
  PersistenceType,
  PersistenceTypeWithStorageKey,
} from './persistence';

/**
 * Feature Flags Store Interface
 * Defines the contract for a feature flags store implementation.
 */
export interface IFeatureFlagsStore {
  /**
   * Retrieves the value of a feature flag by its key.
   * @param key The key of the feature flag.
   * @returns The value of the feature flag, or undefined if it does not exist.
   */
  get(key: string): boolean | undefined;
  /**
   * Updates the value of a feature flag by its key.
   * @param key The key of the feature flag.
   * @param value The new value of the feature flag.
   */
  set(key: string, value: boolean): void;
  /**
   * Returns all feature flags as a key-value record.
   * @returns A record containing all feature flags.
   */
  getAll(): Record<string, boolean>;
  /**
   * Checks if a feature flag exists by its key.
   * @param key The key of the feature flag.
   * @returns True if the feature flag exists, false otherwise.
   */
  has(key: string): boolean;
  /**
   * Removes a feature flag by its key.
   * @param key The key of the feature flag to remove.
   */
  delete(key: string): void;
  /**
   * Removes all feature flags from the store.
   */
  clear(): void;
  /**
   * Resets all feature flags to their initial values.
   */
  reset(): void;
}

/**
 * Feature Flags Plugin Options Base Interface
 * Defines the common options for feature flags plugin configurations.
 */
interface FeatureFlagsOptionsBase extends PluginOptions {
  /**
   * The type of persistence to use for the feature flags. By default, it is 'memory'.
   */
  type?: PersistenceType;
  /**
   * The storage key to use when persisting feature flags. By default, it is 'featureFlags'.
   */
  storageKey?: string;
  /**
   * A custom feature flags store implementation.
   */
  createCustomStore?: (
    initialFlags?: Record<string, boolean>,
  ) => IFeatureFlagsStore;
  /**
   * The initial set of feature flags.
   */
  initialFlags?: Record<string, boolean>;
}

/**
 * Feature Flags Storage Options Interface
 * Defines the options for feature flags plugin when using storage-based persistence.
 */
export interface FeatureFlagsStorageOptions extends FeatureFlagsOptionsBase {
  type?: PersistenceTypeWithStorageKey;
  storageKey?: string;
  createCustomStore?: never;
}

/**
 * Feature Flags Memory Options Interface
 * Defines the options for feature flags plugin when using memory-based persistence.
 */
export interface FeatureFlagsMemoryOptions extends FeatureFlagsOptionsBase {
  type?: typeof PERSISTENCE_TYPES.MEMORY;
  storageKey?: never;
  createCustomStore?: never;
}

/**
 * Feature Flags Custom Options Interface
 * Defines the options for feature flags plugin when using a custom persistence implementation.
 */
export interface FeatureFlagsCustomOptions extends FeatureFlagsOptionsBase {
  type?: typeof PERSISTENCE_TYPES.CUSTOM;
  createCustomStore?: (
    initialFlags?: Record<string, boolean>,
  ) => IFeatureFlagsStore;
  storageKey?: never;
}
