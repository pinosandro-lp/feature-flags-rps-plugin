import type { PERSISTENCE_TYPES } from '../utils/persistence';

/**
 * Persistence types and options for feature flags.
 */
export type PersistenceType =
  (typeof PERSISTENCE_TYPES)[keyof typeof PERSISTENCE_TYPES];

/**
 * Persistence types that do not require a storage key.
 */
export type PersistenceTypeWithoutStorageKey = Extract<
  PersistenceType,
  typeof PERSISTENCE_TYPES.MEMORY | typeof PERSISTENCE_TYPES.CUSTOM
>;

/**
 * Persistence types that require a storage key.
 */
export type PersistenceTypeWithStorageKey = Exclude<
  PersistenceType,
  PersistenceTypeWithoutStorageKey
>;
