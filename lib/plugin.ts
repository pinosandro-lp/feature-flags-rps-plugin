import { createPlugin, type PluginDeps } from '@pinosandro/react-plugin-system';
import type { FeatureFlagsApi } from './plugin.api';
import { createApiClient } from './plugin.client';
import type {
  FeatureFlagsCustomOptions,
  FeatureFlagsMemoryOptions,
  FeatureFlagsStorageOptions,
} from './types/featureFlags';

declare module '@pinosandro/react-plugin-system' {
  interface PluginApiStore {
    [FEATURE_FLAGS_PLUGIN_ID]: FeatureFlagsApi;
  }
}

/**
 * Feature Flags Plugin ID
 */
export const FEATURE_FLAGS_PLUGIN_ID = '@pinosandro/feature-flags-rps-plugin';

/**
 * Feature Flags Plugin ID
 */
export type FeatureFlagsId = typeof FEATURE_FLAGS_PLUGIN_ID;

/**
 * Feature Flags Plugin Dependencies
 */
export interface FeatureFlagsDeps extends PluginDeps {}

/**
 * Feature Flags Plugin Options
 * Supports configuration for memory, storage, and custom persistence options.
 */
export type FeatureFlagsOptions =
  | FeatureFlagsMemoryOptions
  | FeatureFlagsStorageOptions
  | FeatureFlagsCustomOptions;

/**
 * Feature Flags Plugin
 * Provides feature flag management capabilities within the application.
 * Supports memory, storage, and custom persistence strategies.
 */
export const featureFlagsPlugin = createPlugin<
  FeatureFlagsId,
  FeatureFlagsDeps,
  FeatureFlagsOptions
>({
  id: FEATURE_FLAGS_PLUGIN_ID,
  createApiClient,
});
