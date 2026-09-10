import { createMemoryStore } from './memory';
import { createStorageStore } from './storage';

/**
 * Supported persistence types for feature flags.
 */
export const PERSISTENCE_TYPES = {
  MEMORY: 'memory',
  LOCAL_STORAGE: 'localStorage',
  SESSION_STORAGE: 'sessionStorage',
  CUSTOM: 'custom',
} as const;

/**
 * Factory functions for creating feature flags stores based on persistence type.
 */
export const STORE_FACTORY = {
  [PERSISTENCE_TYPES.MEMORY]: createMemoryStore,
  [PERSISTENCE_TYPES.LOCAL_STORAGE]: (
    initialFlags: Record<string, boolean> | undefined,
    key: string,
  ) => createStorageStore(PERSISTENCE_TYPES.LOCAL_STORAGE, key, initialFlags),
  [PERSISTENCE_TYPES.SESSION_STORAGE]: (
    initialFlags: Record<string, boolean> | undefined,
    key: string,
  ) => createStorageStore(PERSISTENCE_TYPES.SESSION_STORAGE, key, initialFlags),
} as const;
