import type { PersistenceType } from '../types/persistence';
import { FEATURE_FLAGS_PLUGIN_ID, type FeatureFlagsOptions } from '../plugin';
import { PERSISTENCE_TYPES, STORE_FACTORY } from './persistence';
import type { IFeatureFlagsStore } from '../types/featureFlags';

/**
 * Validates the options provided for the feature flags API client.
 * Throws an error if the options are invalid.
 * @param type The type of persistence to use for storing feature flags.
 * @param customStore The custom store to use for the custom persistence type.
 * @throws Will throw an error if the custom store is not provided for the custom persistence type.
 */
export function validateApiOptions(
  type: PersistenceType,
  createCustomStore: FeatureFlagsOptions['createCustomStore'],
): void {
  if (type === PERSISTENCE_TYPES.CUSTOM && !createCustomStore) {
    throw new Error(
      `${FEATURE_FLAGS_PLUGIN_ID}: Custom store must be provided for custom persistence type`,
    );
  }
}

/**
 * Creates a feature flags store based on the specified persistence type and options.
  validateApiOptions(type, createCustomStore);
 * @param options Options for configuring the feature flags store.
  const store = createStore(type, { initialFlags, customStore: createCustomStore, storageKey });
 */
export function createStore(
  type: PersistenceType,
  options: Pick<
    FeatureFlagsOptions,
    'initialFlags' | 'createCustomStore' | 'storageKey'
  >,
): IFeatureFlagsStore {
  const { initialFlags, createCustomStore, storageKey } = options ?? {};

  if (type === PERSISTENCE_TYPES.CUSTOM) {
    return createCustomStore!(initialFlags);
  }

  const typeWithoutCustom = type as Exclude<
    PersistenceType,
    typeof PERSISTENCE_TYPES.CUSTOM
  >;

  return STORE_FACTORY[typeWithoutCustom](
    initialFlags,
    storageKey ?? 'featureFlags',
  );
}
